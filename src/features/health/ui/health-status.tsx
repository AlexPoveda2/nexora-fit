"use client";

import { useQuery } from "@tanstack/react-query";

import { useContainer } from "@/core/use-container";

import { getHealth } from "../application/get-health";

// Componente temporal para verificar el proxy /api/v1 end to end (TF-4). HUF-3 lo retira.
export function HealthStatus() {
  const { health } = useContainer();
  const query = useQuery({
    queryKey: ["health"],
    queryFn: () => getHealth(health),
  });

  if (query.isPending) return <p>Verificando conexión con el back…</p>;
  if (query.isError) return <p role="alert">No se pudo conectar con el back.</p>;

  return (
    <p data-testid="health-status">
      API: {query.data.status} · base de datos: {query.data.database}
    </p>
  );
}
