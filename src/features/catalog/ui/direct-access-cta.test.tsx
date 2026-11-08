import { render, screen } from "@testing-library/react";

import { sampleCatalog } from "@/test/fakes/fake-catalog-repository";

import { DirectAccessCta } from "./direct-access-cta";

it("muestra el precio y los días del acceso directo y lleva a su página", () => {
  render(<DirectAccessCta offer={sampleCatalog.directAccess!} />);

  expect(
    screen.getByRole("heading", { level: 2, name: "¿Quieres un plan hecho solo para ti?" }),
  ).toBeInTheDocument();
  expect(screen.getByText("$ 80.000")).toBeInTheDocument();
  expect(screen.getByText("30 días de chat conmigo")).toBeInTheDocument();
  const cta = screen.getByRole("link", { name: "Hablar con Sam" });
  expect(cta).toHaveAttribute("href", "/acceso-directo");
  expect(cta).toHaveAttribute("data-variant", "cta");
});
