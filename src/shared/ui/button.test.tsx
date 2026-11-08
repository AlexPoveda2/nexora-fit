import { render, screen } from "@testing-library/react";

import { Button } from "./button";

it("destructive usa el token destructive-foreground, no un blanco suelto", () => {
  render(<Button variant="destructive">Anular orden</Button>);

  const button = screen.getByRole("button", { name: "Anular orden" });
  expect(button.className).toContain("text-destructive-foreground");
  expect(button.className).not.toContain("text-white");
});
