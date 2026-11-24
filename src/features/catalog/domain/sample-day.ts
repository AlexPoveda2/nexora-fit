import type { BlockType, SampleBlock } from "./public-plan";

// Nombres fijos de los tipos de bloque (design system §11.5, `DayRoutine`): la UI nunca muestra
// el valor crudo de la API.
const BLOCK_LABELS: Record<BlockType, string> = {
  warmup: "Calentamiento",
  main: "Trabajo principal",
  cooldown: "Vuelta a la calma",
  other: "Bloque",
};

/** El título que puso Sam o, si no puso ninguno, el nombre del tipo de bloque. */
export function blockTitle(block: Pick<SampleBlock, "type" | "title">): string {
  const title = block.title?.trim();
  return title ? title : BLOCK_LABELS[block.type];
}

// Tope de bloques de relleno: con más, el día de ejemplo se volvería una pared gris que empuja
// el resto de la página sin mostrar nada nuevo.
export const MAX_FILLER_BLOCKS = 4;

/**
 * Cuántos bloques de relleno se dibujan para `hiddenBlocks` bloques ocultos (design system
 * §12.3): nunca negativo ni fraccionario, y con tope.
 */
export function fillerBlockCount(hiddenBlocks: number): number {
  if (!Number.isFinite(hiddenBlocks) || hiddenBlocks <= 0) return 0;
  return Math.min(Math.floor(hiddenBlocks), MAX_FILLER_BLOCKS);
}
