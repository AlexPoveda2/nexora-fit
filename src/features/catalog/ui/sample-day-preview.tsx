import { Lock } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

import type { ProductRef } from "../domain/catalog";
import type { SampleBlock, SampleDay } from "../domain/public-plan";
import { blockTitle, fillerBlockCount } from "../domain/sample-day";

type SampleDayPreviewProps = {
  day: SampleDay;
  planName: string;
  /** `null` si el plan no tiene producto activo: no hay a dónde mandar el botón. */
  product: ProductRef | null;
};

// Anchos de las barras de relleno: varían para que parezcan renglones, no una rejilla.
const FILLER_ROWS = [
  { name: "w-3/4", detail: "w-1/3" },
  { name: "w-2/3", detail: "w-1/4" },
  { name: "w-4/5", detail: "w-2/5" },
] as const;

// Ejemplo de un día de rutina (planeación §4.6, design system §12.3). La API entrega solo el
// primer bloque real y cuántos más tiene el día (`hiddenBlocks`). Lo demás se dibuja con barras
// de relleno: no son texto, están fuera del árbol de accesibilidad y no se pueden seleccionar.
// El contenido real del resto del día nunca llega al navegador.
// `blur-xs` (4 px) es el `blur-sm` del design system §12.3: Tailwind v4 corrió la escala y su
// `blur-sm` ahora son 8 px, con lo que las barras ya no se leen como renglones.
export function SampleDayPreview({ day, planName, product }: SampleDayPreviewProps) {
  const fillers = fillerBlockCount(day.hiddenBlocks);

  return (
    <section aria-labelledby="dia-ejemplo-titulo">
      <h2 id="dia-ejemplo-titulo" className="font-display text-display-2 tracking-[0.01em]">
        Así es un día de entrenamiento
      </h2>
      <Card className="mt-8 gap-6 px-4 text-base md:px-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-xl font-semibold">{day.title}</h3>
          <span className="text-muted-foreground shrink-0 text-sm tabular-nums">
            {day.durationMin} min
          </span>
        </div>

        {day.blocks.map((block, index) => (
          <RealBlock key={index} block={block} />
        ))}

        {fillers > 0 && (
          <div className="relative min-h-60">
            <div
              aria-hidden
              data-testid="relleno"
              className="pointer-events-none flex flex-col gap-6 blur-xs select-none"
            >
              {Array.from({ length: fillers }, (_, index) => (
                <FillerBlock key={index} />
              ))}
            </div>
            <div className="from-card/0 via-card/85 to-card absolute inset-0 flex flex-col items-center justify-end gap-3 bg-linear-to-b pb-2 text-center">
              <Lock aria-hidden className="size-6" />
              <p className="max-w-xs text-sm">
                {day.hiddenBlocks === 1
                  ? "1 bloque más en el plan completo"
                  : `${day.hiddenBlocks} bloques más en el plan completo`}
              </p>
              {product ? (
                <Button asChild variant="cta" size="lg">
                  <Link href={`/checkout/${product.slug}`}>Desbloquear el plan de {planName}</Link>
                </Button>
              ) : (
                <p className="text-muted-foreground text-sm">Pronto a la venta</p>
              )}
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}

function RealBlock({ block }: { block: SampleBlock }) {
  return (
    <div>
      <h4 className="text-xl font-semibold">{blockTitle(block)}</h4>
      {block.exercises.length > 0 && (
        <ul className="mt-3 flex flex-col gap-3">
          {block.exercises.map((exercise, index) => (
            <li key={`${index}-${exercise.name}`}>
              <p className="font-medium">{exercise.name}</p>
              {exercise.repsOrTime && (
                <p className="text-muted-foreground text-sm">{exercise.repsOrTime}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FillerBlock() {
  return (
    <div>
      <div className="bg-muted h-6 w-40 rounded" />
      <div className="mt-3 flex flex-col gap-3">
        {FILLER_ROWS.map((row) => (
          <div key={row.name} className="flex flex-col gap-1.5">
            <div className={`bg-muted h-4 rounded ${row.name}`} />
            <div className={`bg-muted h-3 rounded ${row.detail}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
