// Tipos de los imports estáticos de imágenes (`import foto from "./foto.jpg"`). Ya vienen en
// next-env.d.ts, pero ese archivo lo genera `next dev`/`next build` y no se versiona: sin esto,
// `tsc` falla en un clon limpio (CI, pre-commit) porque corre antes del build.
/// <reference types="next/image-types/global" />
