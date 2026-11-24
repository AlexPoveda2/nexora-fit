import Link from "next/link";

import { formatCop } from "@/shared/lib/format-cop";
import { Button } from "@/shared/ui/button";
import { PriceTag } from "@/shared/ui/price-tag";

import type { ProductRef } from "../domain/catalog";

type BuyBarProps = {
  planName: string;
  /** `null` si el plan no tiene producto activo: no se puede comprar. */
  product: ProductRef | null;
  /** `null` si el pack no está a la venta: no se ofrece. */
  pack: ProductRef | null;
};

// Precio y compra (planeación §4.8, design system §5.4 y §11.2). Dos presentaciones de lo mismo:
// - Tarjeta: en lg+ va fija al lado del contenido (`sticky top-20`); por debajo de lg queda al
//   final de la página, con el enlace al pack.
// - Barra fija abajo, solo por debajo de lg: precio y "Comprar" siempre a mano. Lleva
//   `data-buy-bar` para que el <body> reserve su alto (layout raíz) y no tape el footer.
export function BuyBar({ planName, product, pack }: BuyBarProps) {
  return (
    <>
      <section
        aria-labelledby="compra-titulo"
        className="bg-card text-card-foreground flex flex-col gap-4 rounded-lg border p-4 md:p-6 lg:sticky lg:top-20"
      >
        <h2 id="compra-titulo" className="text-xl font-semibold">
          Plan de {planName}
        </h2>
        {product ? (
          <>
            <PriceTag priceCop={product.priceCop} />
            <Button asChild variant="cta" size="lg" className="w-full">
              <Link href={`/checkout/${product.slug}`}>Comprar plan de {planName}</Link>
            </Button>
          </>
        ) : (
          <p className="text-muted-foreground">Pronto a la venta</p>
        )}
        {pack && (
          <Link
            href="/pack-completo"
            className="text-sm underline underline-offset-4 hover:no-underline"
          >
            o llévate el pack completo por{" "}
            <span className="whitespace-nowrap">{formatCop(pack.priceCop)}</span>
          </Link>
        )}
      </section>

      {product && (
        <div
          data-buy-bar
          className="bg-background/95 fixed inset-x-0 bottom-0 z-30 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        >
          {/* 64 px con el borde incluido (design system §5.4), igual al padding que reserva el body. */}
          <div className="mx-auto flex h-[calc(4rem-1px)] w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
            <PriceTag priceCop={product.priceCop} size="sm" />
            <Button asChild variant="cta">
              <Link href={`/checkout/${product.slug}`} aria-label={`Comprar plan de ${planName}`}>
                Comprar
              </Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
