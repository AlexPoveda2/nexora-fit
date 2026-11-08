import type { NextConfig } from "next";

import { env } from "./src/shared/infrastructure/env";

// El navegador nunca habla directo con el back: todo pasa por /api/v1, que Next reescribe
// hacia API_URL en el server. Así la cookie de sesión no necesita Domain (guía front §3).
// env.ts valida API_URL con Zod: si falta, el build falla aquí con un mensaje claro.
const nextConfig: NextConfig = {
  experimental: {
    // shadcn importa los primitivos desde el paquete "radix-ui" (todos juntos). Sin esto el
    // bundle de la landing arrastraba primitivos que no usa (Toast, Menubar…) y el LCP simulado
    // en celular pasaba de 2,5 s (Lighthouse, TF-13).
    optimizePackageImports: ["radix-ui"],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${env.API_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
