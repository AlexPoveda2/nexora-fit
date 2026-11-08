import { render, screen, within } from "@testing-library/react";

import { HowItWorks } from "./how-it-works";

it("muestra los 3 pasos en orden: pagar, recibir el código y entrenar", () => {
  render(<HowItWorks />);

  const steps = within(screen.getByRole("list")).getAllByRole("listitem");
  expect(steps.map((step) => within(step).getByRole("heading", { level: 3 }).textContent)).toEqual([
    "Elige tu deporte y paga en línea",
    "Recibe tu código de acceso",
    "Entra y entrena",
  ]);
});
