import { PHASE_PRODUCTION_BUILD } from "next/constants";

import { AppError } from "@/shared/domain/errors";

import { readOrSkipDuringBuild } from "./build-phase";

const failing = () => Promise.reject(new AppError("NETWORK_ERROR", 0));
const originalPhase = process.env.NEXT_PHASE;

afterEach(() => {
  if (originalPhase === undefined) delete process.env.NEXT_PHASE;
  else process.env.NEXT_PHASE = originalPhase;
  jest.restoreAllMocks();
});

it("devuelve los datos cuando la API responde", async () => {
  await expect(readOrSkipDuringBuild(() => Promise.resolve(42))).resolves.toBe(42);
});

it("durante next build, si la API falla, devuelve null para generar la página sin esos datos", async () => {
  process.env.NEXT_PHASE = PHASE_PRODUCTION_BUILD;
  jest.spyOn(console, "warn").mockImplementation(() => {});

  await expect(readOrSkipDuringBuild(failing)).resolves.toBeNull();
});

it("durante next build, un error de la API que sí respondió rompe el build", async () => {
  process.env.NEXT_PHASE = PHASE_PRODUCTION_BUILD;

  await expect(
    readOrSkipDuringBuild(() => Promise.reject(new AppError("UNKNOWN", 500))),
  ).rejects.toThrow(AppError);
  await expect(readOrSkipDuringBuild(() => Promise.reject(new TypeError("x")))).rejects.toThrow(
    TypeError,
  );
});

it("en ejecución propaga el error para que ISR conserve la última versión buena", async () => {
  delete process.env.NEXT_PHASE;

  await expect(readOrSkipDuringBuild(failing)).rejects.toThrow(AppError);
});
