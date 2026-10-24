import { z } from "zod";

// Variables de entorno validadas al arrancar (guía front §9.6): si falta o está mal escrita
// una, el build falla aquí en vez de fallar en producción con un error confuso más adelante.
// Solo se declara lo que ya consume el código; cada feature nueva agrega la suya (p. ej.
// NEXT_PUBLIC_TURNSTILE_SITE_KEY llega con el formulario de acceso).
const envSchema = z.object({
  API_URL: z.url(),
});

export const env = envSchema.parse({
  API_URL: process.env.API_URL,
});
