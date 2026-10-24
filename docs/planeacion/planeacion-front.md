# Planeación: frontend

- **Versión:** 1.0 (borrador)
- **Fecha:** 2026-10-23
- **Base:** planeación de la página web y contrato de la API (repo `nexorafit-back`, `docs/planeacion/`), y [guía de desarrollo del front](../../guia-desarrollo-front.md)
- **Seguimiento:** Notion → *NexoraFit · Front* (historias `HUF-n` y tareas `TF-n`). Las historias del back son `HUB-n`.

> ⚠️ **Confidencial.** Mismas reglas que la planeación.

---

## Índice
1. [Qué construye el front](#1-qué-construye-el-front)
2. [Mapa de rutas](#2-mapa-de-rutas)
3. [Features: qué hay en cada una](#3-features-qué-hay-en-cada-una)
4. [Dependencias](#4-dependencias)
5. [Servicios externos que toca el front](#5-servicios-externos-que-toca-el-front)
6. [Datos en el cliente: caché de TanStack Query](#6-datos-en-el-cliente-caché-de-tanstack-query)
7. [Mensajes de error](#7-mensajes-de-error)
8. [Contenido que debe entregar Sam](#8-contenido-que-debe-entregar-sam)
9. [Orden de ejecución](#9-orden-de-ejecución)
10. [Ajustes a la guía y decisiones abiertas](#10-ajustes-a-la-guía-y-decisiones-abiertas)

---

## 1. Qué construye el front

Tres áreas dentro de una sola app de Next.js 15:

| Área | Para quién | Objetivo | Render |
|---|---|---|---|
| **Sitio público** | Visitantes que llegan desde Instagram | Vender: landing, deportes, pack, acceso directo, checkout | Server Components + ISR (SEO y velocidad en celular) |
| **Área del alumno** | Quien ya pagó | Entrenar: planes, rutinas día a día, videos, progreso | Client Components con TanStack Query |
| **Panel de admin** | Alex y Sam | Operar: videos, rutinas, precios, alumnos, ventas | Client Components; **todo debe funcionar en el celular de Sam** |

Lo que **no** hace el front: calcular precios, firmas, accesos ni vencimientos. Todo eso lo responde la API (guía front §1).

---

## 2. Mapa de rutas

Prefijo de la API omitido (`/api/v1`, a través del proxy de Next.js).

### 2.1 Sitio público
| Ruta | Feature | Render | Endpoints | Historia |
|---|---|---|---|---|
| `/` | catalog | Server, ISR 300 s | `GET /catalog` | HUF-3 |
| `/planes/[deporte]` | catalog, player | Server, SSG de los 4 + ISR | `GET /plans/{slug}` · `GET /videos/{id}/playback` (muestra, en el cliente) | HUF-4, HUF-12 |
| `/pack-completo` | catalog | Server, ISR | `GET /catalog` | HUF-4 |
| `/acceso-directo` | catalog | Server, ISR | `GET /catalog` | HUF-4 |
| `/checkout/[producto]` | checkout | Server (shell) + Client | `GET /products/{slug}` · `POST /orders` | HUF-6, HUF-23 |
| `/pago/resultado` | checkout | Client | `GET /checkout/order` · `POST /checkout/session` | HUF-7 |
| `/acceder` (`?token=`) | access | Client | `POST /access/redeem` · `/access/recover` · `/access/magic-link` | HUF-8, HUF-9 |
| `/terminos` · `/privacidad` · `/reembolsos` · `/aviso-salud` | — | Estático | — | HUF-5 |

### 2.2 Área del alumno (requiere `nxf_session`)
| Ruta | Feature | Endpoints | Historia |
|---|---|---|---|
| layout `(student)` | access, student | `GET /me` · `POST /me/logout` · `POST /me/sessions/revoke-others` | HUF-10 |
| `/mis-planes` | student | `GET /me/overview` | HUF-11, HUF-23 |
| `/mis-planes/[plan]` | student, player | `GET /me/plans/{slug}` · `GET …/levels/{level}` · `PUT/DELETE /me/progress/{day_id}` · `GET /videos/{id}/playback` | HUF-13 |
| `/mis-planes/[plan]/tecnicas` | student, player | `GET …/techniques` · playback | HUF-14 |
| `/mis-planes/cuestionario` | student | `GET/PUT /me/questionnaire` · `GET /me/direct-access` | HUF-20 |

### 2.3 Panel de admin (requiere `nxf_admin`)
| Ruta | Feature | Endpoints | Historia |
|---|---|---|---|
| `/admin/login` (`?token=`) | admin/auth | `POST /admin/auth/login` · `verify-link` · `verify-otp` | HUF-15 |
| layout `admin` | admin/auth | `GET /admin/me` · `POST /admin/auth/logout` | HUF-15 |
| `/admin` | admin/dashboard | `GET /admin/dashboard` | HUF-24 |
| `/admin/videos` · `/admin/videos/[id]` | admin/videos | `GET/POST /admin/videos` · `next-id` · `GET/PATCH/DELETE /admin/videos/{id}` · `upload` · `upload/complete` · `GET /admin/sports` · categorías | HUF-16 |
| `/admin/planes` · `/admin/planes/[id]` | admin/plans-editor | `GET /admin/plans` · `GET/PATCH /admin/plans/{id}` · levels · weeks · days · `PUT /admin/days/{id}/content` · `extra-videos` · `POST /admin/routines/parse` | HUF-17, HUF-19 |
| `/admin/productos` | admin/products | `GET /admin/products` · `PATCH /admin/products/{id}` | HUF-18 |
| `/admin/personalizados` · `/[id]` | admin/custom-plans | `GET/POST /admin/custom-plans` · `GET …/{id}` · `POST …/payment-link` · `GET /admin/keys` (buscador) | HUF-21 |
| `/admin/acceso-directo` | admin/direct-access | `GET /admin/direct-access` | HUF-22 |
| `/admin/ordenes` · `/[id]` | admin/orders | `GET /admin/orders` · `GET …/{id}` · `POST …/void` · `POST …/reconcile` | HUF-25 |
| `/admin/alumnos` · `/[id]` | admin/keys | `/admin/keys/*` · `PATCH /admin/entitlements/{id}` | HUF-26 |

**Cobertura:** las 76 rutas del contrato de la API tienen pantalla, salvo `/health` (solo en el esqueleto), los dos webhooks y las tareas programadas, que no son del front.

---

## 3. Features: qué hay en cada una

Cada feature sigue `domain → application → infrastructure → ui` (guía front §2). Las tablas listan lo que se construye; los nombres son los que se usarán en el código.

### 3.1 `catalog`
| Capa | Contenido |
|---|---|
| domain | `Catalog`, `PlanSummary`, `PublicPlan`, `LevelSummary`, `SyllabusGroup`, `SampleDay` |
| application | Puerto `CatalogRepository { getCatalog(); getPlan(slug) }` (solo lecturas, sin casos de uso) |
| infrastructure | `HttpCatalogRepository` |
| ui | `Hero`, `About`, `HowItWorks`, `SportCards`, `PackBanner`, `Includes`, `DirectAccessCta`, `Faq`, `PlanHeader`, `LevelCards`, `Syllabus`, `SampleDayPreview`, `EquipmentList`, `BuyBar` |

### 3.2 `checkout`
| Capa | Contenido |
|---|---|
| domain | `Quote`, `OrderStatus`, `isTerminal(status)`, `CheckoutResult` (código, `newKey`, `canStartSession`) |
| application | Puertos `CheckoutRepository { quote; createOrder; getCurrentOrder; startSession }` y `PaymentWidget { open(params) }`. Caso de uso `startCheckout` (crea la orden → abre el Widget → devuelve a dónde ir) |
| infrastructure | `HttpCheckoutRepository`, `WompiPaymentWidget` (carga `widget.js` con `next/script` solo en esta ruta) |
| ui | `CheckoutForm` (RHF + Zod), `OrderSummary`, `PaymentResult`, `AccessCodeCard` (copiar) |

### 3.3 `access`
| Capa | Contenido |
|---|---|
| domain | `normalizeAccessCode`, `InvalidAccessCodeFormatError` |
| application | Puerto `AccessRepository { redeem; recover; redeemMagicLink; me; logout; revokeOthers }`. Casos de uso `redeemCode`, `recoverAccess` |
| infrastructure | `HttpAccessRepository` |
| ui | `RedeemForm`, `RecoverForm`, `MagicLinkHandler`, `SessionMenu` |

### 3.4 `student`
| Capa | Contenido |
|---|---|
| domain | `Overview`, `OwnedPlan`, `LockedPlan`, `CustomPlan`, `DirectAccessStatus`, `PlanLevel` → `Week` → `Day` → `Block` → `Exercise`, `Questionnaire` |
| application | Puerto `StudentRepository { overview; plan; level; techniques; markDay; unmarkDay; directAccess; getQuestionnaire; saveQuestionnaire }`. Caso de uso `submitQuestionnaire` |
| infrastructure | `HttpStudentRepository` |
| ui | `PlanCard`, `LockedPlanCard`, `CustomPlanBanner`, `DirectAccessCard`, `UpgradeCard`, `LevelTabs`, `WeekAccordion`, `DayRoutine`, `ExerciseRow`, `TechniquesGrid`, `QuestionnaireForm` |

### 3.5 `player`
| Capa | Contenido |
|---|---|
| domain | `Playback`, `watermarkPosition(tick)` (regla pura de dónde va la marca cada 30 s) |
| application | Puertos `PlaybackRepository { get(videoId) }` y `MediaEngine { attach(video, sources); detach() }` |
| infrastructure | `HttpPlaybackRepository`, `HlsMediaEngine` (hls.js o HLS nativo en Safari) |
| ui | `VideoPlayer`, `Watermark`, `VideoModal` |

### 3.6 `admin/*`
| Feature | domain / application | infrastructure | ui |
|---|---|---|---|
| `admin/auth` | `requestLogin`, `verifyLink`, `verifyOtp` | `HttpAdminAuthRepository` | `LoginForm`, `OtpForm`, `AdminShell` (navegación móvil) |
| `admin/dashboard` | `SalesSummary` | `HttpDashboardRepository` | `KpiTiles`, `RecentPayments` |
| `admin/orders` | `OrderFilters`, `voidOrder` | `HttpAdminOrdersRepository` | `OrdersTable`, `OrderDetail`, `VoidDialog` |
| `admin/keys` | `KeyDetail`, acciones de soporte | `HttpKeysRepository` | `KeySearch`, `KeyDetail`, `SupportActions` |
| `admin/direct-access` | `DirectAccessRow` | `HttpDirectAccessRepository` | `DirectAccessList` |
| `admin/custom-plans` | `createCustomPlan` | `HttpCustomPlansRepository` | `CustomPlanForm`, `CopyLinkButton`, `CustomPlansList` |
| `admin/videos` | `VideoDraft`, validación del ID; puerto `VideoUploader { upload(file, instructions, onProgress) }` | `HttpVideosRepository`, `TusVideoUploader` (tus-js-client) | `VideosTable`, `VideoForm`, `CategoryManager`, `UploadProgress` |
| `admin/plans-editor` | **Modelo de edición del día** (agregar, mover arriba/abajo, borrar bloques y ejercicios; validación antes de guardar) — es la mayor lógica de cliente del proyecto | `HttpPlansEditorRepository` | `PlanTree`, `DayEditor`, `ExerciseEditor`, `VideoPicker`, `ImportRoutineDialog`, `PlanPublicForm` |
| `admin/products` | `Product` | `HttpProductsRepository` | `ProductsTable`, `ProductForm` |

### 3.7 `shared` y `core`
| Lugar | Contenido |
|---|---|
| `shared/domain` | `AppError`, tipos de dinero y fechas, **puerto compartido `CaptchaProvider`** (§10) |
| `shared/infrastructure` | `http/client.ts` (Axios), `api/schema.d.ts` (generado), `env.ts`, `TurnstileCaptchaProvider` |
| `shared/ui` | componentes de shadcn (§4.2), `Captcha`, `Skeleton`, `EmptyState`, `ErrorState`, `Header`, `Footer` |
| `shared/lib` | `cn`, `formatCop`, `formatDate`, `error-messages.ts` |
| `core` | `container.ts`, `server-container.ts`, `providers.tsx` (QueryClient con manejo global de 401), `use-container.ts` |

---

## 4. Dependencias

Las versiones exactas quedan fijadas en `package-lock.json` al crear el proyecto.

### 4.1 Producción
| Paquete | Línea | Para qué |
|---|---|---|
| `next` | 15 | App Router, ISR, `next/image`, `next/font`, `next/script`, proxy |
| `react`, `react-dom` | 19 | — |
| `@tanstack/react-query` | 5 | Datos del servidor en el cliente |
| `axios` | 1 | Cliente HTTP (solo en `infrastructure/`) |
| `react-hook-form` + `@hookform/resolvers` | 7 / 5 | Formularios |
| `zod` | 4 | Validación de formularios y de `env` |
| `tailwindcss` | 4 | Estilos |
| shadcn/ui (Radix) + `lucide-react` | — | Componentes e íconos |
| `hls.js` | 1 | Reproducción HLS de Bunny fuera de Safari |
| `tus-js-client` | 4 | Subida reanudable de videos a Bunny desde el panel |
| `@sentry/nextjs` | — | Errores en dev y prod |

**No se agregan:** librería de drag and drop (el editor usa botones ↑↓, más fáciles en celular), librería de Turnstile (el adaptador carga el script), librería de fechas (`Intl` basta) ni zustand por ahora (no hay estado global).

### 4.2 Componentes de shadcn
`button`, `input`, `textarea`, `label`, `checkbox`, `select`, `radio-group`, `form`, `card`, `badge`, `accordion`, `tabs`, `dialog`, `alert-dialog`, `sheet` (menú móvil y panel), `dropdown-menu`, `table`, `skeleton`, `progress`, `command` (buscador de videos y alumnos), `sonner` (avisos), `separator`.

### 4.3 Desarrollo
`typescript` 5.9, `eslint` 9 + `typescript-eslint` + `eslint-config-next` + `eslint-plugin-boundaries` + `eslint-import-resolver-typescript`, `prettier` + `prettier-plugin-tailwindcss`, `jest` + `jest-environment-jsdom` + `@testing-library/react` + `@testing-library/user-event` + `@testing-library/jest-dom`, `openapi-typescript`. Fuera de npm: `pre-commit` y `commitizen` vía `uvx`.

---

## 5. Servicios externos que toca el front

| Servicio | Dónde | Cómo | Adaptador |
|---|---|---|---|
| **API de Nexora** | Todo | Proxy `/api/v1` (guía front §5.4) | `http/client.ts` + repositorios |
| **Wompi Widget** | `/checkout/[producto]` | `https://checkout.wompi.co/widget.js`, parámetros firmados por la API | `WompiPaymentWidget` |
| **Cloudflare Turnstile** | Checkout, recuperar acceso, código tras fallos, login admin | Script de Turnstile + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `TurnstileCaptchaProvider` |
| **Bunny Stream (reproducción)** | Reproductor | URL HLS firmada que entrega `playback` | `HlsMediaEngine` |
| **Bunny Stream (subida)** | Panel → videos | TUS con la firma que entrega `upload` | `TusVideoUploader` |
| **R2 público** | Fotos de la landing y de los planes | `next/image` con `MEDIA_HOST` | — |
| **WhatsApp** | Acceso directo | Enlace `wa.me` que entrega la API | — |
| **Sentry** | Todo | `@sentry/nextjs`, sin datos de formularios | — |

---

## 6. Datos en el cliente: caché de TanStack Query

| Query key | Origen | `staleTime` | Se invalida con |
|---|---|---|---|
| — (catálogo, planes públicos) | Server Components | ISR 300 s | — |
| `['quote', slug]` | `GET /products/{slug}` | 0 | — |
| `['checkout-order']` | `GET /checkout/order` | 0, `refetchInterval` 3 s hasta `isTerminal`, tope 5 min | — |
| `['me']` | `GET /me` | 5 min | logout, revoke-others |
| `['overview']` | `GET /me/overview` | 1 min | progreso, cuestionario, `checkout/session` |
| `['plan', slug]` / `['level', slug, level]` | `/me/plans/*` | 5 min | progreso (actualización optimista en `level`) |
| `['techniques', slug]` | `…/techniques` | 10 min | — |
| `['playback', videoId]` | `GET /videos/{id}/playback` | 30 min (`gcTime` 30 min); la URL vence a las 2 h | — |
| `['direct-access']` / `['questionnaire']` | `/me/direct-access` · `/me/questionnaire` | 1 min | enviar cuestionario |
| `['admin', <recurso>, filtros]` | Listas del panel | 30 s, `placeholderData: keepPreviousData` | la mutación del mismo recurso |
| `['admin', 'day', id]` | Contenido del día en el editor | `Infinity` mientras se edita | guardar el día |

**Reglas:**
- Un 401 en cualquier query del alumno → `queryClient.clear()` y redirección a `/acceder`. En el panel → `/admin/login`.
- Las mutaciones nunca reintentan solas (`retry: 0`); las queries reintentan una vez, salvo 4xx.

---

## 7. Mensajes de error

`shared/lib/error-messages.ts` traduce el `code` de la API (contrato §12). Los componentes nunca muestran el texto del servidor.

| `code` | Mensaje |
|---|---|
| `INVALID_CODE` | Ese código no existe. Revisa que esté bien escrito. |
| `INVALID_TOKEN` | El enlace venció o ya se usó. Pide uno nuevo. |
| `CAPTCHA_REQUIRED` | Confirma que no eres un robot para seguir. |
| `RATE_LIMITED` | Demasiados intentos. Espera unos minutos e inténtalo de nuevo. |
| `NO_ACCESS` | No tienes acceso a este plan. |
| `PRODUCT_UNAVAILABLE` | Este producto no está disponible en este momento. |
| `UNKNOWN_VIDEO_IDS` | Estos videos no existen en la biblioteca: {lista}. |
| `VIDEO_IN_USE` | Este video se usa en uno o más planes. Quítalo de ahí primero. |
| `INVALID_ORDER_STATE` | La orden ya cambió de estado. Recarga la página. |
| `VALIDATION_ERROR` | Revisa los campos marcados. |
| `NETWORK_ERROR` | Revisa tu conexión e intenta de nuevo. |
| `UNAUTHENTICATED` | (no se muestra: redirige al ingreso) |
| cualquier otro | Algo salió mal. Intenta de nuevo. |

---

## 8. Contenido que debe entregar Sam

El front avanza con contenido provisional; esto bloquea solo el lanzamiento.

| Contenido | Dónde se usa | Historia |
|---|---|---|
| Mínimo 8 fotos horizontales y verticales | Hero, bienvenida, tarjetas, páginas de deporte | HUF-3, HUF-4 |
| Video corto del hero (5–10 s, sin sonido) | Hero | HUF-3 |
| Texto "Sobre mí" y 3 datos (años, disciplinas, personas entrenadas) | Bienvenida | HUF-3 |
| Por deporte: para quién es, equipo, logro de cada nivel | Páginas de deporte | HUF-4 |
| Respuestas de las FAQ (duración del acceso, reembolsos, equipo) | FAQ | HUF-3 |
| Textos legales validados | Páginas legales | HUF-5 |
| Nombre de la marca y dominio | Todo | HUF-27 |

---

## 9. Orden de ejecución

Sigue el cronograma de la planeación (§14). Alex trabaja back y front, así que en cada bloque se hace primero la historia del back y después la del front que la consume.

| Bloque | Front | Back del que depende |
|---|---|---|
| **FDS 1–2 · Base** | HUF-1 Esqueleto → HUF-2 Diseño → HUF-3 Landing → HUF-4 Deporte, pack y acceso directo | HUB-1, HUB-2 |
| **FDS 3–4 · Pagos y acceso** | HUF-6 Pagar → HUF-7 Resultado → HUF-8 Código → HUF-9 Recuperar → HUF-10 Sesión | HUB-3 a HUB-9 |
| **FDS 5–6 · Contenido** | HUF-15 Login admin → HUF-16 Videos → HUF-17 Editor → HUF-18 Productos → HUF-11 Mis planes → HUF-12 Reproductor → HUF-13 Plan día a día → HUF-14 Técnicas | HUB-10 a HUB-16 |
| **FDS 7 · Carga** | HUF-19 Importar rutina (opcional, antes de transcribir) | HUB-17 |
| **FDS 8 · Acceso directo y personalizado** | HUF-20 Acceso directo → HUF-21 Personalizados → HUF-22 Lista de acceso directo → HUF-23 Mejora y renovación | HUB-18 a HUB-20 |
| **FDS 9 · Lanzamiento** | HUF-26 Alumnos → HUF-25 Órdenes → HUF-24 Dashboard → HUF-5 Legales y SEO → HUF-27 Lanzamiento | HUB-21 a HUB-25 |

- En el bloque de contenido, el **panel va antes que el área del alumno**: sin editor no hay rutinas que mostrar.
- Si una historia del back se atrasa, el front puede avanzar con los *fakes* de los puertos (son los mismos de las pruebas) y conectarse después cambiando solo `core/container.ts`.

---

## 10. Ajustes a la guía y decisiones abiertas

**Ajuste a la guía front (se aplica al crear el esqueleto):**
- **Puertos compartidos.** Turnstile lo usan `checkout`, `access` y `admin/auth`. Su puerto `CaptchaProvider` vive en `shared/domain/ports.ts` y su adaptador en `shared/infrastructure`, en vez de repetirlo en cada feature. Las reglas de ESLint de la guía ya lo permiten (`application` → `shared-domain`).

**Decisiones abiertas:**
| # | Pregunta | Propuesta |
|---|---|---|
| 1 | ¿Un "modo demo" (`NEXT_PUBLIC_API_MODE=fake`) que use los fakes con datos de ejemplo para mostrarle pantallas a Sam sin back? | Sí, pero solo en local; nunca en un build de dev o prod |
| 2 | ¿El editor de rutinas se usa también desde el celular? | Si |
| 3 | ¿Anclar el video de muestra en la página del deporte antes de que exista `playback` (fase 3)? | Mostrar el poster con "Disponible pronto" hasta la fase 3 |
