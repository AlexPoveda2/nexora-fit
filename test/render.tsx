import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

import type { Container } from "@/core/container";
import { ContainerContext } from "@/core/use-container";

/** Contenedor de fakes vacíos: cada fake nuevo de test/fakes/ se agrega aquí. */
export function emptyContainer(): Container {
  return {};
}

/** Renderiza con el contenedor de fakes; la prueba solo pasa los puertos que usa. */
export function renderWithContainer(
  ui: ReactElement,
  fakes: Partial<Container> = {},
  options?: Omit<RenderOptions, "wrapper">,
) {
  const container: Container = { ...emptyContainer(), ...fakes };
  return render(ui, {
    wrapper: ({ children }) => (
      <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>
    ),
    ...options,
  });
}
