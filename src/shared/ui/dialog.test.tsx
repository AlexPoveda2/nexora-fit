import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

it("el botón de cerrar tiene nombre en español y devuelve el foco al disparador", async () => {
  const user = userEvent.setup();
  render(
    <Dialog>
      <DialogTrigger asChild>
        <Button>Ver técnica</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Golpe recto</DialogTitle>
        <DialogDescription>Video de técnica.</DialogDescription>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>,
  );

  await user.click(screen.getByRole("button", { name: "Ver técnica" }));
  expect(screen.getByRole("dialog", { name: "Golpe recto" })).toBeInTheDocument();
  // La X (sr-only) y el botón del pie dicen "Cerrar"; ninguno queda en inglés.
  expect(screen.getAllByRole("button", { name: "Cerrar" })).toHaveLength(2);
  expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument();

  // La X de la esquina (la que lleva ícono), no el botón del pie.
  const closeX = screen
    .getAllByRole("button", { name: "Cerrar" })
    .find((button) => button.querySelector("svg"));
  expect(closeX).toBeDefined();
  await user.click(closeX!);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Ver técnica" })).toHaveFocus();
});
