import { render, screen } from "@testing-library/react";

import { Footer } from "./footer";

it("muestra los enlaces legales, Instagram, acceder y el año", () => {
  render(<Footer />);

  expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
    "href",
    "https://instagram.com/nexorafit",
  );
  expect(screen.getByRole("link", { name: "Términos" })).toHaveAttribute("href", "/terminos");
  expect(screen.getByRole("link", { name: "Privacidad" })).toHaveAttribute("href", "/privacidad");
  expect(screen.getByRole("link", { name: "Reembolsos" })).toHaveAttribute("href", "/reembolsos");
  expect(screen.getByRole("link", { name: "Aviso de salud" })).toHaveAttribute(
    "href",
    "/aviso-salud",
  );
  expect(screen.getByRole("link", { name: "Ya tengo código" })).toHaveAttribute("href", "/acceder");
  expect(screen.getByText(`© ${new Date().getFullYear()} Nexora Fit`)).toBeInTheDocument();
});
