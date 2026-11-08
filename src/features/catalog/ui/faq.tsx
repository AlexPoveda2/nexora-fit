import Link from "next/link";
import type { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { Container } from "@/shared/ui/container";

// Preguntas de la planeación §3.9, en ese orden. Las respuestas salen de la planeación (§5.2–§5.6
// acceso y dispositivos, §8.2 medios de pago). PROVISIONAL hasta que Sam las confirme
// (planeación front §8): la duración del acceso (la planeación §9.1 la deja "a definir" y
// propone 12 meses), si Wompi acepta tarjetas de fuera de Colombia (§15, pregunta 9), el
// equipo y los reembolsos (pendientes de los textos legales, HUF-5).
// La misma cuenta del footer, también provisional hasta que Sam la confirme.
const INSTAGRAM_URL = "https://instagram.com/nexorafit";

type Question = { question: string; answer: ReactNode };

// Los días del acceso directo vienen de /catalog (los mismos que muestra DirectAccessCta); si
// la API no lo ofrece, la respuesta no lo menciona.
function accessDuration(directAccessDays: number | null): Question {
  return {
    question: "¿Por cuánto tiempo tengo acceso?",
    answer: (
      <p>
        A cada plan que compres tienes acceso durante 12 meses desde el día del pago.
        {directAccessDays !== null &&
          ` El acceso directo (chat conmigo) dura ${directAccessDays} días.`}
      </p>
    ),
  };
}

const QUESTIONS: Question[] = [
  {
    question: "¿Cómo accedo después de pagar?",
    answer: (
      <p>
        Apenas se aprueba el pago ves tu código de acceso en pantalla y te llega al correo. Con él
        entras a tus planes desde <Link href="/acceder">Ya tengo código</Link>. Si pagas con PSE o
        Nequi y el pago tarda en confirmarse, el código te llega al correo apenas se apruebe.
      </p>
    ),
  },
  {
    question: "¿Necesito crear una cuenta?",
    answer: (
      <p>
        No, con tu código basta: no hay usuario ni contraseña. Si compras otro plan con el mismo
        correo, se suma a tu mismo código.
      </p>
    ),
  },
  {
    question: "¿Qué pasa si pierdo mi código?",
    answer: (
      <p>
        En <Link href="/acceder">Ya tengo código</Link> toca &quot;¿Perdiste tu código?&quot; y
        escribe el correo con el que compraste: te enviamos el código y un enlace para entrar.
      </p>
    ),
  },
  {
    question: "¿En cuántos dispositivos puedo usarlo?",
    answer: (
      <p>
        En hasta 3 dispositivos a la vez, y en cada uno escribes el código una sola vez. Si entras
        desde un cuarto, se cierra la sesión del más antiguo y te avisamos por correo.
      </p>
    ),
  },
  {
    question: "¿Qué medios de pago aceptan? ¿Puedo pagar desde fuera de Colombia?",
    answer: (
      <p>
        Tarjeta de crédito o débito, PSE, Nequi y Botón Bancolombia, a través de Wompi. El cobro es
        en pesos colombianos. Si estás fuera de Colombia, escríbeme por{" "}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>{" "}
        antes de pagar: estamos confirmando qué tarjetas internacionales se aceptan.
      </p>
    ),
  },
  {
    question: "¿Necesito equipo o gimnasio?",
    answer: (
      <p>
        Depende del deporte. En la página de cada plan está el equipo que necesitas; el plan de
        gimnasio sí requiere un gimnasio con máquinas.
      </p>
    ),
  },
  {
    question: "¿Hay reembolsos?",
    answer: (
      <p>
        Las condiciones están en la <Link href="/reembolsos">política de reembolsos</Link>.
      </p>
    ),
  },
];

// Preguntas frecuentes (planeación §3.9, design system §10.4 y §11.2): Accordion de Radix de una
// sola columna, `max-w-3xl`. Radix da el teclado (Enter/Espacio, flechas, Inicio/Fin),
// `aria-expanded` y `aria-controls`; se abre una a la vez y todas pueden quedar cerradas.
export function Faq({ directAccessDays }: { directAccessDays: number | null }) {
  // Mismo orden de la planeación §3.9: la duración va sexta.
  const questions = [
    ...QUESTIONS.slice(0, 5),
    accessDuration(directAccessDays),
    ...QUESTIONS.slice(5),
  ];
  return (
    <section aria-labelledby="faq-titulo" id="preguntas-frecuentes" className="py-16 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <h2 id="faq-titulo" className="font-display text-display-2 tracking-[0.01em]">
            Preguntas frecuentes
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {questions.map(({ question, answer }) => (
              <AccordionItem key={question} value={question}>
                <AccordionTrigger className="text-base">{question}</AccordionTrigger>
                {/* forceMount: las respuestas cerradas quedan en el HTML para los buscadores
                    (Radix las desmonta si no). Con forceMount Radix ya no las oculta, así que
                    se ocultan con CSS mientras su ítem está cerrado. */}
                <AccordionContent
                  forceMount
                  className="text-muted-foreground text-base in-data-[state=closed]:hidden"
                >
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}
