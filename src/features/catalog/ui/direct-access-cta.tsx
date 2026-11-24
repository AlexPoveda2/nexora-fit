import Link from "next/link";

import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { PriceTag } from "@/shared/ui/price-tag";

import type { DirectAccessOffer } from "../domain/catalog";

// Plan personalizado / Acceso directo (planeación §3.8, design system §11.2): sección oscura con
// un solo botón rojo. El precio y los días vienen de /catalog.
export function DirectAccessCta({ offer }: { offer: DirectAccessOffer }) {
  return (
    <section
      aria-labelledby="acceso-directo-titulo"
      id="acceso-directo"
      className="dark bg-background text-foreground py-16 md:py-24"
    >
      <Container>
        <div className="flex max-w-3xl flex-col items-start gap-6">
          <h2 id="acceso-directo-titulo" className="font-display text-display-2 tracking-[0.01em]">
            ¿Quieres un plan hecho solo para ti?
          </h2>
          <p className="text-lg">
            Desbloquea un chat directo conmigo. Si después tomas tu plan personalizado, te descuento
            lo que pagaste por el acceso.
          </p>
          <div className="flex flex-col gap-1">
            <PriceTag priceCop={offer.priceCop} />
            <p className="text-muted-foreground text-sm">{offer.accessDays} días de chat conmigo</p>
          </div>
          <Button asChild variant="cta" size="lg" className="w-full sm:w-auto">
            <Link href="/acceso-directo">Hablar con Sam</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
