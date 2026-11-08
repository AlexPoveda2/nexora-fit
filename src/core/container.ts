import type { AxiosInstance } from "axios";

import type { CatalogRepository } from "@/features/catalog/application/ports";
import { HttpCatalogRepository } from "@/features/catalog/infrastructure/http-catalog-repository";
import type { HealthPort } from "@/features/health/application/get-health";
import { HealthHttpRepository } from "@/features/health/infrastructure/health-http-repository";
import { createHttpClient } from "@/shared/infrastructure/http/client";

// Puertos que el composition root entrega a la UI. Cada feature agrega el suyo y su
// implementación en createContainer() (guía front §2.4).
export type Container = {
  catalog: CatalogRepository;
  health: HealthPort;
};

// El cliente HTTP usa rutas relativas: el navegador siempre habla con el proxy /api/v1 de
// Next (next.config.ts), nunca directo con el back (evita CORS y expone solo una cookie).
export function createContainer(http: AxiosInstance = createHttpClient("")): Container {
  return {
    catalog: new HttpCatalogRepository(http),
    health: new HealthHttpRepository(http),
  };
}
