import { AppError } from "@/shared/domain/errors";

import { errorMessage } from "./error-messages";

it("traduce un código conocido de la API", () => {
  expect(errorMessage(new AppError("INVALID_CODE", 404))).toBe(
    "Ese código no existe. Revisa que esté bien escrito.",
  );
});

it("arma el mensaje de UNKNOWN_VIDEO_IDS con la lista de details", () => {
  const error = new AppError("UNKNOWN_VIDEO_IDS", 422, undefined, ["BOX-001", "BOX-002"]);

  expect(errorMessage(error)).toBe("Estos videos no existen en la biblioteca: BOX-001, BOX-002.");
});

it("usa el mensaje por defecto para un código que no está en la tabla", () => {
  expect(errorMessage(new AppError("ALGO_RARO", 500))).toBe("Algo salió mal. Intenta de nuevo.");
});

it("usa el mensaje por defecto si no es un AppError", () => {
  expect(errorMessage(new Error("boom"))).toBe("Algo salió mal. Intenta de nuevo.");
  expect(errorMessage("boom")).toBe("Algo salió mal. Intenta de nuevo.");
});
