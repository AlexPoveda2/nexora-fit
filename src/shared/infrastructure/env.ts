import { z } from "zod";

// Variables de entorno validadas al arrancar (guía front §9.6): si falta o está mal escrita
// una, el build falla aquí en vez de fallar en producción con un error confuso más adelante.
// Solo se declara lo que ya consume el código; cada feature nueva agrega la suya (p. ej.
// NEXT_PUBLIC_TURNSTILE_SITE_KEY llega con el formulario de acceso).
const envSchema = z.object({
  API_URL: z.url(),
  // Hasta el lanzamiento, noindex en todos los entornos (guía front §9.5). Solo se lee en
  // server components y route handlers (robots.ts), nunca en código de cliente.
  NEXT_PUBLIC_INDEXABLE: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

export const env = envSchema.parse({
  API_URL: process.env.API_URL,
  NEXT_PUBLIC_INDEXABLE: process.env.NEXT_PUBLIC_INDEXABLE,
});
