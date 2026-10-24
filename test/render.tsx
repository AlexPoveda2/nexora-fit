import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

import type { Container } from "@/core/container";
import { Providers } from "@/core/providers";

import { FakeHealthRepository } from "./fakes/fake-health-repository";

/** Contenedor de fakes por defecto: cada fake nuevo de test/fakes/ se agrega aquí. */
export function emptyContainer(): Container {
  return {
    health: new FakeHealthRepository(),
  };
}

/** Renderiza con el contenedor de fakes; la prueba solo pasa los puertos que usa. */
export function renderWithContainer(
  ui: ReactElement,
  fakes: Partial<Container> = {},
  options?: Omit<RenderOptions, "wrapper">,
) {
  const container: Container = { ...emptyContainer(), ...fakes };
  return render(ui, {
    wrapper: ({ children }) => <Providers container={container}>{children}</Providers>,
    ...options,
  });
}
