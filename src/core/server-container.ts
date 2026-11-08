import "server-only";

import { createHttpClient } from "@/shared/infrastructure/http/client";
import { env } from "@/shared/infrastructure/env";

import { createContainer, type Container } from "./container";

let container: Container | undefined;

// Contenedor para Server Components (guía front §2.4, §5.1): en el servidor no hay proxy
// /api/v1 al que hablar, así que el cliente apunta directo a API_URL. Solo se usa en páginas
// públicas (catálogo con ISR): nunca lleva la sesión del alumno, por eso se comparte entre
// peticiones. `server-only` hace fallar el build si un Client Component lo importa.
export function getServerContainer(): Container {
  container ??= createContainer(createHttpClient(env.API_URL));
  return container;
}
