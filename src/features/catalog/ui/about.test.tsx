import { render, screen, within } from "@testing-library/react";

import { About } from "./about";

it("presenta a Sam con sus 3 cifras y 3 fotos", () => {
  render(<About />);

  expect(
    screen.getByRole("heading", { level: 2, name: "Hola, querido atleta" }),
  ).toBeInTheDocument();
  const [stats, photos] = screen.getAllByRole("list");
  expect(within(stats!).getAllByRole("listitem")).toHaveLength(3);
  expect(within(stats!).getByText("años de experiencia")).toBeInTheDocument();
  expect(within(photos!).getAllByRole("img")).toHaveLength(3);
});
