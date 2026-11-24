import { render, screen, within } from "@testing-library/react";

import { samplePublicPlan } from "@/test/fakes/fake-catalog-repository";

import { PlanHeader } from "./plan-header";

const { name, description, imageUrl, audience } = samplePublicPlan;

it("muestra el nombre como título de la página, la descripción y para quién es", () => {
  render(
    <PlanHeader name={name} description={description} imageUrl={imageUrl} audience={audience} />,
  );

  expect(screen.getByRole("heading", { level: 1, name: "Boxeo" })).toBeInTheDocument();
  expect(screen.getByText(description)).toBeInTheDocument();
  const list = screen.getByRole("list", { name: "Para quién es" });
  expect(
    within(list)
      .getAllByRole("listitem")
      .map((item) => item.textContent),
  ).toEqual(["Nunca has boxeado", "Quieres mejorar tu cardio"]);
});

it("sin foto deja el bloque de respaldo y no pinta una imagen rota", () => {
  render(<PlanHeader name={name} description={description} imageUrl={null} audience={[]} />);

  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(document.querySelector("img")).toBeNull();
});

it("con foto la pinta decorativa, y sin viñetas omite 'Para quién es'", () => {
  render(
    <PlanHeader
      name={name}
      description={description}
      imageUrl="https://img.example.com/boxeo.jpg"
      audience={[]}
    />,
  );

  expect(document.querySelector("img")).toHaveAttribute("alt", "");
  expect(screen.queryByText("Para quién es")).not.toBeInTheDocument();
});
