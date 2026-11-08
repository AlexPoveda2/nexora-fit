import { render, screen } from "@testing-library/react";

import { PriceTag } from "./price-tag";

it("muestra el precio en pesos sin decimales", () => {
  render(<PriceTag priceCop={160000} />);

  expect(screen.getByText("$ 160.000")).toBeInTheDocument();
});

it("el precio tachado se anuncia como 'Antes' y no solo con el estilo", () => {
  const { container } = render(<PriceTag priceCop={240000} beforeCop={640000} />);

  expect(container.querySelector("s")).toHaveTextContent("$ 640.000");
  expect(container.firstChild).toHaveTextContent(/^Antes \$ 640\.000, ahora \$ 240\.000$/);
});

it("conserva el tamaño y el color del precio (tailwind-merge no los mezcla)", () => {
  render(<PriceTag priceCop={160000} size="sm" />);

  expect(screen.getByText("$ 160.000")).toHaveClass("text-display-3", "text-price");
});
