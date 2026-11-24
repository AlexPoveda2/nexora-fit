import { render, screen, within } from "@testing-library/react";

import { samplePublicPlan } from "@/test/fakes/fake-catalog-repository";

import { LevelCards } from "./level-cards";

it("muestra una tarjeta por nivel con sus datos y qué logras", () => {
  render(<LevelCards levels={samplePublicPlan.levels} />);

  const section = screen.getByRole("region", { name: "Los 2 niveles" });
  // Cada tarjeta es el <li> de su título; la fila de datos tiene su propia lista adentro.
  const [basic, intermediate] = within(section)
    .getAllByRole("heading", { level: 3 })
    .map((heading) => heading.closest("li")!);
  expect(within(basic!).getByRole("heading", { level: 3 })).toHaveTextContent("Básico");
  expect(within(basic!).getByText("4 semanas")).toBeInTheDocument();
  expect(within(basic!).getByText("3 días por semana")).toBeInTheDocument();
  expect(within(basic!).getByText("50 min por sesión")).toBeInTheDocument();
  expect(within(basic!).getByText("Dominas los fundamentos de boxeo.")).toBeInTheDocument();
  expect(within(intermediate!).getByRole("heading", { level: 3 })).toHaveTextContent("Intermedio");
  expect(within(intermediate!).getByText("4 días por semana")).toBeInTheDocument();
});

it("usa el singular con una semana o un día", () => {
  render(
    <LevelCards
      levels={[
        { level: "basic", weeks: 1, daysPerWeek: 1, minutesPerSession: 30, outcome: "Pruebas" },
      ]}
    />,
  );

  expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("El nivel");
  expect(screen.getByText("1 semana")).toBeInTheDocument();
  expect(screen.getByText("1 día por semana")).toBeInTheDocument();
});

it("sin niveles no muestra la sección", () => {
  const { container } = render(<LevelCards levels={[]} />);

  expect(container).toBeEmptyDOMElement();
});
