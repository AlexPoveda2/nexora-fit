# Design system: frontend

El design system de Nexora Fit vive en el repositorio
[nexorafit-design-system](https://github.com/AlexPoveda2/nexorafit-design-system): tokens (`tokens.json`),
dirección visual, reglas de UX, una spec por componente y un visor que se abre sin servidor.

- Tokens: no se editan en `src/app/globals.css`; se cambian allá y se sincronizan (`docs/ADOPCION.md`).
- Componentes: se implementan aquí, en `src/shared/ui/`, siguiendo `components/<Nombre>/README.md`.
- Checklist de UI para cada PR: `docs/UX.md` de ese repositorio.
