import { PHASE_PRODUCTION_BUILD } from "next/constants";

import { AppError } from "@/shared/domain/errors";

/**
 * Lee datos de la API para una página con ISR sin que `next build` dependa de ella (guía front
 * §5.1). Solo durante el build, y solo si la API no responde (sin API en la CI), se devuelve
 * `null`: la página se genera sin las secciones que dependen de la API y la primera
 * revalidación la completa. Un 4xx/5xx o un error de mapeo sí rompen el build, para no
 * publicar una página vacía por un cambio de contrato. En ejecución el error siempre se
 * propaga: si la API falla al revalidar, Next sigue sirviendo la última versión buena.
 */
export async function readOrSkipDuringBuild<T>(read: () => Promise<T>): Promise<T | null> {
  try {
    return await read();
  } catch (error) {
    const unreachable = error instanceof AppError && error.code === "NETWORK_ERROR";
    if (!unreachable || process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw error;
    console.warn("API no disponible durante el build: la página se genera sin sus datos.");
    return null;
  }
}
