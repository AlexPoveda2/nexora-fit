import type { CatalogRepository } from "@/features/catalog/application/ports";
import type { Catalog } from "@/features/catalog/domain/catalog";
import type { PublicPlan } from "@/features/catalog/domain/public-plan";

export const sampleCatalog: Catalog = {
  plans: [
    {
      slug: "boxeo",
      sport: "BOX",
      name: "Boxeo",
      tagline: "Guardia, golpes y defensas desde cero.",
      imageUrl: null,
      levels: ["basic", "intermediate"],
      product: { slug: "plan-boxeo", priceCop: 160000 },
    },
  ],
  pack: { slug: "pack-completo", priceCop: 240000, fullPriceCop: 640000 },
  directAccess: { slug: "acceso-directo", priceCop: 80000, accessDays: 30 },
};

/** Catálogo en memoria: `plans` son las páginas públicas que existen, por slug. */
export class FakeCatalogRepository implements CatalogRepository {
  constructor(
    private readonly catalog: Catalog = sampleCatalog,
    private readonly plans: Record<string, PublicPlan> = {},
  ) {}

  async getCatalog(): Promise<Catalog> {
    return this.catalog;
  }

  async getPlan(slug: string): Promise<PublicPlan | null> {
    return this.plans[slug] ?? null;
  }
}
