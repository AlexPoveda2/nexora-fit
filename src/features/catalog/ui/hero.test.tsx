import { render, screen } from "@testing-library/react";

import { Hero } from "./hero";

it("tiene el título y lleva a los planes y al plan personalizado", () => {
  render(<Hero />);

  expect(
    screen.getByRole("heading", { level: 1, name: "Entrena conmigo, estés donde estés" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Ver planes" })).toHaveAttribute("href", "/#deportes");
  expect(screen.getByRole("link", { name: "Quiero un plan personalizado" })).toHaveAttribute(
    "href",
    "/acceso-directo",
  );
});

it("solo 'Ver planes' es rojo: un botón de compra por bloque", () => {
  render(<Hero />);

  expect(screen.getByRole("link", { name: "Ver planes" })).toHaveAttribute("data-variant", "cta");
  expect(screen.getByRole("link", { name: "Quiero un plan personalizado" })).toHaveAttribute(
    "data-variant",
    "secondary",
  );
});
