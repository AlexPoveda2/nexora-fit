import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Providers } from "@/core/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Nexora Fit",
  description: "Planes de boxeo, calistenia, running y gimnasio con videos de técnica.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-CO">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
