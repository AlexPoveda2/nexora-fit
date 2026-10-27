# 0004 — Fakes por puerto en lugar de MSW

- Estado: aceptada (2026-10-24)
- Contexto: para probar un componente de `ui/` que llama a un puerto (p. ej. `HealthPort`), hay dos caminos habituales: interceptar las peticiones HTTP a nivel de red con una librería como MSW, o sustituir la implementación del puerto por una en memoria. La guía front (§2.4, §11.3) ya exige que toda dependencia externa se consuma a través de un puerto inyectado por `src/core/container.ts`.
- Decisión:
  - Las pruebas usan **fakes**: implementaciones reales y simples de cada puerto (`test/fakes/fake-health-repository.ts`), que se pasan al componente a través de `renderWithContainer(<Comp/>, { health: fake })` (`test/render.tsx`).
  - No se instala MSW ni se mockea Axios con `jest.mock`. Si un componente de `ui/` necesitara interceptar HTTP directamente, sería una señal de que está importando `infrastructure/`, lo que ya bloquea `eslint-plugin-boundaries` (ADR 0002).
- Consecuencias:
  - Las pruebas no conocen URLs, métodos HTTP ni el formato de la API: solo conocen la interfaz del puerto (`application/ports.ts` o el `*Port` de cada feature), igual que el componente que prueban.
  - Si cambia el contrato de la API, los fakes no se rompen (siguen devolviendo el tipo de dominio); solo se actualiza el *mapper* de `infrastructure/` y, si aplica, el propio tipo de dominio.
  - Queda sin cubrir la integración real HTTP-a-HTTP del proxy y el back: esa verificación es manual, en el navegador, contra el back real corriendo en local (como se hizo en TF-4 y TF-5), no una prueba automatizada del repo.
  - Si en el futuro hiciera falta probar algo que MSW resuelve mejor que un fake (p. ej. reintentos de red reales), se evalúa en un ADR nuevo en vez de revertir este.
