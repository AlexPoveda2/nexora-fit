import { formatLevels } from "./levels";

it("une los niveles con sus nombres en español", () => {
  expect(formatLevels(["basic", "intermediate"])).toBe("Básico + Intermedio");
  expect(formatLevels(["intermediate"])).toBe("Intermedio");
  expect(formatLevels([])).toBe("");
});
