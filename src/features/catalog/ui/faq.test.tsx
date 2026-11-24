import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Faq } from "./faq";

function questions() {
  return screen.getAllByRole("button").filter((button) => button.hasAttribute("aria-expanded"));
}

it("lista las 8 preguntas de la planeación en orden, todas cerradas", () => {
  render(<Faq directAccessDays={30} />);

  expect(screen.getByRole("heading", { level: 2, name: "Preguntas frecuentes" })).toBeVisible();
  expect(questions()).toHaveLength(8);
  expect(questions()[5]).toHaveAccessibleName("¿Por cuánto tiempo tengo acceso?");
  questions().forEach((question) => expect(question).toHaveAttribute("aria-expanded", "false"));
});

it("las respuestas cerradas están en el HTML, dentro de su ítem cerrado", () => {
  render(<Faq directAccessDays={30} />);

  // Se ocultan con CSS (in-data-[state=closed]:hidden); jsdom no aplica Tailwind, así que la
  // visibilidad se revisa en el navegador.
  const answer = screen.getByText(/No, con tu código basta/);
  expect(answer.closest('[data-slot="accordion-content"]')).toHaveAttribute("data-state", "closed");
});

it("abre y cierra una respuesta con el teclado", async () => {
  const user = userEvent.setup();
  render(<Faq directAccessDays={30} />);
  const question = screen.getByRole("button", { name: "¿Necesito crear una cuenta?" });

  question.focus();
  await user.keyboard("{Enter}");

  expect(question).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("region", { name: "¿Necesito crear una cuenta?" })).toHaveTextContent(
    "No, con tu código basta",
  );

  await user.keyboard(" ");
  expect(question).toHaveAttribute("aria-expanded", "false");
});

it("abre una pregunta a la vez", async () => {
  const user = userEvent.setup();
  render(<Faq directAccessDays={30} />);
  const first = screen.getByRole("button", { name: "¿Cómo accedo después de pagar?" });
  const second = screen.getByRole("button", { name: "¿Hay reembolsos?" });

  await user.click(first);
  await user.click(second);

  expect(first).toHaveAttribute("aria-expanded", "false");
  expect(second).toHaveAttribute("aria-expanded", "true");
});

it("los días del acceso directo salen del catálogo y no se mencionan si no se ofrece", () => {
  const { unmount } = render(<Faq directAccessDays={15} />);
  expect(screen.getByText(/dura 15 días/)).toBeInTheDocument();
  unmount();

  render(<Faq directAccessDays={null} />);
  expect(screen.queryByText(/acceso directo/)).not.toBeInTheDocument();
});
