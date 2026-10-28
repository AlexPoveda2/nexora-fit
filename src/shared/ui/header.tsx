"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

// Barra superior fija, siempre oscura sin importar el tema de la sección que tiene debajo
// (design system §2, §11.1): fondo sólido siempre, para leerse igual en el checkout, /acceder
// o cualquier página sin hero. El efecto de "transparente sobre el hero" que describe el
// design system §11.1 es específico de la landing (HUF-3, con el <Hero> detrás) y se agrega
// ahí como variante, no aquí. Al hacer scroll solo se suma una sombra sutil.
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`dark bg-background text-foreground fixed inset-x-0 top-0 z-50 transition-shadow ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-display text-2xl tracking-wide">
          NEXORA FIT
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost">
            <Link href="/#deportes">Planes</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/acceder">Ya tengo código</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button asChild variant="outline" size="sm">
            <Link href="/acceder">Ya tengo código</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Abrir menú">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="dark">
              <SheetHeader>
                <SheetTitle className="font-display text-xl">NEXORA FIT</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                <SheetClose asChild>
                  <Button asChild variant="ghost" className="justify-start">
                    <Link href="/#deportes">Planes</Link>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
