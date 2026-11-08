import { cn } from "./utils";

it("los tamaños de texto propios no se mezclan con los colores", () => {
  expect(cn("text-display-3", "text-price")).toBe("text-display-3 text-price");
  expect(cn("text-price-lg", "text-cta-foreground")).toBe("text-price-lg text-cta-foreground");
  expect(cn("text-display-3", "text-price-lg")).toBe("text-price-lg");
});
