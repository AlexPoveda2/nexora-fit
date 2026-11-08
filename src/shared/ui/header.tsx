"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

// Barra superior fija, siempre oscura sin importar el tema de la sección que tiene debajo
// (nexorafit-design-system, components/Header/README.md): fondo sólido siempre, para leerse
// igual en el checkout, /acceder o cualquier página sin hero. La variante transparente sobre el
// hero es de la landing, no de este componente. Al hacer scroll solo se suma una sombra sutil.
// 56 px en celular y 64 px desde md; z-40 para quedar debajo de diálogos, Sheet y menús (z-50).
// El logo se escribe en minúsculas normales (el lector de pantalla no lo deletrea); Bebas Neue
// ya lo muestra en mayúsculas y `uppercase` lo mantiene así si la fuente no ha cargado.
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
      className={`dark bg-background text-foreground fixed inset-x-0 top-0 z-40 transition-shadow ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <Container className="flex h-14 items-center justify-between gap-2 md:h-16">
        <Link
          href="/"
          className="font-display shrink-0 text-2xl tracking-wide whitespace-nowrap uppercase"
        >
          Nexora Fit
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost">
            <Link href="/#deportes">Planes</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/acceder">Ya tengo código</Link>
          </Button>
        </nav>

        {/* 44 px de alto (nunca size="sm" en celular); px-3 para que quepa a 320 px. */}
        <div className="flex items-center gap-1 md:hidden">
          <Button asChild variant="outline" className="px-3">
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
                <SheetTitle className="font-display text-xl uppercase">Nexora Fit</SheetTitle>
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
      </Container>
    </header>
  );
}
