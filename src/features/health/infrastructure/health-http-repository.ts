import type { AxiosInstance } from "axios";

import type { HealthPort } from "../application/get-health";
import type { HealthStatus } from "../domain/health-status";

export class HealthHttpRepository implements HealthPort {
  constructor(private readonly http: AxiosInstance) {}

  async getHealth(): Promise<HealthStatus> {
    const { data } = await this.http.get<HealthStatus>("/api/v1/health");
    return data;
  }
}
