import type { MetadataRoute } from "next";

import { env } from "@/shared/infrastructure/env";

// Hasta el lanzamiento, noindex en todos los entornos (incluido prod): el sitio no se anuncia
// todavía. El día del lanzamiento se activa con NEXT_PUBLIC_INDEXABLE=true (guía front §9.5).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: env.NEXT_PUBLIC_INDEXABLE ? [] : "/",
    },
  };
}
