# Guía de desarrollo: frontend

- **Versión:** 1.0
- **Fecha:** 2026-10-23
- **Aplica a:** el repositorio `nexora-fit` (frontend de Nexora Fit) y a los próximos fronts, salvo que un proyecto documente otra decisión en un ADR (§15).
- **Para:** Alex, Santiago y los agentes de IA que trabajen en el repositorio.
- **Complementa a:** la guía del back (`nexorafit-back/docs/guia-desarrollo.md`). Lo que aquí no se dice (issues, ramas, PRs, revisión) funciona igual que allá; §12 indica qué secciones aplican tal cual.

Las reglas marcadas con **SIEMPRE** no se negocian por proyecto. El resto son valores por defecto que se pueden cambiar dejando el porqué en un ADR.

> **Cambio frente a la guía del back:** la guía del back (§4.2) propone React + Vite + React Router. Este repo usa **Next.js 15 (App Router)** para tener SSR y SEO en la landing y en las páginas de deporte, un proxy hacia la API (§5.4) y el mismo stack de los fronts del mercado al que apuntamos. Se documenta en el ADR `0001` de este repo, y conviene actualizar la §4.2 de la guía del back.

---

## Índice
1. [Principios](#1-principios)
2. [Arquitectura limpia (SIEMPRE)](#2-arquitectura-limpia-siempre)
3. [Ejemplo completo: entrar con código](#3-ejemplo-completo-entrar-con-código)
4. [Stack tecnológico](#4-stack-tecnológico)
5. [Next.js: reglas del App Router](#5-nextjs-reglas-del-app-router)
6. [Estructura del repositorio](#6-estructura-del-repositorio)
7. [Estilo de código TypeScript](#7-estilo-de-código-typescript)
8. [UI, diseño y accesibilidad](#8-ui-diseño-y-accesibilidad)
9. [Reglas específicas de Nexora Fit](#9-reglas-específicas-de-nexora-fit)
10. [pre-commit y tareas (SIEMPRE)](#10-pre-commit-y-tareas-siempre)
11. [Pruebas](#11-pruebas)
12. [Ramas, commits, issues y PRs](#12-ramas-commits-issues-y-prs)
13. [CI/CD y entornos](#13-cicd-y-entornos)
14. [Trabajo con IA](#14-trabajo-con-ia)
15. [Otras prácticas](#15-otras-prácticas)
16. [Checklist para arrancar el repo](#16-checklist-para-arrancar-el-repo)

---

## 1. Principios

1. **El front no tiene reglas de negocio del servidor.** Quién puede ver un video, cuánto cuesta un producto o si una orden está aprobada lo decide la API. El front solo valida lo que mejora la experiencia (formato del código, campos obligatorios) y muestra lo que la API responde.
2. **La UI no sabe cómo se habla con el backend.** Un componente nunca ve Axios, URLs ni los tipos generados del OpenAPI. Cambiar un endpoint es tocar un adaptador, no veinte componentes.
3. **Un solo backend.** El backend es FastAPI. En Next.js **no** se escriben Route Handlers ni Server Actions con lógica de negocio; la única pieza de servidor del front es el proxy (§5.4).
4. **Mobile-first.** La mayoría del tráfico llega desde Instagram en el celular (planeación §2).
5. **Lo que no está automatizado no existe.** Las capas se validan con ESLint (§2.5), el formato con Prettier y los tipos con `tsc`, en pre-commit y en la CI.
6. **Simple antes que inteligente.** Sin librerías de inyección de dependencias, sin estado global "por si acaso" y sin abstracciones que hoy no tengan dos usos.

---

## 2. Arquitectura limpia (SIEMPRE)

### 2.1 Features verticales con capas adentro

El código se organiza **por feature** (*vertical slices*), y cada feature tiene sus capas. Así una persona o un agente que trabaja en "checkout" encuentra todo en una carpeta, y las reglas de dependencia son las mismas en todas.

```
                    src/app/  (rutas de Next.js: solo composición)
                              │
                              ▼
   ┌──────────────────────── feature ────────────────────────┐
   │                                                          │
   │   ui/  componentes + hooks (React, TanStack Query, RHF)  │
   │     │                                                    │
   │     ▼                                                    │
   │   application/  casos de uso + PUERTOS (interfaces)      │
   │     │                         ▲                          │
   │     ▼                         │ implementa               │
   │   domain/  tipos y reglas     infrastructure/            │
   │   (TS puro)                   Axios, Wompi, Turnstile,   │
   │                               mapeo DTO → dominio        │
   └──────────────────────────────────────────────────────────┘
                              ▲
              src/core/  composition root (conecta las piezas)
```

**Regla de dependencias:** los `import` **siempre apuntan hacia adentro**.

- `ui` → `application` → `domain`
- `infrastructure` → `application` → `domain`
- **`ui` nunca importa `infrastructure`.** Recibe las implementaciones por el contenedor (§2.4).
- `domain` y `application` no importan React, Next.js, Axios, Zod ni nada del navegador.

### 2.2 Qué va en cada capa

| Capa | Contiene | No puede contener |
|---|---|---|
| **`domain/`** | Tipos del negocio (`Plan`, `OrderStatus`, `Money`), reglas puras (`normalizeAccessCode`, `isTerminal(status)`, `formatCop`), errores propios. | React, Next.js, Axios, `window`, `fetch`, `Date.now()` (la fecha se recibe por parámetro). |
| **`application/ports.ts`** | Interfaces de lo que la feature necesita del exterior: `CatalogRepository`, `CheckoutRepository`, `PaymentWidget`, `CaptchaProvider`. | Implementaciones. |
| **`application/use-cases/`** | Funciones que orquestan: validan con el dominio, llaman a los puertos y devuelven tipos del dominio. Una función por caso de uso. | Hooks, JSX, Axios, `router.push`. |
| **`infrastructure/`** | Implementaciones de los puertos: repositorios HTTP con Axios, el Widget de Wompi y Turnstile. **Mapean los tipos generados del OpenAPI (snake_case) a tipos del dominio (camelCase).** | Componentes y reglas de negocio. |
| **`ui/`** | Componentes de la feature, hooks de TanStack Query que llaman a los casos de uso y formularios (RHF + Zod). | Llamadas HTTP, tipos generados del OpenAPI, imports de `infrastructure/`. |
| **`index.ts`** | La API pública de la feature: lo que otras features y `src/app/` pueden usar. | — |
| **`src/core/`** (*composition root*) | El único lugar que conoce las clases concretas: crea el cliente HTTP y los repositorios y los entrega por contexto. | Lógica. |
| **`src/app/`** | Rutas, layouts, `metadata` y composición de componentes de las features. | Lógica, llamadas HTTP directas y estado. |

### 2.3 Cuándo NO hace falta un caso de uso

Muchas pantallas solo leen datos ("traer el catálogo"). En ese caso el hook de `ui/` llama **directamente al puerto** sin archivo de caso de uso, igual que el CRUD trivial de la guía del back (§2.7). El caso de uso aparece cuando hay algo que orquestar o validar: entrar con código, crear una orden, consultar el resultado del pago hasta un estado final, guardar el contenido de un día en el panel.

### 2.4 Inyección de dependencias sin librerías

- `src/core/container.ts` define el tipo `Container` (solo puertos) y `createContainer(http)`, que crea los repositorios concretos.
- En el cliente, `src/core/providers.tsx` crea el contenedor **una vez** y lo entrega por un contexto de React. `useContainer()` lo lee.
- En los Server Components, `src/core/server-container.ts` (marcado `server-only`) crea otro contenedor con la URL interna de la API.
- En las pruebas se pasa un contenedor con *fakes* (§11.3). No hace falta MSW ni mocks de Axios para probar la UI.

> **Ajuste de la planeación (§10): puertos compartidos entre features.** Turnstile lo usan `checkout`, `access` y `admin/auth`. En vez de repetir `CaptchaProvider` (puerto) y su adaptador en cada una, el puerto vive en `shared/domain/ports.ts` y la implementación en `shared/infrastructure/`, y cada feature lo consume desde ahí. Las reglas de `boundaries` de §2.5 ya lo permiten sin ajustes: `application` puede importar `shared-domain`, e `infrastructure` puede importar `shared-infra`. Se aplica la primera vez que una feature necesita Turnstile; `health` (TF-4/TF-5) no lo necesitó porque no tiene nada que compartir todavía.

### 2.5 La arquitectura se valida sola: ESLint

Las reglas de §2.1 se verifican en cada commit y en la CI con `eslint-plugin-boundaries` (capas) y `no-restricted-imports` (frameworks prohibidos en el núcleo). Es el equivalente a `import-linter` del back.

```js
// eslint.config.mjs (extracto)
import boundaries from "eslint-plugin-boundaries";

export default [
  // ...next/core-web-vitals, typescript-eslint, prettier
  {
    plugins: { boundaries },
    settings: {
      "import/resolver": { typescript: { project: "./tsconfig.json" } },
      "boundaries/include": ["src/**/*"],
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**", mode: "full" },
        { type: "di", pattern: "src/core/use-container.ts", mode: "full" }, // antes que "core"
        { type: "core", pattern: "src/core/**", mode: "full" },
        { type: "domain", pattern: "src/features/*/domain/**", mode: "full", capture: ["feature"] },
        { type: "application", pattern: "src/features/*/application/**", mode: "full", capture: ["feature"] },
        { type: "infrastructure", pattern: "src/features/*/infrastructure/**", mode: "full", capture: ["feature"] },
        { type: "ui", pattern: "src/features/*/ui/**", mode: "full", capture: ["feature"] },
        { type: "feature-api", pattern: "src/features/*/index.ts", mode: "full", capture: ["feature"] },
        { type: "shared-domain", pattern: "src/shared/domain/**", mode: "full" },
        { type: "shared-infra", pattern: "src/shared/infrastructure/**", mode: "full" },
        { type: "shared-ui", pattern: "src/shared/ui/**", mode: "full" },
        { type: "shared-lib", pattern: "src/shared/lib/**", mode: "full" },
      ],
    },
    rules: {
      "boundaries/element-types": ["error", {
        default: "disallow",
        rules: [
          { from: "domain", allow: ["shared-domain", ["domain", { feature: "${from.feature}" }]] },
          { from: "application", allow: ["shared-domain", ["domain", { feature: "${from.feature}" }],
                                         ["application", { feature: "${from.feature}" }]] },
          { from: "infrastructure", allow: ["shared-domain", "shared-infra",
                                            ["domain", { feature: "${from.feature}" }],
                                            ["application", { feature: "${from.feature}" }],
                                            ["infrastructure", { feature: "${from.feature}" }]] },
          { from: "ui", allow: ["shared-domain", "shared-ui", "shared-lib", "feature-api", "di",
                                ["domain", { feature: "${from.feature}" }],
                                ["application", { feature: "${from.feature}" }],
                                ["ui", { feature: "${from.feature}" }]] },
          { from: "feature-api", allow: [["ui", { feature: "${from.feature}" }],
                                         ["domain", { feature: "${from.feature}" }],
                                         ["application", { feature: "${from.feature}" }]] },
          { from: "app", allow: ["feature-api", "core", "shared-ui", "shared-lib", "shared-domain"] },
          { from: ["core", "di"], allow: ["*"] },
          { from: ["shared-infra", "shared-ui", "shared-lib"], allow: ["shared-domain", "shared-lib"] },
        ],
      }],
    },
  },
  {
    files: ["src/features/*/domain/**", "src/features/*/application/**", "src/shared/domain/**"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [
        "react", "react-dom", "next", "next/*", "axios", "zod", "@tanstack/*",
        "@/shared/infrastructure/*", "@/core/*",
      ] }],
    },
  },
  {
    files: ["src/features/*/ui/**"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [
        "axios", "@/shared/infrastructure/*", "@/features/*/infrastructure/*",
      ] }],
    },
  },
];
```

- **Nota sobre `ui → core`:** de `core/` la UI solo puede importar `@/core/use-container` (elemento `di`). Ese archivo importa únicamente el **tipo** `Container`, así que la UI no arrastra implementaciones.
- La sintaxis de plantillas (`${from.feature}`) es la de `eslint-plugin-boundaries` v5. Si se instala otra versión, se ajusta y se deja en el PR.

> **Lección de proyectos anteriores:** en los fronts donde los componentes llamaban a Axios directamente, cambiar un campo de la API rompía pantallas en lugares inesperados y no se podían probar sin levantar el back. Con estas reglas, un componente que importe `axios` no pasa el commit.

> **Ajuste aplicado en TF-2 (`eslint.config.mjs` real):**
> - La versión instalada es `eslint-plugin-boundaries` **5.4.0** (la 7 cambia la clave de la regla a `boundaries/dependencies`).
> - `src/features/admin/*/<capa>/**` necesita su propio patrón **antes** del genérico `src/features/*/<capa>/**`, porque admin está un nivel más adentro y el patrón genérico no lo reconoce.
> - `app` se permite a sí mismo (`from: "app", allow: ["app", ...]`): `src/app/layout.tsx` importa `./globals.css`, y sin ese permiso ESLint lo bloqueaba.
> - La UI restringe `"**/infrastructure"` y `"**/infrastructure/**"` (no solo la ruta con alias) para cubrir imports relativos a la infraestructura de otra feature.
> - `src/shared/infrastructure/api/schema.d.ts` (generado por `make openapi`, TF-5) está en `ignores` de ESLint y en `.prettierignore`: no se edita a mano y no tiene sentido formatearlo.
> - `app` también puede importar `shared-infra` (TF-6), pero solo para los archivos de convención de Next sin lógica de negocio (`robots.ts`, `sitemap.ts`, `middleware.ts`) que necesitan leer `env.ts`. Una página o un componente de `src/app/` sigue sin poder tocar `infrastructure/` de una feature.
> - `shared-ui` se permite a sí mismo (TF-7): los componentes de shadcn se componen entre ellos (`Dialog` usa `Button`, `Command` usa `InputGroup`). `shared-infra` y `shared-lib` siguen sin poder importar `shared-ui`.

### 2.6 Receta: cómo se hace un cambio típico

| Si el cambio es… | Se toca | No se toca |
|---|---|---|
| Un campo nuevo en un endpoint | `make openapi` + mapeo en `infrastructure/` + tipo en `domain/` si se muestra | Componentes que no lo usan |
| Una regla de presentación (ej. "mostrar días restantes en rojo si quedan < 3") | `domain/` + su prueba + componente | Infraestructura |
| Un flujo nuevo (ej. "cerrar sesión en otros dispositivos") | Puerto + caso de uso (si orquesta) + repositorio HTTP + hook + componente + `core/container.ts` | Otras features |
| Cambiar de proveedor (ej. Turnstile → hCaptcha, Bunny → R2) | Adaptador nuevo en `infrastructure/` + una línea en `core/` | Dominio, casos de uso, UI |
| Una página nueva | `src/app/<ruta>/page.tsx` que compone componentes de las features | Capas internas |

**Orden de trabajo:** dominio y su prueba → puerto → caso de uso con prueba usando *fakes* → adaptador → hook y componente con prueba de RTL → conexión en `core/` → página en `src/app/`.

---

## 3. Ejemplo completo: entrar con código

`/acceder` → `POST /api/v1/access/redeem` (planeación de endpoints §6).

**Dominio:** reglas puras.
```ts
// src/features/access/domain/access-code.ts
// Alfabeto del back: sin 0/O, 1/I/L ni U (planeación §5.4).
const BODY = /^[2-9A-HJKMNP-TV-Z]{8}$/;

export class InvalidAccessCodeFormatError extends Error {
  constructor() {
    super("El código tiene el formato NXF-XXXX-XXXX.");
  }
}

export function normalizeAccessCode(raw: string): string {
  const compact = raw.toUpperCase().replace(/[\s-]/g, "");
  const body = compact.length === 11 && compact.startsWith("NXF") ? compact.slice(3) : compact;
  if (!BODY.test(body)) throw new InvalidAccessCodeFormatError();
  return `NXF-${body.slice(0, 4)}-${body.slice(4)}`;
}
```

**Puerto:** lo que la feature necesita.
```ts
// src/features/access/application/ports.ts
export type RedeemResult = {
  studentName: string;
  replacedOldestDevice: boolean;
};

export interface AccessRepository {
  /** Abre la sesión del alumno con un código ya normalizado. */
  redeem(code: string, captchaToken?: string): Promise<RedeemResult>;
}
```

**Caso de uso:** orquesta sin saber qué hay afuera.
```ts
// src/features/access/application/use-cases/redeem-code.ts
import { normalizeAccessCode } from "../../domain/access-code";
import type { AccessRepository, RedeemResult } from "../ports";

export type RedeemInput = { rawCode: string; captchaToken?: string };

export async function redeemCode(
  repo: AccessRepository,
  { rawCode, captchaToken }: RedeemInput,
): Promise<RedeemResult> {
  const code = normalizeAccessCode(rawCode); // si el formato es inválido no se gasta un intento
  return repo.redeem(code, captchaToken);
}
```

**Adaptador:** Axios y los tipos generados solo viven aquí.
```ts
// src/features/access/infrastructure/http-access-repository.ts
import type { AxiosInstance } from "axios";

import type { components } from "@/shared/infrastructure/api/schema";

import type { AccessRepository, RedeemResult } from "../application/ports";

type RedeemResponse = components["schemas"]["RedeemResponse"];

export class HttpAccessRepository implements AccessRepository {
  constructor(private readonly http: AxiosInstance) {}

  async redeem(code: string, captchaToken?: string): Promise<RedeemResult> {
    const { data } = await this.http.post<RedeemResponse>("/access/redeem", {
      code,
      turnstile_token: captchaToken ?? null,
    });
    return { studentName: data.name, replacedOldestDevice: data.replaced_oldest_device };
  }
}
```

**Cliente HTTP compartido:** convierte el formato de error de la API (endpoints §12) en un error del dominio.
```ts
// src/shared/infrastructure/http/client.ts
import axios, { type AxiosInstance } from "axios";

import { AppError } from "@/shared/domain/errors";

type ApiErrorBody = { error?: { code: string; message: string } };

export function createHttpClient(baseURL: string): AxiosInstance {
  const http = axios.create({ baseURL, withCredentials: true, timeout: 15_000 });
  http.interceptors.response.use(undefined, (error: unknown) => Promise.reject(toAppError(error)));
  return http;
}

function toAppError(error: unknown): AppError {
  if (axios.isAxiosError<ApiErrorBody>(error) && error.response) {
    const body = error.response.data?.error;
    return new AppError(body?.code ?? "UNKNOWN", error.response.status);
  }
  return new AppError("NETWORK_ERROR", 0);
}
```
```ts
// src/shared/domain/errors.ts
export class AppError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
  ) {
    super(code);
  }
}
```

**Composition root:** el único que conoce las piezas concretas.
```ts
// src/core/container.ts
import type { AxiosInstance } from "axios";

import type { AccessRepository } from "@/features/access/application/ports";
import { HttpAccessRepository } from "@/features/access/infrastructure/http-access-repository";
import type { CatalogRepository } from "@/features/catalog/application/ports";
import { HttpCatalogRepository } from "@/features/catalog/infrastructure/http-catalog-repository";

export type Container = {
  access: AccessRepository;
  catalog: CatalogRepository;
  // checkout, student, player, admin…
};

export function createContainer(http: AxiosInstance): Container {
  return {
    access: new HttpAccessRepository(http),
    catalog: new HttpCatalogRepository(http),
  };
}
```
```tsx
// src/core/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { createHttpClient } from "@/shared/infrastructure/http/client";

import { createContainer, type Container } from "./container";
import { ContainerContext } from "./use-container";

export function Providers({ children, container }: { children: ReactNode; container?: Container }) {
  const [queryClient] = useState(() => new QueryClient());
  const [value] = useState(() => container ?? createContainer(createHttpClient("/api/v1")));
  return (
    <QueryClientProvider client={queryClient}>
      <ContainerContext.Provider value={value}>{children}</ContainerContext.Provider>
    </QueryClientProvider>
  );
}
```
```ts
// src/core/use-container.ts
"use client";

import { createContext, useContext } from "react";

import type { Container } from "./container"; // solo el tipo: no arrastra implementaciones

export const ContainerContext = createContext<Container | null>(null);

export function useContainer(): Container {
  const container = useContext(ContainerContext);
  if (!container) throw new Error("useContainer fuera de <Providers>");
  return container;
}
```

**UI:** hook + formulario. No conoce URLs ni Axios.
```ts
// src/features/access/ui/use-redeem-code.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useContainer } from "@/core/use-container";

import { redeemCode, type RedeemInput } from "../application/use-cases/redeem-code";

export function useRedeemCode() {
  const { access } = useContainer();
  const router = useRouter();
  return useMutation({
    mutationFn: (input: RedeemInput) => redeemCode(access, input),
    onSuccess: () => router.push("/mis-planes"),
  });
}
```
```tsx
// src/features/access/ui/redeem-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { errorMessage } from "@/shared/lib/error-messages";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { useRedeemCode } from "./use-redeem-code";

const schema = z.object({ code: z.string().trim().min(1, "Escribe tu código") });

export function RedeemForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { code: "" },
  });
  const redeem = useRedeemCode();

  return (
    <form onSubmit={form.handleSubmit(({ code }) => redeem.mutate({ rawCode: code }))}>
      <label htmlFor="code">Código de acceso</label>
      <Input id="code" autoComplete="off" placeholder="NXF-XXXX-XXXX" {...form.register("code")} />
      {form.formState.errors.code && <p role="alert">{form.formState.errors.code.message}</p>}
      {redeem.error && <p role="alert">{errorMessage(redeem.error)}</p>}
      <Button type="submit" disabled={redeem.isPending}>
        Entrar
      </Button>
    </form>
  );
}
```

**Página:** solo compone.
```tsx
// src/app/(public)/acceder/page.tsx
import { RedeemForm } from "@/features/access";

export const metadata = { title: "Ya tengo código" };

export default function AccederPage() {
  return <RedeemForm />;
}
```

---

## 4. Stack tecnológico

Es el stack de los fronts que estamos tomando de referencia (React + Next.js con arquitectura por features). Es el valor por defecto de todo front nuevo.

| Pieza | Elección | Notas |
|---|---|---|
| Runtime | **Node 24 LTS** | `.nvmrc` en el repo |
| Gestor de paquetes | **npm** (`package-lock.json` versionado) | `npm ci` en CI, como en el back |
| Framework | **Next.js 15 (App Router)** + **React 19** | §5 |
| Lenguaje | **TypeScript 5.9**, `strict` | §7 |
| Estilos | **Tailwind CSS 4** | Tokens de marca en `@theme` (§8.1) |
| Componentes | **shadcn/ui** (Radix) + íconos `lucide-react` | Se copian a `src/shared/ui/` |
| Datos del servidor | **TanStack Query v5** | Único caché de datos en el cliente |
| HTTP | **Axios** | Una instancia, solo en `infrastructure/` |
| Contrato con la API | **openapi-typescript** | Tipos generados desde el OpenAPI de FastAPI |
| Formularios | **React Hook Form + Zod** | `@hookform/resolvers/zod` |
| Estado global (poco) | **zustand**, solo si hace falta | Hoy no hace falta: la sesión vive en una cookie y los datos en TanStack Query |
| Pruebas | **Jest + React Testing Library** + `@testing-library/user-event` | §11 |
| Calidad | **ESLint 9** (flat config) + **Prettier** (`prettier-plugin-tailwindcss`) + `eslint-plugin-boundaries` | §2.5 y §10 |
| Commits | **commitizen** (vía `uvx`, el mismo del back) | §12 |
| Video | **hls.js** (Bunny entrega HLS; Safari lo reproduce de forma nativa) | §9.4 |

**Dependencias que no se agregan sin ADR:** otra librería de estado (Redux, Jotai), otro cliente HTTP (`fetch` envuelto, `ky`), librerías de componentes completas (MUI, Chakra), CSS-in-JS o un ORM o base de datos en el front.

---

## 5. Next.js: reglas del App Router

### 5.1 Server Components vs Client Components

| Tipo de página | Cómo se renderiza | Datos |
|---|---|---|
| **Pública** (landing, `/planes/[deporte]`, `/pack-completo`, `/acceso-directo`, legales) | **Server Component** con ISR: `export const revalidate = 300` | `getServerContainer().catalog…` en la página; el HTML llega listo (SEO y velocidad en celular) |
| **Interactiva** (`/checkout/[producto]`, `/pago/resultado`, `/acceder`) | Página Server que monta un **Client Component** de la feature | TanStack Query (`useQuery` / `useMutation`) |
| **Privada** (`/mis-planes/**`, `/admin/**`) | Client Components | TanStack Query; la cookie `httpOnly` la envía el navegador |

- `"use client"` va en el componente **más bajo posible**, no en layouts ni páginas completas.
- Los Server Components de `src/app/` solo **leen datos y pasan props**. No tienen lógica, así que no necesitan pruebas propias; se prueban los componentes que reciben esas props.
- Las páginas privadas **no** se renderizan en el servidor con la sesión del alumno. Así no hay que reenviar cookies desde Next.js a la API y no se cachea por error contenido de un alumno.

> **Ajuste aplicado en TF-11: ISR y la API durante `next build`.** Una página con `revalidate` se prerenderiza en el build y llama a la API en ese momento; en la CI no hay API (§13.1), así que el build no puede depender de ella (igual que `schema.d.ts`, §12).
> - **Solo lee la API la página que muestra datos de la API.** El contenido fijo (hero, bienvenida, cómo funciona) no la llama: la landing de TF-11 se genera estática y el build pasa sin API.
> - **Cuando una página pública necesite el catálogo** (deportes y pack, TF-12), solo **durante el build** (`process.env.NEXT_PHASE === "phase-production-build"`) se captura el error de la API y la página se genera sin las secciones que dependen de ella (sin precios, sin un estado de error visible); la primera revalidación (`revalidate = 300`) la completa. **En ejecución el error no se captura:** si la API falla al revalidar, Next sigue sirviendo la última versión buena en vez de guardar una sin precios, y la primera visita sin caché cae en `error.tsx`.
> - Se descartó hacer la página dinámica en la CI: la CI dejaría de probar el build que se despliega.
> - **Implementado en TF-12:** `src/core/build-phase.ts` (`readOrSkipDuringBuild`) envuelve la lectura en la página. Solo absorbe `NETWORK_ERROR` (la API no responde): un 4xx/5xx o un error de mapeo rompen el build, para no publicar una landing vacía por un cambio de contrato. Sin API, la landing se genera sin deportes, pack ni acceso directo.

### 5.2 Rutas

Los nombres de las rutas son los de la planeación (§2), en español porque son URLs:

```
src/app/
├── (public)/                    # landing y páginas de venta
│   ├── page.tsx                 # /
│   ├── planes/[deporte]/page.tsx
│   ├── pack-completo/page.tsx
│   ├── acceso-directo/page.tsx
│   ├── checkout/[producto]/page.tsx
│   ├── pago/resultado/page.tsx
│   ├── acceder/page.tsx
│   └── (legal)/terminos | privacidad | reembolsos | aviso-salud
├── (student)/mis-planes/
│   ├── layout.tsx               # carga /me y muestra el menú del alumno
│   ├── page.tsx
│   └── [plan]/page.tsx · [plan]/tecnicas/page.tsx
├── admin/                       # panel: su propio layout y bundle
├── layout.tsx                   # <html>, fuentes, <Providers>
├── error.tsx · not-found.tsx
├── sitemap.ts · robots.ts
└── globals.css
```

- Los grupos `(public)` y `(student)` no cambian la URL; solo separan layouts.
- `generateStaticParams` en `planes/[deporte]` pre-genera los 4 deportes.

### 5.3 Middleware

`middleware.ts` solo mejora la experiencia: si no existe la cookie `nxf_session`, redirige `/mis-planes/**` a `/acceder`, y si no existe `nxf_admin`, redirige `/admin/**` al login. **No es seguridad:** la cookie puede existir y estar revocada. Quien decide es la API (401 → el hook redirige a `/acceder`).

### 5.4 Proxy hacia la API (SIEMPRE)

El navegador **nunca** llama a la API en otro dominio: llama a `/api/v1/*` en el mismo dominio del front, y Next.js lo reenvía.

```ts
// next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${process.env.API_URL}/api/v1/:path*` }];
  },
  images: { remotePatterns: [{ protocol: "https", hostname: process.env.MEDIA_HOST ?? "" }] },
};

export default config;
```

**Por qué:** las cookies de sesión (`httpOnly`, `SameSite=Lax`) quedan como cookies del propio front, así que funcionan igual en local, en dev sobre `*.onrender.com` y en producción, sin CORS ni subdominios. Esto resuelve el problema de dominios señalado en la planeación de endpoints (§1.1). Para que funcione, el back pone las cookies **sin** atributo `Domain`.

El webhook de Wompi no pasa por aquí: va directo a la API.

---

## 6. Estructura del repositorio

```
nexora-fit/
├── src/
│   ├── app/                     # §5.2: rutas y composición
│   ├── features/
│   │   ├── catalog/             # landing, deportes, pack, temario
│   │   ├── checkout/            # orden, Widget de Wompi, resultado del pago
│   │   ├── access/              # código, recuperación, enlace mágico, sesión
│   │   ├── student/             # "Mis planes", niveles, progreso, acceso directo, cuestionario
│   │   ├── player/              # reproductor + marca de agua
│   │   └── admin/               # subcarpetas por sección del panel (auth, orders, keys,
│   │                            #   custom-plans, videos, plans-editor, products)
│   │       └── <feature>/
│   │           ├── domain/
│   │           ├── application/ (ports.ts, use-cases/)
│   │           ├── infrastructure/
│   │           ├── ui/
│   │           └── index.ts
│   ├── shared/
│   │   ├── domain/              # AppError, Money, tipos comunes
│   │   ├── infrastructure/
│   │   │   ├── http/client.ts   # Axios
│   │   │   ├── api/schema.d.ts  # GENERADO por `make openapi` (no se edita a mano)
│   │   │   └── env.ts           # variables de entorno validadas con Zod
│   │   ├── ui/                  # shadcn y primitivas de layout, sin lógica de negocio
│   │   └── lib/                 # utilidades puras: cn(), formatCop(), error-messages.ts
│   └── core/                    # composition root: container.ts, server-container.ts,
│                                #   providers.tsx, use-container.ts
├── test/
│   ├── fakes/                   # implementaciones en memoria de los puertos
│   ├── render.tsx               # render de RTL con <Providers container={fakes}>
│   └── setup.ts                 # jest-dom, mock de next/navigation
├── public/                      # favicon y lo mínimo; las fotos van al bucket público
├── docs/
│   ├── planeacion/
│   ├── contexto/
│   └── adr/
├── .github/                     # ISSUE_TEMPLATE/, pull_request_template.md, workflows/ci.yml
├── middleware.ts
├── next.config.ts
├── eslint.config.mjs · .prettierrc · tsconfig.json · jest.config.ts · components.json
├── .pre-commit-config.yaml · .cz.toml · Makefile
├── .env.example · .nvmrc
├── CLAUDE.md
├── guia-desarrollo-front.md     # este documento (se mueve a docs/ al crear el esqueleto)
└── README.md
```

- Las pruebas van **junto al archivo** (`redeem-code.test.ts` al lado de `redeem-code.ts`). En `test/` solo va lo compartido.
- Alias único: `@/*` → `src/*`. No se usan rutas relativas que salgan de la feature (`../../../`).
- Una feature usa otra **solo por su `index.ts`** (ej. `student` muestra el reproductor importando `@/features/player`).

---

## 7. Estilo de código TypeScript

**El estilo se cumple con herramientas.** Prettier formatea, ESLint valida y `tsc` tipa.

```jsonc
// tsconfig.json (extracto)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "verbatimModuleSyntax": true,
    "paths": { "@/test/*": ["./test/*"], "@/*": ["./src/*"] }
  }
}
```
```json
// .prettierrc
{ "printWidth": 100, "plugins": ["prettier-plugin-tailwindcss"] }
```

**Convenciones:**
- **Archivos** en `kebab-case` (`redeem-form.tsx`). **Componentes** en `PascalCase`, **hooks** empiezan con `use`, **casos de uso** son verbos (`redeemCode`, `createOrder`), **puertos** son sustantivos con sufijo (`AccessRepository`, `PaymentWidget`) y las **implementaciones** llevan el proveedor como prefijo (`HttpAccessRepository`, `WompiPaymentWidget`).
- **Código en inglés** (identificadores) y **textos de cara al usuario en español**. Documentación, issues, PRs y commits en español, como en el back.
- **Sin `any`.** Si un dato viene de afuera sin tipo, se valida con Zod en `infrastructure/`.
- **`type` para datos y `interface` para puertos.** Imports de tipos con `import type`.
- **Exports con nombre**, salvo lo que Next.js exige como `default` (`page.tsx`, `layout.tsx`).
- **Dinero:** enteros en COP (`priceCop: number`), formateados solo al mostrarlos con `formatCop()` (`Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })`). Nunca se hacen cuentas de precios en el front: el total lo da la API.
- **Fechas:** la API envía ISO en UTC; se muestran con `Intl.DateTimeFormat("es-CO")`. Los cálculos de "días restantes" vienen de la API.
- **Comentarios:** explican el *porqué*. Los puertos y casos de uso llevan una línea de documentación.
- **Mensajes de error:** `src/shared/lib/error-messages.ts` traduce los `code` de la API (`INVALID_CODE`, `NO_ACCESS`…) a textos en español. Los componentes nunca muestran el `message` crudo del servidor.

---

## 8. UI, diseño y accesibilidad

### 8.1 Tokens de marca (planeación §3.11)
```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-negro: #0b0b0b;
  --color-blanco: #ffffff;
  --color-humo: #f5f5f5;
  --color-rojo: #e10600;
  --color-gris: #8a8a8a;
  --font-display: var(--font-bebas-neue);
  --font-sans: var(--font-inter);
}

/* shadcn apunta a los tokens de marca */
:root {
  --primary: var(--color-rojo);
  --background: var(--color-blanco);
  --foreground: var(--color-negro);
}
```
- Las fuentes se cargan con `next/font/google` (Bebas Neue para títulos, Inter para textos). Nada de `<link>` a Google Fonts.
- **Rojo solo para lo que vende:** botones de compra, precios y destacados. Si todo es rojo, nada destaca.
- No se escriben colores sueltos (`text-[#E10600]`): siempre el token (`text-rojo`).

> **Ajuste aplicado al crear `docs/webSite/design-system.md`:** `--primary` de shadcn **no es el rojo**, es negro/blanco (según el tema claro u oscuro de cada área) — si `--primary` fuera rojo, todos los controles de shadcn (botones por defecto, focus rings, switches) saldrían rojos, y el rojo deja de significar "esto vende". El rojo vive en un token propio, `--cta`, que solo usan los componentes de compra. También se agregan `--acero` (`#6B6B6B`, texto secundario sobre fondo claro) y `--rojo-vivo` (`#FF3B30`, texto en rojo sobre fondo oscuro), porque el gris y el rojo de la paleta original no pasaban el contraste mínimo (4.5:1) en esas combinaciones. El detalle completo, con la tabla de contraste y los temas por área, está en `docs/webSite/design-system.md`.

### 8.2 Componentes
- shadcn se instala con su CLI en `src/shared/ui/` (configurado en `components.json`). Se pueden ajustar, pero **no reciben lógica de negocio**.
- Los componentes de una feature se componen a partir de `shared/ui`; si un componente se repite en tres features, se sube a `shared/ui`.

### 8.3 Responsive y rendimiento
- **Mobile-first:** se escribe la clase base para celular y luego `md:` y `lg:`. Se revisa en 360 px, 768 px y 1280 px.
- Imágenes siempre con `next/image`, con `sizes` y `priority` solo en el hero.
- Presupuesto en la landing (Lighthouse en celular): **LCP < 2,5 s**, **CLS < 0,1**. El video del hero es corto, sin sonido, con `poster` y `preload="none"` en conexiones lentas.

> **Ajuste aplicado en TF-13 (cómo se mide y qué movió el LCP):**
> - Se mide contra `next build` + `next start`, nunca contra `next dev`. `next start` sirve HTTP/1.1 y Lighthouse (simulación Lantern) lo modela como 6 conexiones con arranque lento, lo que infla el LCP ~0,6–1 s frente a producción (HTTP/2). Para una cifra comparable se mide detrás de un proxy HTTP/2 local; la cifra con `--throttling-method=devtools` sirve de contraste.
> - `experimental.optimizePackageImports: ["radix-ui"]` en `next.config.ts`: shadcn importa los primitivos desde el paquete `radix-ui` y, sin esto, la landing cargaba todos (First Load JS 205 kB → 135 kB).
> - El `<Image>` del hero lleva `fetchPriority="high"` además de `priority`: en Next 15 `priority` precarga la imagen pero no le da prioridad alta.
> - Mientras no haya video de Sam, el hero es solo la foto (el LCP); el video, cuando llegue, va con la foto como `poster`.

### 8.4 Accesibilidad mínima
- Todo control tiene `label` visible o `aria-label`. Los errores van con `role="alert"`.
- Contraste AA (texto gris sobre negro: revisar).
- Navegable con teclado: los componentes Radix ya lo resuelven; no se reemplazan por `div` con `onClick`.
- Las pruebas buscan por rol y texto (`getByRole`, `getByLabelText`), lo que de paso obliga a que esto se cumpla.

---

## 9. Reglas específicas de Nexora Fit

### 9.1 Sesión y datos sensibles
- El front **nunca** guarda códigos, tokens ni datos del alumno en `localStorage` o `sessionStorage`. La sesión es una cookie `httpOnly` que JavaScript no puede leer.
- El código de acceso se muestra solo en `/pago/resultado` (cuando la API lo devuelve) y nunca se registra en consola, en Sentry ni en analítica.
- Las respuestas del cuestionario (lesiones, edad) son datos de salud: no van a analítica ni a logs.
- Un 401 en cualquier llamada privada → el hook limpia la caché de TanStack Query y redirige a `/acceder`.

### 9.2 Checkout y Wompi
- El Widget se carga con `next/script` (`strategy="lazyOnload"`) **solo** en `/checkout/[producto]`, a través del adaptador `WompiPaymentWidget` (puerto `PaymentWidget`). Ningún componente toca `window.WidgetCheckout`.
- Los parámetros del Widget (incluida la firma) **vienen de la API** (`POST /orders`). El front no calcula firmas ni montos.
- `/pago/resultado` usa `useQuery` con `refetchInterval: 3000` hasta un estado final (`isTerminal(status)` en el dominio), con un tope de 5 minutos. Después muestra *"Te enviaremos el código a tu correo apenas se apruebe"*.

### 9.3 Turnstile
Se usa en `/orders`, `/access/recover`, el login de admin y en `/access/redeem` cuando la API responde `CAPTCHA_REQUIRED`. Va detrás del puerto `CaptchaProvider`, y en pruebas se usa un fake que siempre devuelve un token.

### 9.4 Reproductor de video (`features/player`)
- Cada reproducción pide `GET /videos/{id}/playback`; las URLs vencen, así que **no se cachean más de 30 min** en TanStack Query (`staleTime`).
- HLS con `hls.js` (o nativo en Safari) a través del adaptador; el componente recibe `sources[]` sin saber si viene de Bunny o de R2.
- **Marca de agua:** `watermark` (el correo) se dibuja encima del `<video>` con CSS, semitransparente, y cambia de posición cada 30 s.
- `controlsList="nodownload"` y `onContextMenu` bloqueado. Es una barrera blanda, como dice la planeación (§7.7).

### 9.5 SEO y confidencialidad
- `metadata` y `generateMetadata` en cada página pública, con Open Graph para que el link de Instagram se vea bien.
- **Hasta el lanzamiento, `robots.ts` devuelve `noindex` en todos los entornos.** En producción se activa la indexación con la variable `NEXT_PUBLIC_INDEXABLE=true` el día del lanzamiento.

### 9.6 Variables de entorno
```bash
# .env.example
API_URL=http://localhost:8000                       # solo servidor (proxy y Server Components)
MEDIA_HOST=img.nexorafit.com                        # bucket público de imágenes
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA   # llave de prueba de Cloudflare
NEXT_PUBLIC_INDEXABLE=false
```
- Se validan con Zod al arrancar (`src/shared/infrastructure/env.ts`); si falta una, el build falla.
- **Solo lo que empieza con `NEXT_PUBLIC_` llega al navegador**, y ahí nunca va un secreto. La llave pública de Wompi la entrega la API en los parámetros del Widget.

---

## 10. pre-commit y tareas (SIEMPRE)

### 10.1 pre-commit
Se usa la misma herramienta del back (el framework `pre-commit`), para que haya una sola forma de instalar hooks en todos los repos.

```yaml
# .pre-commit-config.yaml
default_install_hook_types: [pre-commit, commit-msg]

repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks:
      - id: trailing-whitespace
        args: [--markdown-linebreak-ext=md]
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-merge-conflict
      - id: check-added-large-files
        args: [--maxkb=1000]
      - id: detect-private-key
      - id: mixed-line-ending

  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.24.2
    hooks:
      - id: gitleaks

  - repo: local
    hooks:
      - id: eslint
        name: eslint (estilo + arquitectura limpia)
        entry: npx eslint --fix --max-warnings=0
        language: system
        files: \.(ts|tsx|js|mjs)$
        exclude: ^src/shared/infrastructure/api/schema\.d\.ts$
      - id: prettier
        name: prettier
        entry: npx prettier --write --ignore-unknown
        language: system
        types: [text]
        exclude: ^src/shared/infrastructure/api/schema\.d\.ts$
      - id: tsc
        name: tipos (tsc)
        entry: npx tsc --noEmit
        language: system
        files: \.(ts|tsx)$
        pass_filenames: false
      - id: commitizen
        name: mensaje de commit (Conventional Commits)
        entry: uvx --from commitizen cz check --allow-abort --commit-msg-file
        language: system
        stages: [commit-msg]
```
Las reglas son las de la guía del back (§7): `autoupdate` mensual, `--no-verify` prohibido salvo emergencia y la CI vuelve a correr todo. Las pruebas no van en pre-commit.

### 10.2 Makefile: la única interfaz de tareas
```makefile
# Makefile
.PHONY: setup dev lint format typecheck test check build openapi
OPENAPI_URL ?= http://localhost:8000/openapi.json

setup:            ## Instala dependencias y hooks
	npm ci
	uvx pre-commit install

dev:              ## Front con recarga (la API debe estar arriba: `make dev` en el back)
	npm run dev

lint:             ## ESLint (incluye capas) + Prettier
	npx eslint . --max-warnings=0
	npx prettier --check .

format:           ## Formatea todo
	npx eslint . --fix
	npx prettier --write .

typecheck:        ## tsc
	npx tsc --noEmit

test:             ## Pruebas (usa ARGS="-t nombre" para filtrar)
	npx jest $(ARGS)

build:            ## Build de producción
	npm run build

check: lint typecheck test build   ## Lo que debe pasar antes de un PR

openapi:          ## Regenera los tipos de la API (OPENAPI_URL=... para apuntar a dev)
	npx openapi-typescript $(OPENAPI_URL) -o src/shared/infrastructure/api/schema.d.ts
```

**`make check` en verde es la definición mínima de "listo"**, igual que en el back.

---

## 11. Pruebas

### 11.1 Filosofía
Igual que en el back: **pocas pruebas, en el lugar correcto**. El dominio y los casos de uso se prueban en milisegundos sin navegador ni red; los componentes se prueban como los usa una persona.

### 11.2 Qué se prueba en cada capa

| Capa | Tipo de prueba | Cómo | Cantidad |
|---|---|---|---|
| `domain/` | Unitaria pura | Llamar funciones. Sin mocks. | Todas las reglas (normalizar código, estados finales, formato de precio) |
| `application/` | Caso de uso con *fakes* | Puertos en memoria de `test/fakes/` | Cada caso de uso: camino feliz y errores principales |
| `ui/` | Componente con RTL | `renderWithContainer(<Comp />, fakes)` + `user-event` | Flujos críticos: código, checkout, resultado del pago, reproductor, editor de días |
| `infrastructure/` | Contrato | Que el mapeo DTO → dominio sea correcto, con un ejemplo de respuesta real de la API | Solo los mapeos no triviales |
| `src/app/` | — | Solo compone; no se prueba | — |
| End-to-end | Verificación guiada por IA | §11.5 | No se automatiza en el repo (Playwright, si algún día hace falta, va en un ADR) |

### 11.3 Fakes en lugar de mocks
```ts
// test/fakes/access.ts
import type { AccessRepository, RedeemResult } from "@/features/access/application/ports";

export class FakeAccessRepository implements AccessRepository {
  readonly redeemed: string[] = [];

  constructor(private readonly failWith?: Error) {}

  async redeem(code: string): Promise<RedeemResult> {
    if (this.failWith) throw this.failWith;
    this.redeemed.push(code);
    return { studentName: "Laura", replacedOldestDevice: false };
  }
}
```
```ts
// src/features/access/application/use-cases/redeem-code.test.ts
import { FakeAccessRepository } from "@/test/fakes/access";

import { InvalidAccessCodeFormatError } from "../../domain/access-code";
import { redeemCode } from "./redeem-code";

it("normaliza el código antes de enviarlo", async () => {
  const repo = new FakeAccessRepository();

  await redeemCode(repo, { rawCode: "nxf 7kq4-p9dm" });

  expect(repo.redeemed).toEqual(["NXF-7KQ4-P9DM"]);
});

it("no gasta un intento si el formato es inválido", async () => {
  const repo = new FakeAccessRepository();

  await expect(redeemCode(repo, { rawCode: "hola" })).rejects.toThrow(InvalidAccessCodeFormatError);
  expect(repo.redeemed).toEqual([]);
});
```
```tsx
// src/features/access/ui/redeem-form.test.tsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppError } from "@/shared/domain/errors";
import { FakeAccessRepository } from "@/test/fakes/access";
import { renderWithContainer } from "@/test/render";

import { RedeemForm } from "./redeem-form";

it("muestra el error cuando el código no existe", async () => {
  const access = new FakeAccessRepository(new AppError("INVALID_CODE", 401));
  renderWithContainer(<RedeemForm />, { access });

  await userEvent.type(screen.getByLabelText("Código de acceso"), "NXF-7KQ4-P9DM");
  await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

  expect(await screen.findByRole("alert")).toHaveTextContent("Ese código no existe");
});
```
- Los fakes se escriben **una vez por puerto** y se reutilizan.
- `renderWithContainer` completa con fakes vacíos los puertos que la prueba no pasa.
- Los mocks (`jest.mock`) solo se usan para lo que es del framework: `next/navigation` en `test/setup.ts`.
- Los nombres de las pruebas dicen la regla en español.

### 11.4 Configuración
```ts
// jest.config.ts
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

export default createJestConfig({
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  moduleNameMapper: { "^@/test/(.*)$": "<rootDir>/test/$1", "^@/(.*)$": "<rootDir>/src/$1" },
});
```

### 11.5 Verificación ejecutada por la IA (no se versiona)
Igual que la guía del back (§9.4), adaptada al front:
1. Levanta el back (`make db migrate api` en `nexorafit-back`) y el front (`make dev`).
2. Recorre el flujo afectado en el navegador (Claude in Chrome o el navegador integrado) **en 360 px y en escritorio**. Para pagos usa el sandbox de Wompi.
3. Los scripts auxiliares van en su scratchpad, fuera del repo.
4. Deja en el PR, sección "Cómo se verificó", qué recorrió y capturas en celular y escritorio.

### 11.6 Lo que NO se sube
Lo mismo que en el back (§9.5), más: carpetas `coverage/`, `.next/`, `storybook-static/`, capturas sueltas, `*.har` y JSON de respuestas copiadas "para probar". Todo va en `.gitignore`.

---

## 12. Ramas, commits, issues y PRs

**Aplica tal cual la guía del back:** §10 (ramas `main`/`develop`, Conventional Commits en español, SemVer con `cz bump`), §11 (issues, etiquetas y tablero) y §12 (PRs, plantilla, *squash merge* y `/code-review`).

Diferencias por tener dos repos:
- **Alcances de commit** del front: `catalogo`, `checkout`, `acceso`, `alumno`, `reproductor`, `admin`, `ui`, `infra`, `deps`, `api` (cuando solo se regeneran tipos).
- **Cambios que tocan los dos repos:** primero se fusiona el PR del back, se despliega en dev y después el PR del front con `make openapi` apuntando a dev. Cada PR enlaza al otro. Un `BREAKING CHANGE` en la API exige el PR del front listo antes de desplegar.
- `schema.d.ts` **se versiona**: el build no depende de que la API esté arriba, y el diff del PR muestra exactamente qué cambió del contrato.
- La plantilla de PR del front agrega **capturas en celular y escritorio** como obligatorias si cambia la UI.
- Las etiquetas de área del tablero compartido incluyen `area:web`.

---

## 13. CI/CD y entornos

### 13.1 CI (GitHub Actions, `.github/workflows/ci.yml`)
En cada PR y en cada push a `develop` o `main`:
1. `npm ci`.
2. `pre-commit run --all-files`: formato, ESLint (incluye capas), tipos, secretos y mensajes de commit.
3. `npx jest --ci`.
4. `npm run build` con variables de entorno ficticias.

### 13.2 Entornos
| Entorno | Rama | Dónde | API (`API_URL`) |
|---|---|---|---|
| Local | cualquiera | `make dev` (puerto 3000) | `http://localhost:8000` |
| Dev | `develop` | Render, servicio web Node (`*-dev`) | API dev en Render |
| Prod | `main` | Render, servicio web Node (`*-prod`) | API prod en Render |

- Render ejecuta `npm ci && npm run build` y arranca con `npm start`. Las variables se guardan **solo en el panel de Render** (`sync: false` en `render.yaml`).
- Gracias al proxy (§5.4), dev funciona sobre `*.onrender.com` sin configurar dominios.

---

## 14. Trabajo con IA

### 14.1 `CLAUDE.md` en la raíz
Menos de 150 líneas, enlaza a esta guía y no la copia:
```markdown
# Nexora Fit — frontend
Next.js 15 (App Router) para la plataforma de planes de entrenamiento. Planeación en docs/planeacion.
API: repo nexorafit-back, contrato en docs/planeacion/endpoints-api.md del back.

## Reglas
- Arquitectura limpia por features: guia-desarrollo-front.md §2. ESLint (boundaries) lo valida.
- La UI nunca importa infrastructure/ ni axios. Los tipos de schema.d.ts solo en infrastructure/.
- Sin Route Handlers ni Server Actions con lógica: el único backend es FastAPI.
- Verificar SIEMPRE con `make check` y en el navegador a 360 px antes de dar algo por terminado.
- No crear scripts de prueba en el repo; la evidencia va en el PR.
- Commits Conventional en español. 1 issue → 1 rama → 1 PR.

## Comandos
make setup | make dev | make test ARGS="-t x" | make check | make openapi

## Mapa
src/app        rutas (solo composición)
src/features   catalog, checkout, access, student, player, admin/* (domain/application/infrastructure/ui)
src/shared     domain, infrastructure (http, schema generado, env), ui (shadcn), lib
src/core       composition root y providers
test/          fakes, render y setup de Jest
```

### 14.2 Flujo de una tarea con IA
El de la guía del back (§14.2), con el orden de §2.6 de esta guía (dominio → puerto → caso de uso → adaptador → hook/componente → `core` → página) y la verificación de §11.5.

### 14.3 Qué decide siempre una persona
- Fusionar a `main` y activar la indexación (`NEXT_PUBLIC_INDEXABLE=true`).
- Agregar dependencias de la lista de §4 que exigen ADR.
- Cambios visuales grandes en la landing: los aprueba Sam con capturas.

---

## 15. Otras prácticas

### 15.1 Manejo de errores
- `src/app/error.tsx` y `not-found.tsx` con el diseño de la marca.
- Las mutaciones muestran el error junto al formulario; las consultas, un estado vacío con "Reintentar".
- Sentry (plan gratis) captura errores no controlados en dev y prod, **sin** datos de formularios ni respuestas de la API.

### 15.2 Estados de carga
Cada pantalla con datos tiene tres estados: cargando (esqueleto con la forma del contenido, no un spinner a pantalla completa), vacío y error. Las páginas públicas no tienen estado de carga porque llegan renderizadas del servidor.

### 15.3 Decisiones de arquitectura (ADR)
En `docs/adr/NNNN-titulo.md`, con el formato de la guía del back (§15.4). Primeros ADR del front:
- `0001` Next.js 15 (App Router) en lugar de Vite + React Router
- `0002` Arquitectura limpia por features y reglas de ESLint
- `0003` Proxy `/api/v1` en Next.js para las cookies de sesión
- `0004` Fakes por puerto en lugar de MSW

### 15.4 Dependencias
`package-lock.json` versionado, Dependabot semanal agrupado para npm y GitHub Actions. Antes de agregar una dependencia: ¿lo resuelve la plataforma (`Intl`, `URL`, `<dialog>`) o algo que ya está?

### 15.5 Definición de "Hecho"
Un issue está **Hecho** cuando:
- [ ] Cumple todos los criterios de aceptación.
- [ ] `make check` está en verde y la CI también.
- [ ] Respeta las capas (ESLint sin errores de `boundaries`).
- [ ] Tiene pruebas del dominio, del caso de uso o del componente si agrega o cambia comportamiento.
- [ ] Está verificado en el navegador en celular y escritorio, con capturas en el PR.
- [ ] Si cambió el contrato, `schema.d.ts` está regenerado y el PR del back está enlazado.
- [ ] Está fusionado en `develop` y desplegado en dev.

---

## 16. Checklist para arrancar el repo

- [ ] `npx create-next-app@15` con TypeScript, ESLint, Tailwind, App Router, carpeta `src/` y alias `@/*`.
- [ ] `.nvmrc` (Node 24), `tsconfig` estricto (§7), Prettier con el plugin de Tailwind.
- [ ] shadcn (`npx shadcn@latest init`) apuntando a `src/shared/ui`, y tokens de marca (§8.1).
- [ ] Axios, TanStack Query, React Hook Form, Zod, openapi-typescript, hls.js.
- [ ] Jest + RTL + `user-event` + `jest-dom` (§11.4), `test/fakes`, `test/render.tsx`.
- [ ] `eslint-plugin-boundaries` + `eslint-import-resolver-typescript` con las reglas de §2.5.
- [ ] Estructura de §6: `features/`, `shared/`, `core/`, proxy en `next.config.ts`, `middleware.ts`.
- [ ] `.pre-commit-config.yaml` (§10.1), `.cz.toml`, `Makefile` (§10.2); correr `make setup`.
- [ ] `CLAUDE.md` (§14.1), plantillas de issues y PR, `ci.yml`, `render.yaml`, `.env.example`, `.gitignore`.
- [ ] ADR `0001` a `0004`.
- [ ] Mover esta guía a `docs/guia-desarrollo-front.md` y actualizar el enlace en `CLAUDE.md`.
- [ ] Primer PR: "chore: esqueleto del proyecto" con una página que llame a `GET /health` a través del proxy y su prueba, para confirmar que toda la cadena funciona (hooks, CI y despliegue en dev).
