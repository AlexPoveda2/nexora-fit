import { Check } from "lucide-react";
import Image from "next/image";

import { Container } from "@/shared/ui/container";

import type { PublicPlan } from "../domain/public-plan";

type PlanHeaderProps = Pick<PublicPlan, "name" | "description" | "imageUrl" | "audience">;

// Encabezado y "Para quién es" de /planes/[deporte] (planeación §4.1–§4.2, design system
// §11.2): sección oscura con la foto 3:2 (21:9 desde md) y el nombre sobre la capa (§8.3). La
// descripción va debajo de la foto y no encima: en 360 px la foto mide 240 px de alto y no
// caben el nombre y 3 líneas sobre la zona oscura.
export function PlanHeader({ name, description, imageUrl, audience }: PlanHeaderProps) {
  return (
    <section aria-labelledby="plan-titulo" className="dark bg-background text-foreground">
      <div className="bg-muted relative isolate aspect-3/2 md:aspect-21/9">
        {imageUrl && (
          // `unoptimized` por la misma razón que en SportCards: el dominio del bucket de fotos
          // aún no está en images.remotePatterns. Sin foto queda el bloque `bg-muted` con la
          // misma proporción (design system §8.2). Es el LCP de la página: `priority`.
          <Image
            src={imageUrl}
            alt=""
            fill
            priority
            fetchPriority="high"
            unoptimized
            sizes="100vw"
            className="-z-10 object-cover"
          />
        )}
        <div
          aria-hidden
          className="from-negro via-negro/70 to-negro/20 absolute inset-0 -z-10 bg-linear-to-t"
        />
        <Container className="flex h-full items-end pb-6 md:pb-10">
          <h1 id="plan-titulo" className="font-display text-display-1 tracking-[0.01em]">
            {name}
          </h1>
        </Container>
      </div>

      <Container className="flex flex-col gap-10 py-10 md:py-14 lg:flex-row lg:gap-16">
        <p className="max-w-prose text-lg">{description}</p>
        {audience.length > 0 && (
          <div className="lg:min-w-72">
            <h2 id="para-quien-titulo" className="text-xl font-semibold">
              Para quién es
            </h2>
            <ul aria-labelledby="para-quien-titulo" className="mt-4 flex flex-col gap-3">
              {audience.map((item, index) => (
                // Texto libre del panel: puede repetirse, así que la posición entra en la key.
                <li key={`${index}-${item}`} className="flex gap-3">
                  <Check aria-hidden className="text-success mt-0.5 size-5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
