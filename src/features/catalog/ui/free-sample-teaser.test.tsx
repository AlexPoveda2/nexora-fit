import { render, screen } from "@testing-library/react";

import { FreeSampleTeaser } from "./free-sample-teaser";

it("muestra el poster con 'Disponible pronto' y el título, sin nada reproducible", () => {
  render(
    <FreeSampleTeaser
      sample={{
        videoId: "BOX-GOL-001",
        title: "Golpe recto",
        posterUrl: "https://p.example/1.jpg",
      }}
    />,
  );

  expect(screen.getByRole("heading", { name: "Video de muestra gratis" })).toBeInTheDocument();
  expect(screen.getByText("Disponible pronto")).toBeInTheDocument();
  expect(screen.getByText("Golpe recto")).toBeInTheDocument();
  expect(document.querySelector("img")).toHaveAttribute("alt", "");
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(document.querySelector("video")).toBeNull();
});

it("sin poster deja el bloque de respaldo", () => {
  render(
    <FreeSampleTeaser sample={{ videoId: "BOX-GOL-001", title: "Golpe recto", posterUrl: null }} />,
  );

  expect(document.querySelector("img")).toBeNull();
  expect(screen.getByText("Disponible pronto")).toBeInTheDocument();
});
