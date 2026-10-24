import type { NextConfig } from "next";

import { env } from "./src/shared/infrastructure/env";

// El navegador nunca habla directo con el back: todo pasa por /api/v1, que Next reescribe
// hacia API_URL en el server. Así la cookie de sesión no necesita Domain (guía front §3).
// env.ts valida API_URL con Zod: si falta, el build falla aquí con un mensaje claro.
const nextConfig: NextConfig = {
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
