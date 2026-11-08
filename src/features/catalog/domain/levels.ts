import type { LevelName } from "./catalog";

// Nombres fijos de los niveles (design system §13): la UI nunca muestra el valor crudo de la API.
const LEVEL_LABELS: Record<LevelName, string> = {
  basic: "Básico",
  intermediate: "Intermedio",
};

/** "Básico + Intermedio" para la insignia de la tarjeta de un deporte (planeación §3.5). */
export function formatLevels(levels: readonly LevelName[]): string {
  return levels.map((level) => LEVEL_LABELS[level]).join(" + ");
}
