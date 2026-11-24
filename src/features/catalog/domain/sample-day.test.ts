import { blockTitle, fillerBlockCount, MAX_FILLER_BLOCKS } from "./sample-day";

it("usa el título que puso Sam", () => {
  expect(blockTitle({ type: "main", title: "Guardia y recto" })).toBe("Guardia y recto");
});

it("sin título usa el nombre en español del tipo de bloque", () => {
  expect(blockTitle({ type: "warmup", title: null })).toBe("Calentamiento");
  expect(blockTitle({ type: "main", title: "  " })).toBe("Trabajo principal");
  expect(blockTitle({ type: "cooldown", title: null })).toBe("Vuelta a la calma");
  expect(blockTitle({ type: "other", title: null })).toBe("Bloque");
});

it("dibuja un bloque de relleno por cada bloque oculto, con tope", () => {
  expect(fillerBlockCount(0)).toBe(0);
  expect(fillerBlockCount(2)).toBe(2);
  expect(fillerBlockCount(MAX_FILLER_BLOCKS + 3)).toBe(MAX_FILLER_BLOCKS);
});

it("ignora valores imposibles en vez de romper la página", () => {
  expect(fillerBlockCount(-1)).toBe(0);
  expect(fillerBlockCount(Number.NaN)).toBe(0);
  expect(fillerBlockCount(2.7)).toBe(2);
});
