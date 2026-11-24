import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { readOrSkipDuringBuild } from "@/core/build-phase";
import { getServerContainer } from "@/core/server-container";
import {
  BuyBar,
  EquipmentList,
  FreeSampleTeaser,
  LevelCards,
  PlanHeader,
  Syllabus,
} from "@/features/catalog";
import { Container } from "@/shared/ui/container";

// Precios y contenido del plan con ISR de 5 min (planeación front §2.1, guía §5.1).
export const revalidate = 300;

type Params = Promise<{ deporte: string }>;

// Los 4 deportes del catálogo se generan en el build (guía §5.2). Sin API en el build (CI) no
// se pre-genera ninguno y cada página se genera en su primera visita; un deporte nuevo que Sam
// active después también se genera al visitarlo (dynamicParams queda en true).
export async function generateStaticParams(): Promise<{ deporte: string }[]> {
  const catalog = await readOrSkipDuringBuild(() => getServerContainer().catalog.getCatalog());
  return (catalog?.plans ?? []).map((plan) => ({ deporte: plan.slug }));
}

// getPlan está memoizado por petición (server-container): metadata y página hacen una sola
// llamada a la API.
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { deporte } = await params;
  const plan = await getServerContainer().catalog.getPlan(deporte);
  if (!plan) return {};
  const title = `Plan de ${plan.name} · Nexora Fit`;
  return {
    title,
    description: plan.description,
    openGraph: {
      title,
      description: plan.description,
      type: "website",
      locale: "es_CO",
      ...(plan.imageUrl && { images: [{ url: plan.imageUrl }] }),
    },
  };
}

// Página de cada deporte (planeación §4): los 8 bloques en su orden. En lg+ la compra va en una
// columna fija al lado; por debajo de lg, al final, con la barra fija abajo (BuyBar).
export default async function PlanPage({ params }: { params: Params }) {
  const { deporte } = await params;
  const plan = await getServerContainer().catalog.getPlan(deporte);
  if (!plan) notFound();

  return (
    <>
      <PlanHeader
        name={plan.name}
        description={plan.description}
        imageUrl={plan.imageUrl}
        audience={plan.audience}
      />
      <Container className="grid gap-16 py-16 md:py-20 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
        <div className="flex flex-col gap-16 md:gap-20">
          <LevelCards levels={plan.levels} />
          <Syllabus groups={plan.syllabus} />
          {plan.freeSample && <FreeSampleTeaser sample={plan.freeSample} />}
          {/* Día de ejemplo con bloques difuminados (planeación §4.6): TF-15. */}
          <EquipmentList equipment={plan.equipment} />
        </div>
        <aside aria-label="Compra">
          <BuyBar planName={plan.name} product={plan.product} pack={plan.pack} />
        </aside>
      </Container>
    </>
  );
}
