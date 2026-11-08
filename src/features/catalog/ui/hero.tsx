import Image from "next/image";
import Link from "next/link";

import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";

import heroImage from "./images/hero-provisional.jpg";

// Hero de la landing (planeación §3.2, design system §11.2): pantalla completa menos la
// barra fija (h-16), foto con capa oscura y el texto abajo, sobre la zona más oscura (§8.3).
// La foto es provisional (Unsplash, licencia libre) hasta tener las de Sam (planeación front §8).
export function Hero() {
  return (
    <section
      aria-labelledby="hero-titulo"
      className="dark bg-background text-foreground relative isolate flex min-h-[calc(100svh-4rem)] items-end"
    >
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        className="-z-10 object-cover"
      />
      <div
        aria-hidden
        className="from-negro via-negro/70 to-negro/20 absolute inset-0 -z-10 bg-linear-to-t"
      />

      <Container className="py-12 md:py-20">
        <h1 id="hero-titulo" className="font-display text-hero max-w-4xl tracking-[0.01em]">
          Entrena conmigo, estés donde estés
        </h1>
        <p className="mt-4 max-w-xl text-lg">
          Planes de boxeo, calistenia, running y gimnasio con videos de técnica y rutinas listas
          para seguir.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="cta" size="lg" className="w-full sm:w-auto">
            <Link href="/#deportes">Ver planes</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
            <Link href="/acceso-directo">Quiero un plan personalizado</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
