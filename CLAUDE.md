# Nexora Fit — frontend

Next.js 15 (App Router) para la plataforma de planes de entrenamiento. Planeación en `docs/planeacion/`. Reglas completas en [docs/guia-desarrollo-front.md](docs/guia-desarrollo-front.md); este archivo solo enlaza y resume.
API: repo `nexorafit-back`, contrato en `docs/planeacion/endpoints-api.md` de ese repo.
Design system (tokens y specs): repo `nexorafit-design-system`; no editar tokens en `globals.css` a mano (bloque generado, se sincroniza desde allá).

## Reglas
- Arquitectura limpia por features: guía §2. `eslint-plugin-boundaries` la valida (`make lint`).
- La UI nunca importa `infrastructure/` ni Axios. Los tipos de `schema.d.ts` solo en `infrastructure/`.
- Sin Route Handlers ni Server Actions con lógica: el único backend es FastAPI, siempre a través del proxy `/api/v1` (`next.config.ts`).
- `src/shared/infrastructure/env.ts` valida las variables de entorno con Zod al arrancar.
- Verificar SIEMPRE con `make check` y en el navegador a 360 px antes de dar algo por terminado.
- No crear scripts de prueba en el repo: verificación en el scratchpad y evidencia en el PR.
- Commits Conventional en español. **1 issue → 1 rama → 1 PR**, contra `develop`.
- `/code-review` antes de pedir revisión humana.

## Comandos
```
make setup | make dev [PORT=3010] | make test [ARGS="-t x"] | make check | make openapi [OPENAPI_URL=...]
```

## Mapa
```
src/app/        rutas de Next.js: solo composición (layouts, metadata, robots.ts)
src/features/   catalog, checkout, access, student, player, admin/*
                (cada una: domain/ · application/ · infrastructure/ · ui/ · index.ts)
src/shared/     domain (AppError, puertos compartidos), infrastructure (http, schema
                generado por openapi-typescript, env.ts), ui (shadcn), lib
src/core/       composition root: container.ts, providers.tsx, use-container.ts
test/           fakes por puerto, render.tsx, setup de Jest
docs/adr/       decisiones de arquitectura
```

Seguimiento de tareas en Notion (historias `HUF-n`, tareas `TF-n`), enlazadas desde cada issue de GitHub.
