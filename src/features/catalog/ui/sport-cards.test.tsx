import { render, screen, within } from "@testing-library/react";

import { sampleCatalog } from "@/test/fakes/fake-catalog-repository";

import type { PlanSummary } from "../domain/catalog";
import { SportCards } from "./sport-cards";

const boxeo = sampleCatalog.plans[0]!;

it("muestra cada deporte con sus niveles y su precio, y lleva a su página", () => {
  render(<SportCards plans={[boxeo]} />);

  const section = screen.getByRole("region", { name: "Elige tu plan" });
  expect(section).toHaveAttribute("id", "deportes");
  const card = within(section).getByRole("article");
  expect(within(card).getByRole("link", { name: "Boxeo" })).toHaveAttribute(
    "href",
    "/planes/boxeo",
  );
  expect(within(card).getByText("Básico + Intermedio")).toBeInTheDocument();
  expect(within(card).getByText("$ 160.000")).toBeInTheDocument();
});

it("toda la tarjeta tiene un solo enlace", () => {
  render(<SportCards plans={[boxeo]} />);

  expect(within(screen.getByRole("article")).getAllByRole("link")).toHaveLength(1);
});

it("un plan sin producto activo se muestra sin precio", () => {
  const plan: PlanSummary = { ...boxeo, product: null };
  render(<SportCards plans={[plan]} />);

  expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
  expect(screen.getByText("Pronto a la venta")).toBeInTheDocument();
});

it("sin planes no muestra la sección", () => {
  const { container } = render(<SportCards plans={[]} />);

  expect(container).toBeEmptyDOMElement();
});
