import type { AxiosInstance } from "axios";

import type { components } from "@/shared/infrastructure/api/schema";

import type { HealthPort } from "../application/get-health";
import type { HealthStatus } from "../domain/health-status";

// El tipo generado por openapi-typescript (snake_case tal cual lo expone FastAPI) se mapea
// al tipo de dominio: en este endpoint los nombres ya coinciden, pero el mapeo explícito
// evita que un cambio del contrato se filtre sin querer a domain/ui (guía front §9.6, TF-5).
type HealthResponse = components["schemas"]["HealthResponse"];

function toDomain(response: HealthResponse): HealthStatus {
  return { status: response.status, database: response.database };
}

export class HealthHttpRepository implements HealthPort {
  constructor(private readonly http: AxiosInstance) {}

  async getHealth(): Promise<HealthStatus> {
    const { data } = await this.http.get<HealthResponse>("/api/v1/health");
    return toDomain(data);
  }
}
