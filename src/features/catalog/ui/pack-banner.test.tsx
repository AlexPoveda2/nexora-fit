import { render, screen } from "@testing-library/react";

import { sampleCatalog } from "@/test/fakes/fake-catalog-repository";

import { PackBanner } from "./pack-banner";

const pack = sampleCatalog.pack!;

it("muestra la suma de los 4 tachada antes del precio del pack", () => {
  render(<PackBanner pack={pack} />);

  expect(
    screen.getByRole("heading", { level: 2, name: "Llévate los 4 deportes" }),
  ).toBeInTheDocument();
  expect(screen.getByText("$ 640.000").tagName).toBe("S");
  expect(screen.getByText("$ 240.000")).toBeInTheDocument();
});

it("el botón lleva al checkout del pack y no es rojo sobre rojo", () => {
  render(<PackBanner pack={pack} />);

  const buy = screen.getByRole("link", { name: "Comprar pack completo" });
  expect(buy).toHaveAttribute("href", "/checkout/pack-completo");
  expect(buy).toHaveAttribute("data-variant", "default");
});
