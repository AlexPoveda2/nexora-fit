import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import type { ReactNode } from "react";

import { Providers } from "@/core/providers";
import { Toaster } from "@/shared/ui/sonner";

import "./globals.css";

// Bebas Neue (títulos) e Inter (texto) con next/font: sin <link> a Google Fonts (design
// system §9). Las variables alimentan --font-display y --font-sans en globals.css.
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Nexora Fit",
  description: "Planes de boxeo, calistenia, running y gimnasio con videos de técnica.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-CO" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
