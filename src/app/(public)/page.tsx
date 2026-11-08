import { readOrSkipDuringBuild } from "@/core/build-phase";
import { getServerContainer } from "@/core/server-container";
import {
  About,
  DirectAccessCta,
  Hero,
  HowItWorks,
  Includes,
  PackBanner,
  SportCards,
} from "@/features/catalog";

// Precios del catálogo con ISR de 5 min (planeación front §2.1, guía §5.1).
export const revalidate = 300;

// Landing (planeación §3.2–§3.9, en ese orden). Deportes, pack y acceso directo dependen de
// /catalog: si el build corre sin API se omiten hasta la primera revalidación
// (readOrSkipDuringBuild), y un producto inactivo (`null`) no se ofrece.
export default async function HomePage() {
  const catalog = await readOrSkipDuringBuild(() => getServerContainer().catalog.getCatalog());

  return (
    <>
      <Hero />
      <About />
      <HowItWorks />
      {catalog && <SportCards plans={catalog.plans} />}
      {catalog?.pack && <PackBanner pack={catalog.pack} />}
      <Includes />
      {catalog?.directAccess && <DirectAccessCta offer={catalog.directAccess} />}
    </>
  );
}
