import { render, screen, within } from "@testing-library/react";

import { Syllabus } from "./syllabus";

const groups = [
  {
    category: { code: "GOL", name: "Golpes" },
    videos: [
      { id: "BOX-GOL-001", title: "Golpe recto" },
      { id: "BOX-GOL-002", title: "Golpe cruzado" },
    ],
  },
  {
    category: { code: "DEF", name: "Defensas" },
    videos: [{ id: "BOX-DEF-001", title: "Bloqueo" }],
  },
  { category: { code: "VAC", name: "Vacía" }, videos: [] },
];

it("agrupa los títulos de los videos por categoría", () => {
  render(<Syllabus groups={groups} />);

  const golpes = screen.getByRole("list", { name: "Golpes" });
  expect(
    within(golpes)
      .getAllByRole("listitem")
      .map((item) => item.textContent),
  ).toEqual(["Golpe recto", "Golpe cruzado"]);
  expect(
    within(screen.getByRole("list", { name: "Defensas" })).getByText("Bloqueo"),
  ).toBeInTheDocument();
});

it("solo muestra títulos: nada se puede reproducir ni abrir", () => {
  render(<Syllabus groups={groups} />);

  expect(screen.queryByRole("link")).not.toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

it("omite las categorías sin videos y la sección si no queda ninguna", () => {
  const { container, rerender } = render(<Syllabus groups={groups} />);
  expect(screen.queryByRole("heading", { name: "Vacía" })).not.toBeInTheDocument();

  rerender(<Syllabus groups={[groups[2]!]} />);
  expect(container).toBeEmptyDOMElement();
});
