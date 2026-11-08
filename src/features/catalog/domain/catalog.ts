// Catálogo público que alimenta la landing, /pack-completo y /acceso-directo (endpoints §4).
// Los precios son enteros en COP y los decide la API: el front no hace cuentas con ellos
// (guía front §7), ni siquiera el precio tachado del pack (`fullPriceCop`).

/** Niveles que se venden en los planes públicos. "custom" solo existe en planes personalizados. */
export type LevelName = "basic" | "intermediate";

/** Producto que se compra en /checkout/[producto]. */
export type ProductRef = {
  slug: string;
  priceCop: number;
};

/** Tarjeta de un deporte en la landing. */
export type PlanSummary = {
  slug: string;
  sport: string;
  name: string;
  tagline: string;
  /** `null` mientras Sam no haya subido la foto: la UI muestra un respaldo. */
  imageUrl: string | null;
  levels: LevelName[];
  /** `null` si el plan no tiene producto activo: se muestra, pero no se puede comprar. */
  product: ProductRef | null;
};

export type PackOffer = ProductRef & {
  /** Suma de los 4 planes según la API, para el precio tachado. */
  fullPriceCop: number;
};

export type DirectAccessOffer = ProductRef & {
  accessDays: number;
};

export type Catalog = {
  plans: PlanSummary[];
  pack: PackOffer | null;
  directAccess: DirectAccessOffer | null;
};
