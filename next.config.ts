import type { NextConfig } from "next";

// El navegador nunca habla directo con el back: todo pasa por /api/v1, que Next reescribe
// hacia API_URL en el server. Así la cookie de sesión no necesita Domain (guía front §3).
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.API_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
