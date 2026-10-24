import type { AxiosInstance } from "axios";

import { HealthHttpRepository } from "./health-http-repository";

function fakeAxios(data: unknown): AxiosInstance {
  return { get: jest.fn().mockResolvedValue({ data }) } as unknown as AxiosInstance;
}

it("mapea la respuesta de la API al tipo de dominio", async () => {
  const http = fakeAxios({ status: "degraded", database: "error" });
  const repository = new HealthHttpRepository(http);

  const health = await repository.getHealth();

  expect(health).toEqual({ status: "degraded", database: "error" });
  expect(http.get).toHaveBeenCalledWith("/api/v1/health");
});
