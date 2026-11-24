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

/** Página pública de Boxeo con la forma de `GET /plans/boxeo` del `make seed` del back. */
export const samplePublicPlan: PublicPlan = {
  slug: "boxeo",
  name: "Boxeo",
  description: "Guardia, golpes y defensas desde cero, más combinaciones para progresar.",
  imageUrl: null,
  audience: ["Nunca has boxeado", "Quieres mejorar tu cardio"],
  equipment: ["Guantes", "Vendas"],
  levels: [
    {
      level: "basic",
      weeks: 4,
      daysPerWeek: 3,
      minutesPerSession: 50,
      outcome: "Dominas los fundamentos de boxeo.",
    },
    {
      level: "intermediate",
      weeks: 4,
      daysPerWeek: 4,
      minutesPerSession: 60,
      outcome: "Avanzas al siguiente nivel de boxeo.",
    },
  ],
  syllabus: [
    {
      category: { code: "GOL", name: "Golpes" },
      videos: [
        { id: "BOX-GOL-001", title: "Golpe recto" },
        { id: "BOX-GOL-002", title: "Golpe cruzado" },
      ],
    },
  ],
  freeSample: { videoId: "BOX-GOL-001", title: "Golpe recto", posterUrl: null },
  sampleDay: {
    title: "Boxeo — Día 1",
    durationMin: 50,
    blocks: [
      {
        type: "warmup",
        title: "Calentamiento",
        exercises: [{ name: "Movilidad articular general", repsOrTime: "5 min" }],
      },
    ],
    hiddenBlocks: 1,
  },
  product: { slug: "plan-boxeo", priceCop: 160000 },
  pack: { slug: "pack-completo", priceCop: 240000 },
};

/** Catálogo en memoria: `plans` son las páginas públicas que existen, por slug. */
export class FakeCatalogRepository implements CatalogRepository {
  // Map y no un objeto: "constructor" o "toString" no deben parecer planes existentes.
  private readonly plans: Map<string, PublicPlan>;

  constructor(
    private readonly catalog: Catalog = sampleCatalog,
    plans: Record<string, PublicPlan> = {},
  ) {
    this.plans = new Map(Object.entries(plans));
  }

  async getCatalog(): Promise<Catalog> {
    return this.catalog;
  }

  async getPlan(slug: string): Promise<PublicPlan | null> {
    return this.plans.get(slug) ?? null;
  }
}
