import type { ReactNode } from "react";

import { Footer } from "@/shared/ui/footer";
import { Header } from "@/shared/ui/header";

// La barra y el footer son del sitio público (planeación §3.1, §3.10). El área del alumno y
// el panel de admin tienen su propia navegación (HUF-10, HUF-15), con sus propios layouts.
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  );
}
