import { cn } from "@/shared/lib/utils";
import { formatCop } from "@/shared/lib/format-cop";

type PriceTagProps = {
  priceCop: number;
  /** Precio tachado (p. ej. la suma de los 4 planes en el pack). Lo entrega la API. */
  beforeCop?: number;
  /** `lg` para bloques de venta; `sm` (text-display-3) para tarjetas. */
  size?: "sm" | "lg";
  /** `on-cta`: sobre la sección roja del pack, todo en blanco (nunca rojo sobre rojo). */
  tone?: "default" | "on-cta";
  className?: string;
};

// PriceTag (design system §11.1, §12.1): precio vigente en `price` y Bebas Neue; el tachado va
// antes, en `muted-foreground`. El tachado no depende solo del estilo: un lector de pantalla
// oye "Antes $ 640.000, ahora $ 240.000" (texto oculto en vez de aria-label, que los lectores
// ignoran en elementos sin rol interactivo como <s>).
export function PriceTag({
  priceCop,
  beforeCop,
  size = "lg",
  tone = "default",
  className,
}: PriceTagProps) {
  const onCta = tone === "on-cta";
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-3 gap-y-1", className)}>
      {beforeCop !== undefined && (
        <span className={cn("text-lg", onCta ? "text-cta-foreground" : "text-muted-foreground")}>
          <span className="sr-only">Antes </span>
          <s className="tabular-nums">{formatCop(beforeCop)}</s>
          <span className="sr-only">, ahora </span>
        </span>
      )}
      <span
        className={cn(
          "font-display tracking-[0.01em] tabular-nums",
          size === "lg" ? "text-price-lg" : "text-display-3",
          onCta ? "text-cta-foreground" : "text-price",
        )}
      >
        {formatCop(priceCop)}
      </span>
    </p>
  );
}
