import Image, { type StaticImageData } from "next/image";

import { cn } from "@/shared/lib/utils";
import { Container } from "@/shared/ui/container";

import boxeoImage from "./images/sobre-sam-boxeo-provisional.jpg";
import calisteniaImage from "./images/sobre-sam-calistenia-provisional.jpg";
import runningImage from "./images/sobre-sam-running-provisional.jpg";

// PROVISIONAL (planeación front §8): las fotos son de Unsplash (licencia libre) y las cifras
// son de relleno hasta que Sam entregue sus fotos, su texto "Sobre mí" y sus 3 datos. El
// `alt` describe la foto de prueba; se reescribe con las fotos reales.
const PHOTOS: { src: StaticImageData; alt: string }[] = [
  { src: boxeoImage, alt: "Entrenamiento de boxeo con manoplas" },
  { src: calisteniaImage, alt: "Flexiones de calistenia en el gimnasio" },
  { src: runningImage, alt: "Grupo corriendo al amanecer" },
];

const STATS = [
  { value: "10+", label: "años de experiencia" },
  { value: "4", label: "disciplinas" },
  { value: "500+", label: "personas entrenadas" },
];

// Bienvenida / Sobre Sam (planeación §3.3, design system §11.2): texto en primera persona,
// 3 cifras y 3 fotos 4:5. En celular se ven 2 fotos para no dejar un hueco en la rejilla.
export function About() {
  return (
    <section aria-labelledby="sobre-sam-titulo" id="sobre-sam" className="py-16 md:py-24">
      <Container className="flex flex-col gap-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
          <div className="max-w-prose">
            <h2 id="sobre-sam-titulo" className="font-display text-display-2 tracking-[0.01em]">
              Hola, querido atleta
            </h2>
            <p className="mt-4">
              Bienvenido al programa, donde encontrarás el camino para conseguir tus objetivos: tu
              cuerpo deseado y la funcionalidad para moverte mejor en tu día a día.
            </p>
            <p className="mt-4">
              Soy Sam. Armé cada plan con las rutinas y los videos de técnica que uso con mis
              alumnos, para que entrenes conmigo desde donde estés y a tu ritmo.
            </p>
          </div>

          <ul className="grid grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <li key={stat.label} className="flex flex-col gap-1">
                <span className="font-display text-display-2 tracking-[0.01em] tabular-nums">
                  {stat.value}
                </span>
                <span className="text-muted-foreground text-sm">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {PHOTOS.map((photo, index) => (
            <li
              key={photo.src.src}
              className={cn(
                "bg-muted relative aspect-4/5 overflow-hidden rounded-lg",
                index === 2 && "hidden md:block",
              )}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1152px) 360px, (min-width: 768px) 33vw, 50vw"
                placeholder="blur"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
