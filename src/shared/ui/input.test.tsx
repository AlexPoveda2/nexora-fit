import { render, screen } from "@testing-library/react";

import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";

// El borde de error es `danger` (#f87171 en oscuro), no `destructive` (#b42318 en los dos
// temas, casi invisible sobre negro). Spec Input de nexorafit-design-system.
it.each([
  ["Input", Input],
  ["Textarea", Textarea],
] as const)("%s marca el error con el token danger", (_, Field) => {
  render(
    <>
      <Label htmlFor="campo">Correo</Label>
      <Field id="campo" aria-invalid="true" />
    </>,
  );

  const field = screen.getByLabelText("Correo");
  expect(field).toBeInvalid();
  expect(field.className).toContain("aria-invalid:border-danger");
  expect(field.className).not.toContain("destructive");
});
