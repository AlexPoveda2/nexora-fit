import { AppError } from "@/shared/domain/errors";

// Traduce el `code` de la API a un mensaje para la persona (planeación front §7). Los
// componentes nunca muestran el texto crudo del servidor: siempre pasan por aquí.
const MESSAGES: Record<string, string> = {
  INVALID_CODE: "Ese código no existe. Revisa que esté bien escrito.",
  INVALID_TOKEN: "El enlace venció o ya se usó. Pide uno nuevo.",
  CAPTCHA_REQUIRED: "Confirma que no eres un robot para seguir.",
  RATE_LIMITED: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
  NO_ACCESS: "No tienes acceso a este plan.",
  PRODUCT_UNAVAILABLE: "Este producto no está disponible en este momento.",
  VIDEO_IN_USE: "Este video se usa en uno o más planes. Quítalo de ahí primero.",
  INVALID_ORDER_STATE: "La orden ya cambió de estado. Recarga la página.",
  VALIDATION_ERROR: "Revisa los campos marcados.",
  NETWORK_ERROR: "Revisa tu conexión e intenta de nuevo.",
};

const DEFAULT_MESSAGE = "Algo salió mal. Intenta de nuevo.";

/** `UNKNOWN_VIDEO_IDS` lleva la lista de IDs en `details` (contrato §12). */
function unknownVideoIdsMessage(error: AppError): string {
  const ids = Array.isArray(error.details) ? error.details.join(", ") : "";
  return `Estos videos no existen en la biblioteca: ${ids}.`;
}

/**
 * `UNAUTHENTICATED` no se muestra: quien la atrapa redirige a `/acceder` en vez de pintar un
 * mensaje (guía front §5.4, el handler global de 401 en `core/providers.tsx`).
 */
export function errorMessage(error: unknown): string {
  if (!(error instanceof AppError)) return DEFAULT_MESSAGE;
  if (error.code === "UNKNOWN_VIDEO_IDS") return unknownVideoIdsMessage(error);
  return MESSAGES[error.code] ?? DEFAULT_MESSAGE;
}
