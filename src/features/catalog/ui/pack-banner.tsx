import Link from "next/link";

import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { PriceTag } from "@/shared/ui/price-tag";

import type { PackOffer } from "../domain/catalog";

// Pack completo (planeación §3.6, design system §11.2): la única sección roja del sitio. El
// precio tachado es `fullPriceCop`, la suma de los 4 planes que calcula la API (el front no
// suma precios, guía §7). El botón es `default` en tema oscuro (blanco, texto negro): nunca
// rojo sobre rojo (design system §3.3).
export function PackBanner({ pack }: { pack: PackOffer }) {
  return (
    <section
      aria-labelledby="pack-titulo"
      id="pack-completo"
      className="bg-cta text-cta-foreground py-16 md:py-24"
    >
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 id="pack-titulo" className="font-display text-display-1 tracking-[0.01em]">
            Llévate los 4 deportes
          </h2>
          <p className="mt-4 text-lg">
            Boxeo, calistenia, running y gimnasio, con sus dos niveles, en un solo pago.
          </p>
        </div>
        <div className="flex flex-col gap-6 lg:items-end">
          <PriceTag priceCop={pack.priceCop} beforeCop={pack.fullPriceCop} tone="on-cta" />
          {/* Anillo de foco blanco y opaco: el de por defecto (al 50 %) no se ve sobre el rojo. */}
          <Button
            asChild
            size="lg"
            className="dark focus-visible:ring-cta-foreground w-full sm:w-auto"
          >
            <Link href={`/checkout/${pack.slug}`}>Comprar pack completo</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
