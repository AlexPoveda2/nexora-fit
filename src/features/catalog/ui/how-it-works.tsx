import { CreditCard, Dumbbell, KeyRound, type LucideIcon } from "lucide-react";

import { Container } from "@/shared/ui/container";

const STEPS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: CreditCard,
    title: "Elige tu deporte y paga en línea",
    description: "Con tarjeta, PSE, Nequi o Bancolombia.",
  },
  {
    icon: KeyRound,
    title: "Recibe tu código de acceso",
    description: "Al instante, en pantalla y en tu correo.",
  },
  {
    icon: Dumbbell,
    title: "Entra y entrena",
    description: "Rutinas día a día y videos de técnica, desde el celular o el PC.",
  },
];

// Cómo funciona (planeación §3.4, design system §11.2): 3 pasos con número, ícono de 32 px en
// un círculo de 56 px, título y una línea. Fondo humo (muted) para alternar con la bienvenida.
export function HowItWorks() {
  return (
    <section
      aria-labelledby="como-funciona-titulo"
      id="como-funciona"
      className="bg-muted py-16 md:py-24"
    >
      <Container>
        <h2 id="como-funciona-titulo" className="font-display text-display-2 tracking-[0.01em]">
          Cómo funciona
        </h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4 md:flex-col">
              <div className="bg-background flex size-14 shrink-0 items-center justify-center rounded-full">
                <step.icon className="size-8" aria-hidden />
              </div>
              <div>
                {/* El <ol> ya anuncia el orden: el número es solo visual. */}
                <p aria-hidden className="text-muted-foreground text-sm font-semibold tabular-nums">
                  Paso {index + 1}
                </p>
                <h3 className="mt-1 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground mt-1">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
