import { CirclePlay } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/shared/ui/badge";

import type { FreeSample } from "../domain/public-plan";

// Video de muestra gratis (planeación §4.5). Hasta que exista el reproductor (fase 3, TF-45)
// se muestra solo el poster 16:9 con "Disponible pronto" (planeación front §10, decisión 3):
// no hay botón ni nada que parezca reproducible.
export function FreeSampleTeaser({ sample }: { sample: FreeSample }) {
  return (
    <section aria-labelledby="muestra-titulo">
      <h2 id="muestra-titulo" className="font-display text-display-2 tracking-[0.01em]">
        Video de muestra gratis
      </h2>
      <figure className="mt-8">
        <div className="dark bg-muted text-muted-foreground relative flex aspect-video items-center justify-center overflow-hidden rounded-lg">
          {sample.posterUrl ? (
            // `unoptimized`: el dominio de Bunny aún no está en images.remotePatterns (TF-43).
            <Image
              src={sample.posterUrl}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-cover opacity-60"
            />
          ) : null}
          <CirclePlay aria-hidden className="relative size-12" />
          <Badge variant="outline" className="absolute top-3 left-3">
            Disponible pronto
          </Badge>
        </div>
        <figcaption className="mt-3 font-semibold">{sample.title}</figcaption>
      </figure>
    </section>
  );
}
