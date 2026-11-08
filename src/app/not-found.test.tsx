import { render, screen } from "@testing-library/react";

import NotFound from "./not-found";

it("ofrece volver al inicio", () => {
  render(<NotFound />);

  expect(screen.getByText("No encontramos esta página")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/");
});
