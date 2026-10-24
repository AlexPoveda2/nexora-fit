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

El proyecto Next.js ejecutable (`package.json`, ESLint con las reglas de capas, Jest, proxy `/api/v1`) llega con la historia **HUF-1**. Como el repo ya no está vacío, `create-next-app` se ejecuta en una carpeta temporal y se copian los archivos.
