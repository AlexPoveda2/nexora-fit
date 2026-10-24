"use client";

import { createContext, useContext } from "react";

import type { Container } from "./container"; // solo el tipo: no arrastra implementaciones

export const ContainerContext = createContext<Container | null>(null);

export function useContainer(): Container {
  const container = useContext(ContainerContext);
  if (!container) throw new Error("useContainer fuera de <Providers>");
  return container;
}
