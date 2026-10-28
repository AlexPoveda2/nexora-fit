import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ErrorState } from "./error-state";

it("muestra el mensaje y llama a onRetry al hacer clic en Reintentar", async () => {
  const user = userEvent.setup();
  const onRetry = jest.fn();
  render(<ErrorState message="Revisa tu conexión e intenta de nuevo." onRetry={onRetry} />);

  expect(screen.getByRole("alert")).toHaveTextContent("Revisa tu conexión e intenta de nuevo.");

  await user.click(screen.getByRole("button", { name: "Reintentar" }));

  expect(onRetry).toHaveBeenCalledTimes(1);
});

it("no muestra el botón si no hay onRetry", () => {
  render(<ErrorState message="Algo salió mal." />);

  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
