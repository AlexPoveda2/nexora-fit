import { screen, waitFor } from "@testing-library/react";

import { FakeHealthRepository } from "@/test/fakes/fake-health-repository";
import { renderWithContainer } from "@/test/render";

import { HealthStatus } from "./health-status";

it("muestra el estado reportado por el back", async () => {
  renderWithContainer(<HealthStatus />, {
    health: new FakeHealthRepository({ status: "ok", database: "ok" }),
  });

  await waitFor(() => {
    expect(screen.getByTestId("health-status")).toHaveTextContent("API: ok · base de datos: ok");
  });
});

it("avisa si no puede conectarse al back", async () => {
  const failingRepository = {
    getHealth: () => Promise.reject(new Error("network_error")),
  };

  renderWithContainer(<HealthStatus />, { health: failingRepository });

  // El QueryClient por defecto reintenta una vez con backoff antes de marcar error.
  await waitFor(
    () => {
      expect(screen.getByRole("alert")).toHaveTextContent("No se pudo conectar con el back.");
    },
    { timeout: 3000 },
  );
});
