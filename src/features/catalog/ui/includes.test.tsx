import { render, screen } from "@testing-library/react";

import { Includes } from "./includes";

it("lista lo que incluye cada plan", () => {
  render(<Includes />);

  expect(
    screen.getByRole("heading", { level: 2, name: "Qué incluye cada plan" }),
  ).toBeInTheDocument();
  expect(screen.getAllByRole("listitem")).toHaveLength(4);
  expect(screen.getByRole("heading", { level: 3, name: "Videos de técnica" })).toBeInTheDocument();
});
