import Image from "next/image";
import Link from "next/link";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { PriceTag } from "@/shared/ui/price-tag";

import type { PlanSummary } from "../domain/catalog";
import { formatLevels } from "../domain/levels";

// Deportes (planeación §3.5, design system §11.2): sección oscura con una tarjeta por plan.
// `id="deportes"` es el destino de "Ver planes" (hero) y de "Planes" (barra superior).
export function SportCards({ plans }: { plans: PlanSummary[] }) {
  if (plans.length === 0) return null;
  return (
    <section
      aria-labelledby="deportes-titulo"
      id="deportes"
      className="dark bg-background text-foreground py-16 md:py-24"
    >
      <Container>
        <h2 id="deportes-titulo" className="font-display text-display-2 tracking-[0.01em]">
          Elige tu plan
        </h2>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <li key={plan.slug}>
              <SportCard plan={plan} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

// Toda la tarjeta es el enlace, pero con un solo foco: el enlace es el nombre y se estira con
// after:inset-0 (design system §10.4); el anillo de foco se dibuja en la tarjeta. "Ver plan" es
// solo visual: el nombre ya dice adónde va.
function SportCard({ plan }: { plan: PlanSummary }) {
  return (
    <article className="group bg-card text-card-foreground has-[a:focus-visible]:outline-ring relative flex h-full flex-col overflow-hidden rounded-lg border has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2">
      <div className="bg-muted relative aspect-4/5">
        {plan.imageUrl && (
          // `unoptimized`: el dominio del bucket de fotos aún no está en images.remotePatterns
          // (las fotos de Sam no existen todavía, planeación front §8). Mientras la API no envíe
          // foto queda el bloque `bg-muted` con la misma proporción, sin saltos de layout.
          <Image
            src={plan.imageUrl}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 md:p-6">
        <h3 className="font-display text-display-3 tracking-[0.01em]">
          <Link
            href={`/planes/${plan.slug}`}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {plan.name}
          </Link>
        </h3>
        <p className="text-muted-foreground text-sm">{plan.tagline}</p>
        {plan.levels.length > 0 && <Badge variant="outline">{formatLevels(plan.levels)}</Badge>}
        <div className="mt-auto flex flex-col gap-4 pt-2">
          {plan.product ? (
            <PriceTag priceCop={plan.product.priceCop} size="sm" />
          ) : (
            <p className="text-muted-foreground text-sm">Pronto a la venta</p>
          )}
          <span
            aria-hidden
            className={cn(
              buttonVariants({ variant: "outline" }),
              "group-hover:bg-accent group-hover:text-accent-foreground w-full",
            )}
          >
            Ver plan
          </span>
        </div>
      </div>
    </article>
  );
}
