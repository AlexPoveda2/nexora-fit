# Nexora Fit — frontend

Web de la plataforma de planes de entrenamiento: Next.js 15 (App Router) + TypeScript + Tailwind 4 + shadcn + TanStack Query, con arquitectura limpia por features.

> ⚠️ Repositorio privado y confidencial.

## Documentos
- [Planeación del front](docs/planeacion/planeacion-front.md)
- [Guía de desarrollo del front](guia-desarrollo-front.md)
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
make setup      # npm ci + hooks de pre-commit y commit-msg
make dev        # http://localhost:3000 (PORT=3010 make dev si está ocupado)
make check      # lint (ESLint con las capas + Prettier), tipos y build: debe pasar antes de un PR
```

`make help` lista todos los comandos. Jest, el proxy `/api/v1` hacia el back y `make openapi` llegan con las siguientes tareas de **HUF-1**.
