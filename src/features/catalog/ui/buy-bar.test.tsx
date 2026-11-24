import { render, screen, within } from "@testing-library/react";

import { BuyBar } from "./buy-bar";

const product = { slug: "plan-boxeo", priceCop: 160000 };
const pack = { slug: "pack-completo", priceCop: 240000 };

it("lleva al checkout del plan desde la tarjeta y desde la barra fija", () => {
  render(<BuyBar planName="Boxeo" product={product} pack={pack} />);

  const links = screen.getAllByRole("link", { name: "Comprar plan de Boxeo" });
  expect(links).toHaveLength(2);
  for (const link of links) expect(link).toHaveAttribute("href", "/checkout/plan-boxeo");
  const card = screen.getByRole("region", { name: "Plan de Boxeo" });
  expect(within(card).getByText("$ 160.000")).toBeInTheDocument();
  expect(document.querySelector("[data-buy-bar]")).toHaveTextContent("$ 160.000");
});

it("ofrece el pack con su precio y enlaza a su página", () => {
  render(<BuyBar planName="Boxeo" product={product} pack={pack} />);

  expect(
    // Intl separa "$" del número con un espacio duro.
    screen.getByRole("link", { name: /^o llévate el pack completo por \$\s240\.000$/ }),
  ).toHaveAttribute("href", "/pack-completo");
});

it("sin producto activo no se puede comprar ni aparece la barra fija", () => {
  render(<BuyBar planName="Boxeo" product={null} pack={pack} />);

  expect(screen.getByText("Pronto a la venta")).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /Comprar/ })).not.toBeInTheDocument();
  expect(document.querySelector("[data-buy-bar]")).toBeNull();
});

it("sin pack a la venta no lo ofrece", () => {
  render(<BuyBar planName="Boxeo" product={product} pack={null} />);

  expect(screen.queryByRole("link", { name: /pack completo/ })).not.toBeInTheDocument();
});
