"use client";

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { AppError } from "@/shared/domain/errors";

import { createContainer, type Container } from "./container";
import { ContainerContext } from "./use-container";

// 401 global: cualquier query que reciba un 401 limpia la caché y manda a /acceder
// (guía front §5.4). Las mutaciones nunca reintentan; las queries reintentan una vez,
// salvo en errores 4xx (no tiene sentido repetir una petición mal formada).
function handleUnauthorized(error: unknown, queryClient: QueryClient) {
  if (error instanceof AppError && error.status === 401) {
    queryClient.clear();
    if (typeof window !== "undefined") window.location.href = "/acceder";
  }
}

function createQueryClient(): QueryClient {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (error instanceof AppError && error.status >= 400 && error.status < 500) return false;
          return failureCount < 1;
        },
      },
      mutations: { retry: 0 },
    },
    queryCache: new QueryCache({
      onError: (error) => handleUnauthorized(error, queryClient),
    }),
  });
  return queryClient;
}

type ProvidersProps = {
  container?: Container;
  children: ReactNode;
};

// El container se crea en el cliente: trae instancias de Axios, que no pueden pasar de un
// server component a uno de cliente como prop (solo objetos planos cruzan esa frontera).
// Los tests pasan su propio container de fakes.
export function Providers({ container, children }: ProvidersProps) {
  const [queryClient] = useState(createQueryClient);
  const [ownContainer] = useState(() => container ?? createContainer());

  return (
    <QueryClientProvider client={queryClient}>
      <ContainerContext.Provider value={ownContainer}>{children}</ContainerContext.Provider>
    </QueryClientProvider>
  );
}
