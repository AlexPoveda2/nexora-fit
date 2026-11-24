import type { LevelName } from "./catalog";

// Nombres fijos de los niveles (design system §13): la UI nunca muestra el valor crudo de la API.
const LEVEL_LABELS: Record<LevelName, string> = {
  basic: "Básico",
  intermediate: "Intermedio",
};

/** "Básico" o "Intermedio": el título de cada tarjeta de nivel en /planes/[deporte]. */
export function levelLabel(level: LevelName): string {
  return LEVEL_LABELS[level];
}

/** "Básico + Intermedio" para la insignia de la tarjeta de un deporte (planeación §3.5). */
export function formatLevels(levels: readonly LevelName[]): string {
  return levels.map(levelLabel).join(" + ");
}
