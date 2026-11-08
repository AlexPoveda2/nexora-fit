import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Header } from "./header";

it("tiene el logo, 'Ya tengo código' siempre visible y el menú del celular", async () => {
  const user = userEvent.setup();
  render(<Header />);

  expect(screen.getByRole("link", { name: "Nexora Fit" })).toHaveAttribute("href", "/");

  // "Ya tengo código" está siempre en el DOM (desktop + celular); CSS decide cuál se ve.
  const accederLinks = screen.getAllByRole("link", { name: "Ya tengo código" });
  expect(accederLinks.length).toBeGreaterThanOrEqual(1);
  for (const link of accederLinks) {
    expect(link).toHaveAttribute("href", "/acceder");
  }

  // El Sheet del menú móvil no está montado hasta que se abre.
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Abrir menú" }));

  const menu = screen.getByRole("dialog");
  expect(within(menu).getByText("Nexora Fit")).toBeInTheDocument();
  expect(within(menu).getByRole("button", { name: "Cerrar" })).toBeInTheDocument();
  expect(within(menu).getByRole("link", { name: "Planes" })).toHaveAttribute("href", "/#deportes");
});

it("es siempre legible (fondo sólido) y suma sombra al hacer scroll", () => {
  render(<Header />);
  const header = screen.getByRole("banner");

  expect(header.className).toContain("bg-background");
  expect(header.className).not.toContain("shadow-sm");

  Object.defineProperty(window, "scrollY", { value: 40, configurable: true });
  fireEvent.scroll(window);

  expect(header.className).toContain("shadow-sm");
});

it("mide 56 px en celular y 64 px desde md, debajo de los overlays, sin botones de 36 px", () => {
  render(<Header />);
  const header = screen.getByRole("banner");

  expect(header.className).toContain("z-40");
  const bar = header.firstElementChild as HTMLElement;
  expect(bar.className).toContain("h-14");
  expect(bar.className).toContain("md:h-16");

  // "Ya tengo código" del celular usa el tamaño por defecto (44 px), no "sm" (36 px).
  for (const link of screen.getAllByRole("link", { name: "Ya tengo código" })) {
    expect(link).toHaveAttribute("data-size", "default");
  }
});
