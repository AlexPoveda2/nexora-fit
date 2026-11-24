import { CirclePlay } from "lucide-react";

import type { SyllabusGroup } from "../domain/public-plan";

// Temario (planeación §4.4, design system §11.2): sale solo de los videos asociados al plan
// (planeación §7.6) y la API manda solo títulos. Nada aquí se puede reproducir: el ícono es
// decorativo y los títulos no son enlaces.
export function Syllabus({ groups }: { groups: SyllabusGroup[] }) {
  const withVideos = groups.filter((group) => group.videos.length > 0);
  if (withVideos.length === 0) return null;
  return (
    <section aria-labelledby="temario-titulo">
      <h2 id="temario-titulo" className="font-display text-display-2 tracking-[0.01em]">
        Temario
      </h2>
      <p className="text-muted-foreground mt-2">Las técnicas que aprendes con video.</p>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {withVideos.map((group) => (
          <div key={group.category.code}>
            <h3 id={`temario-${group.category.code}`} className="text-xl font-semibold">
              {group.category.name}
            </h3>
            <ul
              aria-labelledby={`temario-${group.category.code}`}
              className="mt-3 flex flex-col gap-2"
            >
              {group.videos.map((video) => (
                <li key={video.id} className="flex gap-3">
                  <CirclePlay
                    aria-hidden
                    className="text-muted-foreground mt-0.5 size-5 shrink-0"
                  />
                  <span>{video.title}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
