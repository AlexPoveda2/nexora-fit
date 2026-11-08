import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/utils";

// Contenedor del sitio (VISUAL.md del design system): ancho máximo de 1152 px y margen lateral de
// 16 px en celular, 24 px en tablet y 32 px en escritorio.
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8", className)} {...props} />
  );
}
