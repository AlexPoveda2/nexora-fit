import { render, screen } from "@testing-library/react";

import { renderWithContainer } from "@/test/render";

import { useContainer } from "./use-container";

function ContainerProbe() {
  const container = useContainer();
  return <p>{`Puertos: ${Object.keys(container).length}`}</p>;
}

it("entrega el contenedor de fakes a los componentes", () => {
  renderWithContainer(<ContainerProbe />);

  expect(screen.getByText("Puertos: 0")).toBeInTheDocument();
});

it("falla con un mensaje claro si se usa fuera de <Providers>", () => {
  jest.spyOn(console, "error").mockImplementation(() => {}); // React registra el error lanzado

  expect(() => render(<ContainerProbe />)).toThrow("useContainer fuera de <Providers>");
});
