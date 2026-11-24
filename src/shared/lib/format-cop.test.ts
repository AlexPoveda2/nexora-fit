import { formatCop } from "./format-cop";

it("formatea pesos enteros con punto de miles y sin decimales", () => {
  // Intl separa el símbolo con un espacio duro (U+00A0).
  expect(formatCop(160000)).toBe("$\u00a0160.000");
  expect(formatCop(80000)).toBe("$\u00a080.000");
  expect(formatCop(1240000)).toBe("$\u00a01.240.000");
});
