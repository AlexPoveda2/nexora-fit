import type { AxiosInstance } from "axios";

import { AppError } from "@/shared/domain/errors";
import type { components } from "@/shared/infrastructure/api/schema";

import type { CatalogRepository } from "../application/ports";
import type { Catalog, LevelName, PlanSummary, ProductRef } from "../domain/catalog";
import type { BlockType, PublicPlan, SampleDay } from "../domain/public-plan";

type Schemas = components["schemas"];
type CatalogResponse = Schemas["CatalogResponse"];
type PublicPlanResponse = Schemas["PublicPlanResponse"];

// El OpenAPI expone `level` y `type` como string libre. Un valor que el front no conoce no
// debe romper una página de venta: los niveles desconocidos se omiten y los bloques
// desconocidos se muestran como "other".
const LEVELS: readonly string[] = ["basic", "intermediate"] satisfies LevelName[];
const BLOCK_TYPES: readonly string[] = [
  "warmup",
  "main",
  "cooldown",
  "other",
] satisfies BlockType[];

function isLevel(value: string): value is LevelName {
  return LEVELS.includes(value);
}

function hasKnownLevel(
  level: Schemas["PlanLevelSchema"],
): level is Schemas["PlanLevelSchema"] & { level: LevelName } {
  return isLevel(level.level);
}

function toBlockType(value: string): BlockType {
  return BLOCK_TYPES.includes(value) ? (value as BlockType) : "other";
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// La API envía "" cuando el plan aún no tiene foto; para la UI es lo mismo que no tenerla.
function toImageUrl(value: string | null | undefined): string | null {
  return value ? value : null;
}

// Pack y acceso directo comparten slug y price_cop con ProductRefSchema.
function toProductRef(product: { slug: string; price_cop: number }): ProductRef {
  return { slug: product.slug, priceCop: product.price_cop };
}

function toOptionalProductRef(product: Schemas["ProductRefSchema"] | null): ProductRef | null {
  return product ? toProductRef(product) : null;
}

function toPlanSummary(plan: Schemas["CatalogPlanSchema"]): PlanSummary {
  return {
    slug: plan.slug,
    sport: plan.sport,
    name: plan.name,
    tagline: plan.tagline,
    imageUrl: toImageUrl(plan.image_url),
    levels: plan.levels.filter(isLevel),
    product: toOptionalProductRef(plan.product),
  };
}

function toCatalog(response: CatalogResponse): Catalog {
  const { pack, direct_access: directAccess } = response;
  return {
    plans: response.plans.map(toPlanSummary),
    pack: pack ? { ...toProductRef(pack), fullPriceCop: pack.full_price_cop } : null,
    directAccess: directAccess
      ? { ...toProductRef(directAccess), accessDays: directAccess.access_days }
      : null,
  };
}

function toSampleDay(day: Schemas["SampleDayPreviewSchema"]): SampleDay {
  return {
    title: day.title,
    durationMin: day.duration_min,
    blocks: day.blocks.map((block) => ({
      type: toBlockType(block.type),
      title: block.title,
      exercises: block.exercises.map((exercise) => ({
        name: exercise.name,
        repsOrTime: exercise.reps_or_time,
      })),
    })),
    hiddenBlocks: day.hidden_blocks,
  };
}

function toPublicPlan(response: PublicPlanResponse): PublicPlan {
  return {
    slug: response.slug,
    name: response.name,
    description: response.description,
    imageUrl: toImageUrl(response.image_url),
    audience: response.audience,
    equipment: response.equipment,
    levels: response.levels.filter(hasKnownLevel).map((level) => ({
      level: level.level,
      weeks: level.weeks,
      daysPerWeek: level.days_per_week,
      minutesPerSession: level.minutes_per_session,
      outcome: level.outcome,
    })),
    syllabus: response.syllabus.map((group) => ({
      category: { code: group.category.code, name: group.category.name },
      videos: group.videos.map((video) => ({ id: video.id, title: video.title })),
    })),
    freeSample: response.free_sample
      ? {
          videoId: response.free_sample.video_id,
          title: response.free_sample.title,
          posterUrl: toImageUrl(response.free_sample.poster_url),
        }
      : null,
    sampleDay: response.sample_day ? toSampleDay(response.sample_day) : null,
    product: toOptionalProductRef(response.product),
    pack: toOptionalProductRef(response.pack),
  };
}

// Las rutas llevan /api/v1 completo, igual que health: en el navegador el baseURL es "" (proxy
// de Next) y en el servidor es API_URL (server-container.ts), así que sirven para ambos.
export class HttpCatalogRepository implements CatalogRepository {
  constructor(private readonly http: AxiosInstance) {}

  async getCatalog(): Promise<Catalog> {
    const { data } = await this.http.get<CatalogResponse>("/api/v1/catalog");
    return toCatalog(data);
  }

  async getPlan(slug: string): Promise<PublicPlan | null> {
    // Un slug fuera del formato no puede existir: se responde 404 sin llamar a la API y sin
    // armar rutas raras (el back decodifica %2F antes de enrutar).
    if (!SLUG.test(slug)) return null;
    try {
      const { data } = await this.http.get<PublicPlanResponse>(`/api/v1/plans/${slug}`);
      return toPublicPlan(data);
    } catch (error) {
      if (error instanceof AppError && error.status === 404) return null;
      throw error;
    }
  }
}
