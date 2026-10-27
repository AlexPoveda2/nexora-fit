# 0002 — Arquitectura limpia por features, validada con ESLint

- Estado: aceptada (2026-10-24)
- Contexto: en fronts anteriores, los componentes llamaban a Axios directamente. Cambiar un campo de la API rompía pantallas en lugares inesperados, y no se podían probar sin levantar el back (guía front §2.5). La guía propone una arquitectura limpia por feature (`domain → application → infrastructure → ui`), pero sin un mecanismo que la haga cumplir, las reglas se diluyen con el tiempo.
- Decisión:
  - Cada feature se organiza en cuatro capas (`domain/`, `application/`, `infrastructure/`, `ui/`) más un `index.ts` como API pública, con dependencias que solo apuntan hacia adentro.
  - `eslint-plugin-boundaries` (v5.4.0; la v7 cambia la clave de la regla a `boundaries/dependencies`) valida esas dependencias en cada commit y en la CI: un componente de `ui/` que importe `axios` o la `infrastructure/` de su propia feature o de otra no pasa el lint.
  - `no-restricted-imports` bloquea React, Next.js, Axios, Zod y TanStack en `domain/` y `application/`, para que el núcleo de cada feature sea TypeScript puro.
  - La inyección de dependencias es manual: `src/core/container.ts` construye las implementaciones reales y las entrega por contexto de React (`useContainer()`); los tests sustituyen el *container* por *fakes* en memoria (`test/render.tsx`), sin necesidad de MSW ni de mockear Axios (ver ADR 0004).
- Consecuencias:
  - Cada feature nueva repite la misma plantilla de cuatro carpetas, incluso cuando una pantalla es solo lectura y no necesita un caso de uso explícito (guía front §2.3).
  - Agregar una capa nueva (p. ej. `src/features/admin/*`) exige actualizar los patrones de `eslint.config.mjs`: el patrón de `admin` debe ir antes del genérico `src/features/*/<capa>/**`, porque admin está un nivel más adentro.
  - El costo de este andamiaje se paga una sola vez por feature; a cambio, ESLint detecta en el commit lo que antes solo aparecía en producción.
