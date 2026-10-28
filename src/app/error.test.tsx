import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppError } from "@/shared/domain/errors";

import GlobalError from "./error";

it("muestra el mensaje traducido y llama a reset al reintentar", async () => {
  const user = userEvent.setup();
  const reset = jest.fn();
  jest.spyOn(console, "error").mockImplementation(() => {}); // el componente loguea el error

  render(<GlobalError error={new AppError("NETWORK_ERROR", 0)} reset={reset} />);

  expect(screen.getByRole("alert")).toHaveTextContent("Revisa tu conexión e intenta de nuevo.");

  await user.click(screen.getByRole("button", { name: "Reintentar" }));

  expect(reset).toHaveBeenCalledTimes(1);
});

it("usa el mensaje por defecto para un error inesperado", () => {
  jest.spyOn(console, "error").mockImplementation(() => {});

  render(<GlobalError error={new Error("algo truena")} reset={() => {}} />);

  expect(screen.getByRole("alert")).toHaveTextContent("Algo salió mal. Intenta de nuevo.");
});
