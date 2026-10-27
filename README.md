# Nexora Fit — frontend

Web de la plataforma de planes de entrenamiento: Next.js 15 (App Router) + TypeScript + Tailwind 4 + shadcn + TanStack Query, con arquitectura limpia por features.

> ⚠️ Repositorio privado y confidencial.

## Documentos
- [Planeación del front](docs/planeacion/planeacion-front.md)
- [Guía de desarrollo del front](docs/guia-desarrollo-front.md)
- Planeación del producto y contrato de la API: repo `nexorafit-back`, `docs/planeacion/`.

## Mapa de carpetas

Dentro de cada feature, las dependencias apuntan hacia adentro: `ui` → `application` → `domain`, e `infrastructure` → `application` → `domain`. La UI nunca importa `infrastructure` (guía front §2).

```
src/
├── app/                     # rutas de Next.js: solo composición
│   ├── (public)/            # landing, deportes, checkout, acceder, legales
│   ├── (student)/           # mis-planes
│   └── admin/               # panel
├── features/
│   ├── catalog/  checkout/  access/  student/  player/
│   └── admin/
│       └── auth/  dashboard/  orders/  keys/  direct-access/
│           custom-plans/  videos/  plans-editor/  products/
│   (cada feature tiene: domain/ · application/use-cases/ · infrastructure/ · ui/)
├── shared/
│   ├── domain/              # AppError, tipos comunes, puertos compartidos
│   ├── infrastructure/
│   │   ├── http/            # cliente Axios
│   │   └── api/             # schema.d.ts generado desde el OpenAPI
│   ├── ui/                  # shadcn y primitivas, sin lógica de negocio
│   └── lib/                 # utilidades puras
└── core/                    # composition root: container, providers
test/
└── fakes/                   # puertos en memoria para las pruebas
public/
docs/adr/                    # decisiones de arquitectura
```

## Correr en local

Requisitos: **Node 24** (`nvm use` toma la versión de `.nvmrc`) y **uv** (para `uvx pre-commit` y `uvx commitizen`, igual que en el back).

```bash
nvm use
make setup      # npm ci + hooks de pre-commit/commit-msg + copia .env.example a .env
make dev        # http://localhost:3000 (PORT=3010 make dev si está ocupado)
make check      # lint (ESLint con las capas + Prettier), tipos, Jest y build: debe pasar antes de un PR
```

`make help` lista todos los comandos.

### Proxy hacia el back

El navegador nunca llama al back directo: todo pasa por `/api/v1`, que Next reescribe hacia
`API_URL` (`next.config.ts`). Así la cookie de sesión no necesita `Domain` y se evita CORS.

1. Corre el back (`nexorafit-back`) — en un árbol de trabajo aparte si ya tiene una rama abierta
   en el tuyo: `git worktree add ../nexorafit-back-<tarea> develop`, luego `make db`, `make migrate`,
   `make api` (expone la API en `http://localhost:8000`).
2. Ajusta `API_URL` en `.env` si usas otro puerto. Se valida con Zod al arrancar
   (`src/shared/infrastructure/env.ts`): si falta, el build/dev falla con un mensaje claro.
3. `make dev` y abre `http://localhost:3000`: la home muestra el estado de `/api/v1/health`.

### Tipos de la API

`src/shared/infrastructure/api/schema.d.ts` se genera con `openapi-typescript` a partir del
OpenAPI de FastAPI y **se versiona** (el build no depende de que la API esté arriba, y el diff
del PR muestra qué cambió del contrato). Se regenera con:

```bash
make openapi                                      # usa $API_URL/openapi.json
make openapi OPENAPI_URL=https://dev.api.../openapi.json   # o apunta a dev
```

La UI nunca importa `schema.d.ts` directo: solo `infrastructure/` lo usa para mapear la
respuesta de la API al tipo de dominio de cada feature.
