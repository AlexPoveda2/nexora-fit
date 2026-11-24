// Pesos colombianos enteros, sin decimales (guía front §7, design system §12.1): "$ 160.000".
// El formateador se crea una vez: Intl.NumberFormat es caro de construir.
const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/** Formatea un precio en COP tal como llega de la API. No redondea ni hace cuentas. */
export function formatCop(priceCop: number): string {
  return COP.format(priceCop);
}
