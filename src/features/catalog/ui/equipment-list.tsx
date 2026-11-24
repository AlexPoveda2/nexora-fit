import { Badge } from "@/shared/ui/badge";

// Equipo necesario (planeación §4.7, design system §11.2): insignias `neutral`. Una lista vacía
// también informa: el plan se hace sin equipo.
export function EquipmentList({ equipment }: { equipment: string[] }) {
  return (
    <section aria-labelledby="equipo-titulo">
      <h2 id="equipo-titulo" className="font-display text-display-2 tracking-[0.01em]">
        Equipo necesario
      </h2>
      {equipment.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {equipment.map((item, index) => (
            <li key={`${index}-${item}`}>
              <Badge variant="neutral" className="px-3 py-1 text-sm">
                {item}
              </Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6">No necesitas equipo: solo tu cuerpo y un poco de espacio.</p>
      )}
    </section>
  );
}
