import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import { mockRouter } from "./next-navigation";

function GoToPlans() {
  const router = useRouter();
  return <button onClick={() => router.push("/mis-planes")}>Entrar</button>;
}

it("las pruebas ven a dónde navega un componente", async () => {
  render(<GoToPlans />);

  await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

  expect(mockRouter.push).toHaveBeenCalledWith("/mis-planes");
});

it("el router se limpia entre pruebas", () => {
  expect(mockRouter.push).not.toHaveBeenCalled();
});
