import "server-only";

import { cache } from "react";

import { createHttpClient } from "@/shared/infrastructure/http/client";
import { env } from "@/shared/infrastructure/env";

import { createContainer, type Container } from "./container";

/**
 * Solo los puertos públicos y sin sesión: el contenedor se comparte entre peticiones, así que
 * un puerto autenticado (alumno, admin) nunca debe quedar al alcance desde aquí.
 */
export type ServerContainer = Pick<Container, "catalog">;

let container: ServerContainer | undefined;

function createServerContainer(): ServerContainer {
  const { catalog } = createContainer(createHttpClient(env.API_URL));
  // Axios no pasa por el fetch de Next, así que no hay deduplicación automática: cache() de
  // React memoiza por petición, y generateMetadata + la página comparten una sola llamada.
  return {
    catalog: {
      getCatalog: cache(() => catalog.getCatalog()),
      getPlan: cache((slug: string) => catalog.getPlan(slug)),
    },
  };
}

// Contenedor para Server Components (guía front §2.4, §5.1): en el servidor no hay proxy
// /api/v1 al que hablar, así que el cliente apunta directo a API_URL. `server-only` hace
// fallar el build si un Client Component lo importa.
export function getServerContainer(): ServerContainer {
  container ??= createServerContainer();
  return container;
}
