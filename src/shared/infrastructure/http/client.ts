import axios, { AxiosError, type AxiosInstance } from "axios";

import { AppError } from "@/shared/domain/errors";

// Formato de error de la API (guía back/front): { error: { code, message, details } }.
type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

function toAppError(error: AxiosError): AppError {
  const status = error.response?.status ?? 0;
  const body = error.response?.data as ApiErrorBody | undefined;

  if (body?.error) {
    return new AppError(
      body.error.code ?? "unknown_error",
      status,
      body.error.message,
      body.error.details,
    );
  }

  if (error.code === "ECONNABORTED") {
    return new AppError("timeout", 0, "La solicitud tardó demasiado.");
  }

  if (!error.response) {
    return new AppError("network_error", 0, "No se pudo conectar con el servidor.");
  }

  return new AppError("unknown_error", status, error.message);
}

// Cliente Axios compartido: credenciales de cookie, timeout corto y errores normalizados a
// AppError antes de que lleguen a application/ui (guía front §3, §5.4).
export function createHttpClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 15_000,
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => Promise.reject(toAppError(error)),
  );

  return client;
}
