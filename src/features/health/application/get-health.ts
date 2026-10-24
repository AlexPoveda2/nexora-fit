import type { HealthStatus } from "../domain/health-status";

// Puerto: application no sabe si la implementación es HTTP (guía front §2.1, §3).
export type HealthPort = {
  getHealth(): Promise<HealthStatus>;
};

export async function getHealth(port: HealthPort): Promise<HealthStatus> {
  return port.getHealth();
}
