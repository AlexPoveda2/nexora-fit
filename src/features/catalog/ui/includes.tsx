import { CirclePlay, ClipboardList, Layers, type LucideIcon, Smartphone } from "lucide-react";

import { Container } from "@/shared/ui/container";

// Copy de la planeación §3.7, con los íconos del mapa del design system §8.1 (sin emojis).
const ITEMS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: CirclePlay,
    title: "Videos de técnica",
    description: "Cómo hacer cada movimiento: golpe recto, australiana, técnica de carrera…",
  },
  {
    icon: ClipboardList,
    title: "Rutinas escritas día a día",
    description: "Calentamiento, trabajo, intervalos y descansos.",
  },
  {
    icon: Smartphone,
    title: "Desde cualquier dispositivo",
    description: "Entra desde el celular o el PC con tu código de acceso.",
  },
  {
    icon: Layers,
    title: "Dos niveles por deporte",
    description: "Básico e intermedio, para que sigas avanzando.",
  },
];

// Qué incluye cada plan (planeación §3.7, design system §11.2): 2 columnas desde md, ícono de
// 24 px + título + una línea. Contenido fijo: no depende de la API.
export function Includes() {
  return (
    <section aria-labelledby="incluye-titulo" id="que-incluye" className="py-16 md:py-24">
      <Container>
        <h2 id="incluye-titulo" className="font-display text-display-2 tracking-[0.01em]">
          Qué incluye cada plan
        </h2>
        <ul className="mt-12 grid gap-8 md:grid-cols-2">
          {ITEMS.map((item) => (
            <li key={item.title} className="flex gap-4">
              <item.icon className="mt-0.5 size-6 shrink-0" aria-hidden />
              <div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground mt-1">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
