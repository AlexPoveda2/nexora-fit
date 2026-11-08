import type { Catalog } from "../domain/catalog";
import type { PublicPlan } from "../domain/public-plan";

// Solo lecturas: las páginas llaman al puerto directo, sin casos de uso (guía front §2.3).
export interface CatalogRepository {
  /** Planes, pack y acceso directo con sus precios vigentes. */
  getCatalog(): Promise<Catalog>;
  /** Página pública de un deporte, o `null` si el slug no existe (la página responde 404). */
  getPlan(slug: string): Promise<PublicPlan | null>;
}
