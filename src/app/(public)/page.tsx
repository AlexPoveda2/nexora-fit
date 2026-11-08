import { About, Hero, HowItWorks } from "@/features/catalog";

// Landing (planeación §3). Hero, bienvenida y cómo funciona son contenido fijo: no leen la API
// y la página se genera estática en el build. Cuando lleguen las secciones con precios
// (deportes y pack, TF-12) se suma `revalidate = 300` y la lectura del catálogo (guía §5.1).
export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <HowItWorks />
    </>
  );
}
