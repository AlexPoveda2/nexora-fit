import type { HealthPort } from "@/features/health/application/get-health";
import type { HealthStatus } from "@/features/health/domain/health-status";

export class FakeHealthRepository implements HealthPort {
  constructor(private readonly response: HealthStatus = { status: "ok", database: "ok" }) {}

  async getHealth(): Promise<HealthStatus> {
    return this.response;
  }
}
