import { render, screen, within } from "@testing-library/react";

import { EquipmentList } from "./equipment-list";

it("lista el equipo necesario", () => {
  render(<EquipmentList equipment={["Guantes", "Vendas"]} />);

  const section = screen.getByRole("region", { name: "Equipo necesario" });
  expect(
    within(section)
      .getAllByRole("listitem")
      .map((item) => item.textContent),
  ).toEqual(["Guantes", "Vendas"]);
});

it("sin equipo lo dice en vez de dejar la sección vacía", () => {
  render(<EquipmentList equipment={[]} />);

  expect(screen.getByText(/No necesitas equipo/)).toBeInTheDocument();
  expect(screen.queryByRole("list")).not.toBeInTheDocument();
});
