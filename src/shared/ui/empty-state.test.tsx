import { render, screen } from "@testing-library/react";
import { Smile } from "lucide-react";

import { Button } from "./button";
import { EmptyState } from "./empty-state";

it("muestra el título, la descripción y la acción", () => {
  render(
    <EmptyState
      icon={Smile}
      title="Aún no tienes planes"
      description="Cuando compres uno, aparece aquí."
      action={<Button>Ver planes</Button>}
    />,
  );

  expect(screen.getByText("Aún no tienes planes")).toBeInTheDocument();
  expect(screen.getByText("Cuando compres uno, aparece aquí.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Ver planes" })).toBeInTheDocument();
});

it("funciona sin descripción ni acción", () => {
  render(<EmptyState icon={Smile} title="Nada por aquí" />);

  expect(screen.getByText("Nada por aquí")).toBeInTheDocument();
});
