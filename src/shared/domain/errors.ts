// Error de aplicación: toda falla que cruza una frontera (HTTP, validación, etc.) se normaliza
// a este tipo antes de llegar a application/ui (guía front §3).
export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: string, status: number, message?: string, details?: unknown) {
    super(message ?? code);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
