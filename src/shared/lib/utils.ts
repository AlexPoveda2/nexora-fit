import { createCn } from "cn/config";

// Los tamaños de texto propios de globals.css (`text-hero`, `text-display-*`, `text-price-lg`) se
// registran como tamaños: si no, el merge los toma por colores y `cn("text-display-3",
// "text-price")` borraría el tamaño. Los componentes de shadcn importan `cn` del paquete sin
// esta extensión; si alguno recibe estos tamaños, debe importar este.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["hero", "display-1", "display-2", "display-3", "price-lg"] }],
    },
  },
});
