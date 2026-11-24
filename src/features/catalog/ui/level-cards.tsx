import { CalendarCheck, CalendarDays, Clock, type LucideIcon } from "lucide-react";

import { Card } from "@/shared/ui/card";

import { levelLabel } from "../domain/levels";
import type { LevelSummary } from "../domain/public-plan";

function plural(count: number, singular: string, pluralForm: string): string {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

// Los dos niveles (planeación §4.3, design system §11.2): una tarjeta por nivel con la fila de
// datos "4 semanas · 3 días · 50 min" y "Qué logras". Los números son los que guarda Sam en el
// panel (UpdateLevel); el front solo los muestra.
export function LevelCards({ levels }: { levels: LevelSummary[] }) {
  if (levels.length === 0) return null;
  return (
    <section aria-labelledby="niveles-titulo">
      <h2 id="niveles-titulo" className="font-display text-display-2 tracking-[0.01em]">
        {levels.length === 1 ? "El nivel" : `Los ${levels.length} niveles`}
      </h2>
      <ul className="mt-8 grid gap-6 md:grid-cols-2">
        {levels.map((level) => (
          <li key={level.level}>
            <LevelCard level={level} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function LevelCard({ level }: { level: LevelSummary }) {
  const facts: { icon: LucideIcon; text: string }[] = [
    { icon: CalendarDays, text: plural(level.weeks, "semana", "semanas") },
    { icon: CalendarCheck, text: `${plural(level.daysPerWeek, "día", "días")} por semana` },
    { icon: Clock, text: `${level.minutesPerSession} min por sesión` },
  ];
  return (
    <Card className="h-full gap-4 px-4 text-base md:px-6">
      <h3 className="font-display text-display-3 tracking-[0.01em]">{levelLabel(level.level)}</h3>
      <ul className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {facts.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-1.5">
            <Icon aria-hidden className="size-4" />
            {text}
          </li>
        ))}
      </ul>
      <div>
        <h4 className="text-sm font-semibold">Qué logras</h4>
        <p className="mt-1">{level.outcome}</p>
      </div>
    </Card>
  );
}
