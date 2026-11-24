import { render, screen, within } from "@testing-library/react";

import type { SampleDay } from "../domain/public-plan";
import { MAX_FILLER_BLOCKS } from "../domain/sample-day";
import { SampleDayPreview } from "./sample-day-preview";

const day: SampleDay = {
  title: "Día 1 · Guardia y recto",
  durationMin: 50,
  blocks: [
    {
      type: "warmup",
      title: null,
      exercises: [
        { name: "Movilidad articular general", repsOrTime: "5 min" },
        { name: "Salto de cuerda", repsOrTime: null },
      ],
    },
  ],
  hiddenBlocks: 2,
};

const product = { slug: "plan-boxeo", priceCop: 160000 };

function renderPreview(overrides: Partial<SampleDay> = {}, withProduct = true) {
  return render(
    <SampleDayPreview
      day={{ ...day, ...overrides }}
      planName="Boxeo"
      product={withProduct ? product : null}
    />,
  );
}

it("muestra el encabezado del día y el primer bloque real con sus ejercicios", () => {
  renderPreview();

  const section = screen.getByRole("region", { name: "Así es un día de entrenamiento" });
  expect(within(section).getByRole("heading", { name: "Día 1 · Guardia y recto" })).toBeVisible();
  expect(within(section).getByText("50 min")).toBeInTheDocument();
  expect(within(section).getByRole("heading", { name: "Calentamiento" })).toBeInTheDocument();
  expect(within(section).getByText("Movilidad articular general")).toBeInTheDocument();
  expect(within(section).getByText("5 min")).toBeInTheDocument();
  expect(within(section).getByText("Salto de cuerda")).toBeInTheDocument();
});

it("dibuja un bloque de relleno por cada bloque oculto, sin texto y fuera de la accesibilidad", () => {
  renderPreview({ hiddenBlocks: 2 });

  const filler = screen.getByTestId("relleno");
  expect(filler).toHaveAttribute("aria-hidden", "true");
  expect(filler).toHaveClass("select-none", "blur-xs");
  expect(filler.children).toHaveLength(2);
  // Solo barras: nunca texto, ni real ni inventado.
  expect(filler.textContent).toBe("");
});

it("limita la cantidad de bloques de relleno", () => {
  renderPreview({ hiddenBlocks: 12 });

  expect(screen.getByTestId("relleno").children).toHaveLength(MAX_FILLER_BLOCKS);
  expect(screen.getByText("12 bloques más en el plan completo")).toBeInTheDocument();
});

it("encima del relleno ofrece desbloquear el plan, que lleva al checkout", () => {
  renderPreview({ hiddenBlocks: 1 });

  expect(screen.getByText("1 bloque más en el plan completo")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Desbloquear el plan de Boxeo" })).toHaveAttribute(
    "href",
    "/checkout/plan-boxeo",
  );
});

it("sin producto a la venta no muestra el botón", () => {
  renderPreview({}, false);

  expect(screen.queryByRole("link", { name: /Desbloquear/ })).not.toBeInTheDocument();
  expect(screen.getByText("Pronto a la venta")).toBeInTheDocument();
});

it("si el día no tiene más bloques no dibuja relleno ni candado", () => {
  renderPreview({ hiddenBlocks: 0 });

  expect(screen.queryByTestId("relleno")).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /Desbloquear/ })).not.toBeInTheDocument();
});
