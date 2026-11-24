import { formatLevels, levelLabel } from "./levels";

it("da el nombre en español de cada nivel", () => {
  expect(levelLabel("basic")).toBe("Básico");
  expect(levelLabel("intermediate")).toBe("Intermedio");
});

it("une los niveles con sus nombres en español", () => {
  expect(formatLevels(["basic", "intermediate"])).toBe("Básico + Intermedio");
  expect(formatLevels(["intermediate"])).toBe("Intermedio");
  expect(formatLevels([])).toBe("");
});
