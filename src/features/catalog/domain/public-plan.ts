import type { LevelName, ProductRef } from "./catalog";

// Página de venta de un deporte, /planes/[deporte] (endpoints §4, `GET /plans/{slug}`).

export type LevelSummary = {
  level: LevelName;
  weeks: number;
  daysPerWeek: number;
  minutesPerSession: number;
  outcome: string;
};

/** Temario: solo títulos de los videos, agrupados por categoría (planeación §7.6). */
export type SyllabusGroup = {
  category: { code: string; name: string };
  videos: { id: string; title: string }[];
};

export type FreeSample = {
  videoId: string;
  title: string;
  posterUrl: string | null;
};

export type BlockType = "warmup" | "main" | "cooldown" | "other";

export type SampleBlock = {
  type: BlockType;
  title: string | null;
  exercises: { name: string; repsOrTime: string | null }[];
};

/**
 * Día de muestra: la API solo envía el primer bloque. La UI dibuja `hiddenBlocks` bloques de
 * relleno difuminados; el contenido real nunca llega al navegador.
 */
export type SampleDay = {
  title: string;
  durationMin: number;
  blocks: SampleBlock[];
  hiddenBlocks: number;
};

export type PublicPlan = {
  slug: string;
  name: string;
  description: string;
  imageUrl: string | null;
  audience: string[];
  equipment: string[];
  levels: LevelSummary[];
  syllabus: SyllabusGroup[];
  freeSample: FreeSample | null;
  sampleDay: SampleDay | null;
  product: ProductRef | null;
  pack: ProductRef | null;
};
