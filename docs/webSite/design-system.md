# Design system: frontend

- **Versión:** 1.0 (borrador)
- **Fecha:** 2026-10-24
- **Aplica a:** el repositorio `nexora-fit`: sitio público, área del alumno y panel de admin.
- **Para:** Alex, Santiago y los agentes de IA que construyan pantallas. También sirve de referencia para armar los estilos y componentes en Adobe XD (§14).
- **Base:** planeación de la página web (§3, §4, §6 y §10) y reunión del 2026-10-12, en el repo `nexorafit-back`; [planeación del front](../planeacion/planeacion-front.md) y [guía de desarrollo del front](../../guia-desarrollo-front.md) (§8).
- **Historia:** HUF-2 · Diseño. Al implementarla, los tokens de §3 a §8 pasan a `src/app/globals.css` y los componentes a `src/shared/ui/`.

> ⚠️ **Confidencial.** Mismas reglas que la planeación.

Las reglas marcadas con **SIEMPRE** no se negocian. El resto son valores por defecto: si el diseño de XD los cambia, se actualiza este documento en el mismo PR.

---

## Índice
1. [Principios](#1-principios)
2. [Temas por área](#2-temas-por-área)
3. [Color](#3-color)
4. [Tipografía](#4-tipografía)
5. [Espaciado, layout y breakpoints](#5-espaciado-layout-y-breakpoints)
6. [Bordes, radios y elevación](#6-bordes-radios-y-elevación)
7. [Movimiento](#7-movimiento)
8. [Íconos e imágenes](#8-íconos-e-imágenes)
9. [Implementación: `globals.css` y fuentes](#9-implementación-globalscss-y-fuentes)
10. [Componentes base (`shared/ui`)](#10-componentes-base-sharedui)
11. [Componentes de producto](#11-componentes-de-producto)
12. [Patrones](#12-patrones)
13. [Voz y textos](#13-voz-y-textos)
14. [Trabajo con Adobe XD](#14-trabajo-con-adobe-xd)
15. [Ajustes a la guía del front](#15-ajustes-a-la-guía-del-front)
16. [Checklist de UI para cada PR](#16-checklist-de-ui-para-cada-pr)

---

## 1. Principios

1. **Mobile-first (SIEMPRE).** La mayoría llega desde Instagram en el celular. Cada pantalla se diseña a 360 px y después se adapta a 768 px y 1280 px.
2. **El rojo vende.** El rojo se usa solo en lo que debe llamar la atención: botones de compra, precios y destacados. Si todo es rojo, nada destaca (planeación §3.11).
3. **Negro de base, blanco de respiro.** Así lo pidió Sam: *"el rojo llama mucho la atención, el blanco le da plenitud al fondo y el negro siempre está"*.
4. **Fuerza en los títulos, calma en el texto.** Los títulos usan una tipografía de impacto (Bebas Neue) y el resto una legible (Inter).
5. **Tokens, nunca valores sueltos (SIEMPRE).** No se escriben colores, tamaños ni sombras a mano (`text-[#E10600]`, `p-[13px]`). Si falta un token, se agrega aquí y en `globals.css`.
6. **Accesible por defecto.** Contraste AA, foco visible, objetivos táctiles de 44 px y controles con etiqueta (§3.4 y guía §8.4).
7. **El panel se usa con una mano.** Sam opera desde el celular: ver ventas, buscar un alumno y crear un link de pago. El editor de rutinas también funciona en el celular.

---

## 2. Temas por área

No hay selector de tema claro u oscuro: cada área tiene el suyo, porque la marca es la misma en todos los dispositivos. Los dos temas usan los mismos tokens semánticos (§3.2). Lo único que cambia es su valor, que se activa con la clase `dark` en el contenedor.

| Área | Tema | Por qué |
|---|---|---|
| **Sitio público** | Alterna secciones oscuras y claras (§2.1) | Impacto en el hero y descanso en el contenido |
| **Checkout, `/acceder`, `/pago/resultado`** | Claro, con la barra superior oscura | Los formularios en fondo claro transmiten confianza y se leen mejor |
| **Área del alumno** | Oscuro | Se siente como una app de entrenamiento y los videos resaltan |
| **Panel de admin** | Claro, con la navegación oscura | Tablas y datos legibles al sol en el celular de Sam |
| **Correos** (los envía el back) | Claro con encabezado negro | Referencia para que el correo "Tu acceso" se vea de la misma marca |

### 2.1 Ritmo de la landing

| # | Sección (planeación §3) | Fondo |
|---|---|---|
| 1 | Barra superior | Oscuro, fija |
| 2 | Hero | Oscuro, sobre foto o video con capa (§8.3) |
| 3 | Bienvenida / Sobre Sam | Claro (`background`) |
| 4 | Cómo funciona | Claro (`muted`, humo) |
| 5 | Deportes | Oscuro |
| 6 | Pack completo | **Rojo** (`cta`): la única sección roja del sitio |
| 7 | Qué incluye | Claro |
| 8 | Acceso directo | Oscuro |
| 9 | Preguntas frecuentes | Claro |
| 10 | Footer | Oscuro |

**Regla:** nunca dos secciones seguidas con el mismo fondo, salvo la barra y el hero.

---

## 3. Color

### 3.1 Paleta de marca

Los cuatro primeros son los de la planeación (§3.11). Los demás son los mínimos que hacen falta para cumplir AA y para tener superficies en el tema oscuro.

| Token | Valor | Uso |
|---|---|---|
| `negro` | `#0B0B0B` | Fondo del tema oscuro y texto del tema claro |
| `carbon` | `#161616` | Tarjetas y superficies sobre negro |
| `grafito` | `#2A2A2A` | Bordes decorativos y separadores en oscuro |
| `blanco` | `#FFFFFF` | Fondo del tema claro y texto del tema oscuro |
| `humo` | `#F5F5F5` | Superficies suaves en claro: secciones alternas, filas de tabla, `muted` |
| `niebla` | `#E5E5E5` | Bordes decorativos y separadores en claro |
| `gris` | `#8A8A8A` | Texto secundario en oscuro y borde de los campos de formulario en los dos temas |
| `acero` | `#6B6B6B` | Texto secundario en claro (el gris no pasa AA sobre blanco, §3.4) |
| `rojo` | `#E10600` | Botones de compra, precios en claro y la sección del pack |
| `rojo-oscuro` | `#B80500` | Hover y estado presionado de los botones rojos |
| `rojo-vivo` | `#FF3B30` | Precios y texto rojo **sobre fondo oscuro** (el rojo base no pasa AA ahí, §3.4) |

### 3.2 Tokens semánticos

Los componentes **solo** usan estos tokens, nunca los de marca directamente. Así un mismo componente funciona en los dos temas.

| Token | Claro | Oscuro | Para qué |
|---|---|---|---|
| `background` | blanco | negro | Fondo de página o sección |
| `foreground` | negro | blanco | Texto principal |
| `card` / `popover` | blanco | carbon | Tarjetas, menús, diálogos |
| `muted` | humo | carbon | Superficies secundarias, esqueletos |
| `muted-foreground` | acero | gris | Texto secundario, ayudas, metadatos |
| `primary` | negro | blanco | Acción principal **que no vende**, casillas marcadas, barras de progreso, pestaña activa |
| `primary-foreground` | blanco | negro | Texto sobre `primary` |
| `secondary` / `accent` | humo | grafito | Botón secundario, hover de menús |
| `border` | niebla | grafito | Bordes decorativos (tarjetas, separadores, tablas) |
| `input` | gris | gris | Borde de campos, casillas y radios (necesita 3:1, §3.4) |
| `ring` | negro | blanco | Anillo de foco |
| `cta` | rojo | rojo | Fondo de los botones de compra y de la sección del pack |
| `cta-hover` | rojo-oscuro | rojo-oscuro | Hover y presionado del `cta` |
| `cta-foreground` | blanco | blanco | Texto sobre `cta` |
| `price` | rojo | rojo-vivo | Precio vigente como texto |
| `destructive` | `#B42318` | `#B42318` | Fondo de botones destructivos (anular, borrar) |
| `danger` | `#B42318` | `#F87171` | Texto e ícono de error |
| `success` | `#15803D` | `#4ADE80` | Texto e ícono de éxito (aprobado, día completado) |
| `warning` | `#B45309` | `#FBBF24` | Texto e ícono de aviso (pendiente, por vencer) |

> **Error contra marca:** el error (`danger`) y la marca (`rojo`) son rojos parecidos. Para que no se confundan, un error **siempre** lleva ícono (`CircleAlert`) y texto, y nunca se muestra como un botón relleno.

### 3.3 Reglas de uso del rojo (SIEMPRE)

- **Un solo botón rojo por bloque visible.** En el hero, "Ver planes" es rojo y "Quiero un plan personalizado" es secundario.
- **Sí es rojo:** "Comprar…", "Desbloquear", "Renovar", "Completa el pack", precios, la sección del pack y la insignia "Ahorra X".
- **No es rojo:** "Entrar", "Guardar", "Ya tengo código", navegación, barras de progreso, casillas, pestañas, focos, íconos decorativos y casi todo el panel de admin.
- **En el panel**, el rojo aparece solo en los montos de venta del inicio y en "Generar link de pago".
- Dentro de la sección roja del pack, el botón es `default` sobre oscuro (blanco con texto negro), nunca rojo sobre rojo.

### 3.4 Contraste (WCAG 2.2 AA)

Medido con la fórmula de luminancia relativa de WCAG. AA pide **4,5:1** para texto normal, **3:1** para texto grande (≥ 24 px, o ≥ 19 px en negrita) y **3:1** para bordes de controles y para el foco.

| Combinación | Contraste | Resultado |
|---|---|---|
| negro sobre blanco | 19,68 | ✅ Todo texto |
| blanco sobre carbon | 18,10 | ✅ Todo texto |
| blanco sobre rojo (botón) | 4,97 | ✅ Todo texto |
| rojo sobre blanco | 4,97 | ✅ Todo texto (precios en claro) |
| **rojo sobre negro** | **3,96** | ⚠️ Solo texto grande. Para texto rojo en oscuro se usa `rojo-vivo` |
| rojo-vivo sobre negro / carbon | 5,55 / 5,10 | ✅ Todo texto |
| blanco sobre rojo-oscuro (hover) | 6,86 | ✅ Todo texto |
| **gris sobre blanco / humo** | **3,45 / 3,17** | ❌ Texto. ✅ Borde de campos (≥ 3:1) |
| acero sobre blanco / humo | 5,33 / 4,89 | ✅ Texto secundario en claro |
| gris sobre negro / carbon | 5,70 / 5,24 | ✅ Texto secundario en oscuro |
| `danger` / `success` / `warning` sobre blanco | 6,57 / 5,02 / 5,02 | ✅ |
| `danger` / `success` / `warning` claros sobre carbon | 6,54 / 10,38 / 10,84 | ✅ |
| niebla sobre blanco · grafito sobre negro | 1,26 · 1,37 | Solo decorativo: nunca es el único borde de un control |

---

## 4. Tipografía

### 4.1 Familias

| Token | Fuente | Uso |
|---|---|---|
| `font-display` | **Bebas Neue** 400 | Títulos de página y de sección, nombres de deporte, precios grandes, cifras del "Sobre mí" |
| `font-sans` | **Inter** 400, 500, 600 y 700 | Todo lo demás: párrafos, botones, formularios, tablas, panel |
| `font-mono` | Monoespaciada del sistema | Código de acceso (`NXF-7KQ4-P9DM`), IDs de video (`BOX-GOL-001`), referencias de orden |

**Reglas de Bebas Neue:**
- Solo tiene un peso y solo mayúsculas. **Nunca** se le pone `font-bold` (el navegador la engrosa y se ve mal).
- Mínimo 24 px. Por debajo de eso se usa Inter semibold.
- Nunca en párrafos, botones, campos ni tablas.
- El texto se escribe en minúsculas normales en el código ("Entrena conmigo"); la fuente ya lo muestra en mayúsculas. Así los lectores de pantalla no lo deletrean.

### 4.2 Escala

Los tamaños grandes usan `clamp()` para crecer con la pantalla sin saltos entre breakpoints.

| Token (`text-*`) | Familia | 360 px → 1280 px | Interlineado | Uso |
|---|---|---|---|---|
| `hero` | display | 48 → 96 px | 0,95 | Título del hero |
| `display-1` | display | 40 → 64 px | 1 | Título de página (deporte, "Mis planes") |
| `display-2` | display | 32 → 48 px | 1 | Título de sección |
| `display-3` | display | 24 → 32 px | 1,1 | Título de tarjeta (nombre del deporte) |
| `price-lg` | display | 40 → 56 px | 1 | Precio en la página del deporte, el pack y el checkout |
| `xl` | sans 600 | 20 px | 1,4 | Título de bloque, título de pantalla del panel |
| `lg` | sans 400 | 18 px | 1,6 | Subtítulo del hero, texto destacado |
| `base` | sans 400 | 16 px | 1,5 | Texto por defecto, **y tamaño mínimo de campos** |
| `sm` | sans 400 | 14 px | 1,45 | Ayudas, metadatos, tablas del panel |
| `xs` | sans 500 | 12 px | 1,4 | Insignias y marca de agua. Nada más pequeño |

- **Campos de formulario a 16 px (SIEMPRE).** Con menos, Safari en iPhone hace zoom al tocar el campo.
- Los números en tablas y contadores usan `tabular-nums` para que no bailen.
- Ancho máximo de párrafo: `max-w-prose` (unos 65 caracteres).
- `letter-spacing`: `0.01em` en display. Las insignias en mayúsculas usan `tracking-wide`.

---

## 5. Espaciado, layout y breakpoints

### 5.1 Espaciado

Se usa la escala de Tailwind (múltiplos de 4 px). Para mantener un ritmo, se prefieren estos pasos:

| Paso | px | Uso típico |
|---|---|---|
| `1` · `2` | 4 · 8 | Ícono con texto, insignias |
| `3` · `4` | 12 · 16 | Dentro de tarjetas, entre campo y etiqueta, **margen lateral en celular** |
| `6` | 24 | Padding de tarjeta en escritorio, entre grupos de un formulario |
| `8` · `12` | 32 · 48 | Entre bloques de una sección |
| `16` · `24` | 64 · 96 | Padding vertical de sección: `py-16 md:py-24` |

### 5.2 Contenedor y rejillas

```tsx
// shared/ui/container.tsx
<div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">…</div>
```

| Bloque | 360 px | `sm` 640 | `md` 768 | `lg` 1024+ |
|---|---|---|---|---|
| Tarjetas de deporte | 1 columna | 2 | 2 | 4 |
| Niveles (Básico / Intermedio) | 1 | 1 | 2 | 2 |
| Cómo funciona · Qué incluye | 1 | 1 | 3 · 2 | 3 · 2 |
| Mis planes | 1 | 2 | 2 | 3 |
| Técnicas (videos) | 2 | 2 | 3 | 4 |
| KPIs del panel | 2 | 2 | 4 | 4 |
| Formularios (checkout, acceder) | 1 columna, `max-w-md` centrada | | | |

### 5.3 Breakpoints

Los de Tailwind sin cambios: `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Se revisa en **360, 768 y 1280 px** (guía §8.3).

### 5.4 Elementos fijos

| Elemento | Alto | Dónde | `z-index` |
|---|---|---|---|
| Barra superior | 56 px (`h-14`) · `md:h-16` | Todo el sitio | `z-40` |
| `BuyBar` (precio + comprar) | 64 px + área segura | `/planes/[deporte]` en celular | `z-30` |
| Navegación inferior del panel | 64 px + área segura | `/admin/**` por debajo de `lg` | `z-40` |
| Barra "Guardar día" | 64 px + área segura | Editor del panel con cambios sin guardar | `z-30` |
| Diálogos, `Sheet`, menús | — | — | `z-50` (shadcn) |
| Avisos (`sonner`) | — | Abajo al centro en celular, abajo a la derecha en escritorio | `z-[100]` |

Las barras inferiores suman `pb-[env(safe-area-inset-bottom)]` para no quedar debajo de la barra del iPhone, y la página agrega el mismo alto como `padding-bottom` para que no tapen contenido.

---

## 6. Bordes, radios y elevación

| Token | Valor | Uso |
|---|---|---|
| `--radius` | `0.5rem` (8 px) | Base de shadcn |
| `rounded-sm` | 4 px | Insignias, casillas |
| `rounded-md` | 6 px | Botones y campos |
| `rounded-lg` | 8 px | Tarjetas, imágenes dentro de tarjetas, diálogos |
| `rounded-full` | — | Botón ▶ del video, avatar, puntos de estado |

- El hero y las fotos de borde a borde no llevan radio.
- **Elevación:** la marca es plana. Las tarjetas se separan con `border`, no con sombra. Solo llevan sombra los elementos que flotan: `shadow-lg` en diálogos y menús, y una sombra hacia arriba en `BuyBar`. En el tema oscuro no hay sombras: se usa `border-border`.
- Grosor de borde: 1 px. 2 px solo en el foco y en la tarjeta seleccionada (por ejemplo, el nivel elegido).

---

## 7. Movimiento

| Duración | Uso |
|---|---|
| 150 ms | Color y opacidad en hover y foco |
| 200 ms | Acordeón, pestañas, aparición de avisos |
| 300 ms | `Sheet` y diálogos |

- Curva `ease-out` al entrar y `ease-in` al salir.
- **`prefers-reduced-motion` (SIEMPRE):** se quitan los desplazamientos (`motion-reduce:transition-none`), el video del hero no se reproduce solo y se queda en el `poster`, y la marca de agua cambia de lugar sin animación.
- Nada se mueve por adorno: sin parallax, sin contadores animados y sin carruseles automáticos.

---

## 8. Íconos e imágenes

### 8.1 Íconos

`lucide-react` con trazo 2 (el de fábrica).

| Tamaño | Clase | Uso |
|---|---|---|
| 16 px | `size-4` | Junto a texto `sm`, dentro de insignias |
| 20 px | `size-5` | Botones y menús (por defecto) |
| 24 px | `size-6` | Listas de "Qué incluye", estados vacíos |
| 32 px dentro de un círculo de 56 px | `size-8` | Pasos de "Cómo funciona" |

- Un ícono que acompaña texto lleva `aria-hidden`. Un botón con solo ícono lleva `aria-label` ("Mover arriba", "Copiar código").
- Los íconos no van en rojo, salvo dentro de un botón `cta`.

**Mapa de íconos** (para no elegir uno distinto en cada pantalla):

| Concepto | Ícono |
|---|---|
| Pagar en línea | `CreditCard` |
| Código de acceso | `KeyRound` |
| Entrenar | `Dumbbell` |
| Videos de técnica · reproducir | `CirclePlay` · `Play` |
| Rutinas escritas | `ClipboardList` |
| Cualquier dispositivo | `Smartphone` |
| Dos niveles | `Layers` |
| Día completado | `CircleCheck` (marcado) · `Circle` (sin marcar) |
| Plan bloqueado | `Lock` |
| WhatsApp / chat con Sam | `MessageCircle` |
| Copiar · copiado | `Copy` · `Check` |
| Mover arriba / abajo · borrar | `ChevronUp` / `ChevronDown` · `Trash2` |
| Error · aviso · éxito | `CircleAlert` · `TriangleAlert` · `CircleCheck` |
| Cargando | `LoaderCircle` con `animate-spin` |

Los deportes **no** se representan con íconos (lucide no tiene guantes de boxeo ni barra): se usan fotos de Sam.

### 8.2 Imágenes

Siempre con `next/image`, `sizes` correcto y `priority` solo en el hero (guía §8.3). Se recortan con `object-cover`, nunca se estiran.

| Imagen | Proporción | `sizes` |
|---|---|---|
| Hero | 9:16 en celular · 16:9 desde `md` | `100vw` |
| Tarjeta de deporte | 4:5 | `(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw` |
| Encabezado del deporte | 3:2 en celular · 21:9 desde `md` | `100vw` |
| Fotos del "Sobre mí" | 4:5 | `(min-width: 768px) 33vw, 50vw` |
| Poster de video | 16:9 | Según la rejilla de técnicas |

Mientras no estén las fotos de Sam (planeación del front §8), se usan bloques `bg-muted` con la misma proporción, para que el layout no cambie cuando lleguen.

### 8.3 Texto sobre fotos

- Capa de degradado: `bg-gradient-to-t from-negro via-negro/70 to-negro/20`. El texto siempre va sobre la zona más oscura.
- El texto sobre foto es blanco. Se revisa el contraste con la foto real, no con la de prueba.
- En una tarjeta de plan bloqueado, la foto va en `grayscale` y con `opacity-60`, pero el texto sigue con su contraste normal.

---

## 9. Implementación: `globals.css` y fuentes

Esto **reemplaza** el bloque de la guía §8.1 (ver §15). `npx shadcn init` genera una parte; se ajusta a esto.

```css
/* src/app/globals.css */
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

/* 1. Paleta de marca: solo la usan los tokens semánticos y casos puntuales documentados */
@theme {
  --color-negro: #0b0b0b;
  --color-carbon: #161616;
  --color-grafito: #2a2a2a;
  --color-blanco: #ffffff;
  --color-humo: #f5f5f5;
  --color-niebla: #e5e5e5;
  --color-gris: #8a8a8a;
  --color-acero: #6b6b6b;
  --color-rojo: #e10600;
  --color-rojo-oscuro: #b80500;
  --color-rojo-vivo: #ff3b30;

  --font-mono: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;

  --text-hero: clamp(3rem, 1.8rem + 5.3vw, 6rem);
  --text-hero--line-height: 0.95;
  --text-display-1: clamp(2.5rem, 1.9rem + 2.6vw, 4rem);
  --text-display-1--line-height: 1;
  --text-display-2: clamp(2rem, 1.6rem + 1.75vw, 3rem);
  --text-display-2--line-height: 1;
  --text-display-3: clamp(1.5rem, 1.3rem + 0.9vw, 2rem);
  --text-display-3--line-height: 1.1;
  --text-price-lg: clamp(2.5rem, 2.1rem + 1.75vw, 3.5rem);
  --text-price-lg--line-height: 1;
}

/* 2. Tokens semánticos: tema claro */
:root {
  --radius: 0.5rem;
  --background: var(--color-blanco);
  --foreground: var(--color-negro);
  --card: var(--color-blanco);
  --card-foreground: var(--color-negro);
  --popover: var(--color-blanco);
  --popover-foreground: var(--color-negro);
  --primary: var(--color-negro);
  --primary-foreground: var(--color-blanco);
  --secondary: var(--color-humo);
  --secondary-foreground: var(--color-negro);
  --muted: var(--color-humo);
  --muted-foreground: var(--color-acero);
  --accent: var(--color-humo);
  --accent-foreground: var(--color-negro);
  --border: var(--color-niebla);
  --input: var(--color-gris);
  --ring: var(--color-negro);
  --cta: var(--color-rojo);
  --cta-hover: var(--color-rojo-oscuro);
  --cta-foreground: var(--color-blanco);
  --price: var(--color-rojo);
  --destructive: #b42318;
  --danger: #b42318;
  --success: #15803d;
  --warning: #b45309;
}

/* 3. Tema oscuro: se activa con class="dark" en <section>, en el layout del alumno o en la barra */
.dark {
  --background: var(--color-negro);
  --foreground: var(--color-blanco);
  --card: var(--color-carbon);
  --card-foreground: var(--color-blanco);
  --popover: var(--color-carbon);
  --popover-foreground: var(--color-blanco);
  --primary: var(--color-blanco);
  --primary-foreground: var(--color-negro);
  --secondary: var(--color-grafito);
  --secondary-foreground: var(--color-blanco);
  --muted: var(--color-carbon);
  --muted-foreground: var(--color-gris);
  --accent: var(--color-grafito);
  --accent-foreground: var(--color-blanco);
  --border: var(--color-grafito);
  --ring: var(--color-blanco);
  --price: var(--color-rojo-vivo);
  --danger: #f87171;
  --success: #4ade80;
  --warning: #fbbf24;
}

/* 4. Utilidades de Tailwind a partir de los tokens (bg-cta, text-price, text-muted-foreground…) */
@theme inline {
  --font-display: var(--font-bebas-neue);
  --font-sans: var(--font-inter);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-cta: var(--cta);
  --color-cta-hover: var(--cta-hover);
  --color-cta-foreground: var(--cta-foreground);
  --color-price: var(--price);
  --color-destructive: var(--destructive);
  --color-danger: var(--danger);
  --color-success: var(--success);
  --color-warning: var(--warning);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background font-sans text-foreground antialiased; }
  :focus-visible { @apply outline-2 outline-offset-2 outline-ring; }
}
```

```tsx
// src/app/layout.tsx (extracto)
import { Bebas_Neue, Inter } from "next/font/google";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas-neue", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${bebas.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- Las secciones oscuras se escriben `<section className="dark bg-background text-foreground">`. Dentro, todos los componentes toman el tema oscuro sin cambiar nada.
- El layout de `(student)` lleva `className="dark"` en su raíz. El panel no, salvo su navegación.
- No hace falta `next-themes`: no hay selector de tema.

---

## 10. Componentes base (`shared/ui`)

Son los de shadcn de la planeación del front (§4.2), instalados con su CLI y ajustados a estos tokens. **No reciben lógica de negocio** (guía §8.2).

### 10.1 `Button`

| Variante | Aspecto | Cuándo |
|---|---|---|
| `cta` | `bg-cta text-cta-foreground hover:bg-cta-hover` | Comprar, desbloquear, renovar, "Ver planes". Uno por bloque (§3.3) |
| `default` | `bg-primary text-primary-foreground` (negro en claro, blanco en oscuro) | Acción principal que no vende: "Entrar", "Guardar día", "Enviar cuestionario" |
| `secondary` | `bg-secondary` | Acción alternativa: "Quiero un plan personalizado" |
| `outline` | Borde `input`, fondo transparente | Acciones de una tarjeta o de una tabla: "Ver detalle", "Reenviar código" |
| `ghost` | Sin fondo; `hover:bg-accent` | Íconos de la barra, ↑↓ del editor, menús |
| `link` | Subrayado al pasar el cursor | Dentro de un texto: "o llévate el pack completo por $X" |
| `destructive` | `bg-destructive text-blanco` | Solo dentro de un `AlertDialog` de confirmación: "Anular orden", "Borrar video" |

| Tamaño | Alto | Uso |
|---|---|---|
| `sm` | 36 px (`h-9`) | Tablas del panel en escritorio. **Nunca** en celular |
| `default` | 44 px (`h-11`), `px-5` | Por defecto |
| `lg` | 48 px (`h-12`), `px-6`, `text-base` | Botones principales del sitio público y del checkout |
| `icon` | 44 × 44 px (`size-11`) | Botones con solo ícono |

- En celular, el botón principal de un formulario o de una tarjeta ocupa todo el ancho: `w-full sm:w-auto`.
- **Cargando:** el botón queda deshabilitado, muestra `LoaderCircle` a la izquierda y cambia el texto a gerundio ("Entrando…", "Guardando…"). No cambia de tamaño.
- Texto de botón: verbo + objeto, en Inter 600 (§13).

```ts
// shared/ui/button.tsx (extracto de las variantes de cva)
variant: {
  cta: "bg-cta text-cta-foreground hover:bg-cta-hover active:bg-cta-hover",
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  // secondary, outline, ghost, link y destructive como los genera shadcn
},
size: {
  sm: "h-9 px-3 text-sm",
  default: "h-11 px-5",
  lg: "h-12 px-6 text-base",
  icon: "size-11",
},
```

### 10.2 Formularios: `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Label`, `Form`

- Alto de `Input` y `Select`: 44 px. Texto a 16 px (§4.2). Borde `input` (gris), fondo `background`.
- **La etiqueta va arriba y siempre visible.** El `placeholder` solo muestra un ejemplo (`NXF-XXXX-XXXX`, `tu@correo.com`), nunca reemplaza la etiqueta.
- Texto de ayuda debajo, en `text-sm text-muted-foreground`.
- **Error:** borde `danger`, `aria-invalid="true"` y debajo un mensaje con `CircleAlert` en `text-danger` y `role="alert"`. El mensaje sale de `error-messages.ts` o del esquema de Zod.
- `Checkbox` y `Radio`: 20 px, con la fila completa (casilla + texto) como zona táctil de al menos 44 px de alto.
- Atributos útiles: correo con `type="email"` y `autoComplete="email"`; nombre con `autoComplete="name"`; WhatsApp con `type="tel"` e `inputMode="tel"`; código con `autoComplete="off"`, `autoCapitalize="characters"` y `spellCheck={false}`.

### 10.3 `Badge`

En mayúsculas, `text-xs font-medium tracking-wide`, `rounded-sm`, `px-2 py-0.5`.

| Variante | Aspecto | Uso |
|---|---|---|
| `neutral` | `bg-muted text-muted-foreground` | Informativo: "Básico + Intermedio", "Expirada" |
| `cta` | `bg-cta text-cta-foreground` | "Ahorra 60 %", "Más completo". Solo en el sitio público |
| `success` | Fondo `success/10`, texto `success` | "Aprobada", "Listo" |
| `warning` | Fondo `warning/10`, texto `warning` | "Pendiente", "Vence en 5 días" |
| `danger` | Fondo `danger/10`, texto `danger` | "Rechazada", "Falló" |
| `outline` | Borde `border` | "Anulada", "Reembolsada" |

**Estados de la API** (contrato §5 y §10.4):

| Recurso | `status` | Insignia |
|---|---|---|
| Orden | `pending` | `warning` · Pendiente |
| Orden | `approved` | `success` · Aprobada |
| Orden | `declined` | `danger` · Rechazada |
| Orden | `expired` | `neutral` · Expirada |
| Orden | `voided` · `refunded` | `outline` · Anulada · Reembolsada |
| Video | `draft` | `neutral` · Borrador |
| Video | `processing` | `warning` · Procesando (con `LoaderCircle`) |
| Video | `ready` | `success` · Listo |
| Video | `failed` | `danger` · Falló |

El texto de la insignia sale de un mapa en el `domain/` de la feature, no del valor crudo de la API.

### 10.4 Resto de componentes

| Componente | Ajustes y reglas |
|---|---|
| `Card` | `rounded-lg border bg-card p-4 md:p-6`, sin sombra. Si toda la tarjeta es un enlace, el enlace es el título y se extiende con `after:absolute after:inset-0` (un solo foco, no un `div` con `onClick`) |
| `Accordion` | FAQ y semanas del plan. Disparador de 56 px de alto como mínimo, `ChevronDown` que gira 180° |
| `Tabs` | Selector de nivel Básico \| Intermedio. Pestaña activa con `primary` (nunca rojo). En celular, las pestañas ocupan todo el ancho |
| `Dialog` | Reproductor de video y formularios cortos del panel. En celular ocupa todo el ancho, con el botón de cerrar de 44 px |
| `AlertDialog` | Toda acción irreversible: anular orden, borrar video, regenerar código. El título dice qué pasa ("¿Anular la orden NXF-8F3K2M?") y el botón repite el verbo ("Anular orden"), nunca "Sí" o "Aceptar" |
| `Sheet` | Menú móvil del sitio (desde la derecha) y "Más" del panel (desde abajo) |
| `DropdownMenu` | Menú de sesión del alumno y acciones de una fila del panel |
| `Table` | Solo desde `md`. Por debajo, la misma información se muestra como lista de tarjetas (§12.6) |
| `Skeleton` | `bg-muted rounded-md animate-pulse`, con la forma del contenido que reemplaza (§12.4) |
| `Progress` | 8 px de alto, `bg-muted` con relleno `primary`. Siempre acompañado del texto ("5 de 24 días") |
| `Command` | Buscador de videos (editor) y de alumnos (soporte, personalizados). Busca por ID, título o correo |
| `Sonner` | Confirmaciones breves ("Código copiado", "Día guardado"): 4 s. Los errores de un formulario **no** van en un aviso: van junto al formulario |
| `Separator` | `bg-border`, 1 px |

---

## 11. Componentes de producto

Viven en el `ui/` de su feature (planeación del front §3). Se arman con `shared/ui` y los tokens; ninguno define colores propios.

### 11.1 Compartidos (`shared/ui`)

| Componente | Anatomía y reglas |
|---|---|
| `Header` | Oscuro y fijo. Logo a la izquierda. En `md`+: "Planes" (`ghost`, baja a #deportes) y "Ya tengo código" (`outline`). En celular: "Ya tengo código" siempre visible + menú `Menu` que abre un `Sheet` (planeación §3.1). Fondo `bg-background/95` con `backdrop-blur` al hacer scroll |
| `Footer` | Oscuro. Instagram de Sam, enlaces legales, "Ya tengo código" y "© año Nexora Fit" en `text-sm text-muted-foreground` |
| `PriceTag` | Precio en `font-display text-price-lg text-price`, formateado con `formatCop()`. Si hay precio tachado, va antes, en `text-lg text-muted-foreground line-through` con `aria-label="Antes $ 640.000"`. Si hay ahorro, una insignia `cta` "Ahorra X %" (el porcentaje lo calcula la API o se deriva de dos valores que entrega la API; el front no inventa precios) |
| `EmptyState` | Ícono de 24 px en `muted-foreground`, título `text-xl`, una línea de explicación y una acción opcional |
| `ErrorState` | `CircleAlert` en `danger`, mensaje de `error-messages.ts` y botón `outline` "Reintentar" |
| `Captcha` | Turnstile en modo `managed`, ancho completo en celular, justo encima del botón de enviar. Tema `light` o `dark` según la sección |

### 11.2 `catalog` (sitio público)

| Componente | Anatomía y reglas |
|---|---|
| `Hero` | Pantalla completa menos la barra (`min-h-[calc(100svh-3.5rem)]`). Foto o video con capa (§8.3), título `text-hero`, subtítulo `text-lg`, botón `cta` "Ver planes" y botón `secondary` "Quiero un plan personalizado". En celular, los botones van apilados a todo el ancho. Video: `muted`, `loop`, `playsInline`, `poster` y nada de autoplay con `prefers-reduced-motion` |
| `About` | Texto en primera persona de Sam (`max-w-prose`), 2 o 3 fotos 4:5 y 3 cifras en `font-display text-display-2` con su etiqueta en `text-sm text-muted-foreground` |
| `HowItWorks` | 3 pasos con número, ícono en círculo `bg-background` de 56 px, título `text-xl` y una línea |
| `SportCards` | Tarjeta con foto 4:5 de borde a borde, nombre en `text-display-3`, una línea, insignia "Básico + Intermedio", `PriceTag` pequeño (`text-display-3`) y botón `outline` "Ver plan". Toda la tarjeta es el enlace (§10.4) |
| `PackBanner` | Sección `bg-cta text-cta-foreground`. Título "Llévate los 4 deportes", precio tachado en blanco al 70 %, precio del pack en blanco (no rojo sobre rojo) y botón `default` sobre oscuro: "Comprar pack completo" |
| `Includes` | 2 columnas desde `md`, ícono de 24 px + título + una línea |
| `DirectAccessCta` | Sección oscura. Título "¿Quieres un plan hecho solo para ti?", explicación y botón `cta` "Hablar con Sam" |
| `Faq` | `Accordion` de una sola columna, `max-w-3xl` |
| `PlanHeader` | Foto 3:2 / 21:9 con capa, nombre en `text-display-1`, descripción de 2 o 3 líneas y viñetas de "Para quién es" con `Check` |
| `LevelCards` | Dos tarjetas. Cada una con nombre del nivel, fila de datos "4 semanas · 3 días · 50 min" con íconos de 16 px, y "Qué logras" |
| `Syllabus` | Lista agrupada por categoría (título `text-xl`), con los títulos de los videos y `CirclePlay` en `muted-foreground`. Solo títulos, nada que se pueda reproducir |
| `SampleDayPreview` | Ver §12.3 |
| `EquipmentList` | Insignias `neutral` |
| `BuyBar` | En celular: barra fija abajo con `PriceTag` a la izquierda y botón `cta` "Comprar" a la derecha. En `lg`+: la misma información como tarjeta lateral fija (`sticky top-20`) junto al contenido. Debajo del botón, `link` "o llévate el pack completo por $X" |

### 11.3 `checkout`

| Componente | Anatomía y reglas |
|---|---|
| `CheckoutForm` | Tema claro, una columna `max-w-md`. Campos: nombre, correo, WhatsApp (opcional, marcado "Opcional" en la etiqueta), casilla de términos con enlaces que abren en otra pestaña, `Captcha` y botón `cta lg` "Pagar $ X" a todo el ancho. Debajo, una línea con `Lock`: "Pago seguro con Wompi" |
| `OrderSummary` | Tarjeta `muted` arriba del formulario en celular y a la derecha en `lg`. Producto, qué incluye, duración del acceso, crédito si aplica ("Ya pagaste Boxeo: − $ 160.000" en `success`) y total en `PriceTag` |
| `PaymentResult` | Un estado por pantalla, centrado, con ícono de 48 px: **cargando** (`LoaderCircle` + "Estamos confirmando tu pago…", con `aria-live="polite"`), **aprobado** (`CircleCheck` en `success` + `AccessCodeCard`), **pendiente** pasados los 5 min (`TriangleAlert` en `warning` + "Te enviaremos el código a tu correo apenas se apruebe"), **rechazado o expirado** (`CircleAlert` en `danger` + botón `cta` "Intentar de nuevo") |
| `AccessCodeCard` | Ver §12.2 |

### 11.4 `access`

| Componente | Anatomía y reglas |
|---|---|
| `RedeemForm` | Título "Entra con tu código", campo "Código de acceso" en `font-mono text-xl tracking-widest uppercase`, botón `default lg` "Entrar" y enlace "¿Perdiste tu código?" que cambia a `RecoverForm` en la misma página. El `Captcha` aparece solo cuando la API responde `CAPTCHA_REQUIRED` |
| `RecoverForm` | Campo de correo, `Captcha` y botón "Enviarme el código". Al enviar, siempre el mismo mensaje en `success`: "Si el correo tiene compras, te llegará un mensaje en unos minutos" (planeación §5.6) |
| `MagicLinkHandler` | Pantalla de carga centrada; si el enlace venció, `ErrorState` con el mensaje de `INVALID_TOKEN` y el formulario de recuperar |
| `SessionMenu` | Botón `ghost` con el nombre del alumno y `ChevronDown`. Opciones: "Cerrar sesión" y "Cerrar sesión en otros dispositivos" (esta pide confirmación con `AlertDialog`) |

### 11.5 `student` (tema oscuro)

| Componente | Anatomía y reglas |
|---|---|
| `CustomPlanBanner` | Primera tarjeta de `/mis-planes`, a todo el ancho, con borde `cta` de 2 px: "Tu plan personalizado" y botón `default` "Entrenar" |
| `PlanCard` | Foto 16:9, nombre en `text-display-3`, `Progress` con "5 de 24 días", vencimiento en `text-sm text-muted-foreground` ("Acceso hasta el 23 oct 2027") y botón `default` "Entrenar". Si `renewal` viene, insignia `warning` "Vence en N días" y botón `cta` "Renovar" |
| `LockedPlanCard` | Igual que `PlanCard`, con la foto en gris (§8.3), `Lock`, precio con `PriceTag` y botón `cta` "Desbloquear". Va después de los planes comprados |
| `UpgradeCard` | Tarjeta "Completa el pack por $ X" con botón `cta`. Solo si `pack_upgrade` no es `null` |
| `DirectAccessCard` | `MessageCircle`, "Habla con Sam" y los días restantes (insignia `warning` si quedan 3 o menos). Si falta el cuestionario, botón `default` "Llenar cuestionario"; si está lleno, botón `default` "Escribirle a Sam por WhatsApp" que abre `whatsapp_url` en otra pestaña |
| `LevelTabs` | `Tabs` a todo el ancho con "Básico" e "Intermedio". Los personalizados (`custom`) no muestran pestañas |
| `WeekAccordion` | Una semana por ítem: "Semana 1" + "3 de 5 días" a la derecha. Se abre la primera semana con días sin completar |
| `DayRoutine` | Encabezado con "Día 1 · Guardia y recto" y "50 min". Luego los bloques, cada uno con su título en `text-xl` ("Calentamiento", "Trabajo principal", "Vuelta a la calma") y su lista de `ExerciseRow`. Al final, el botón de día completado (§12.5) |
| `ExerciseRow` | Nombre en `font-medium`, debajo los datos en `text-sm text-muted-foreground` separados por "·" ("4 rondas · 3 min · descanso 1 min"), notas en `text-sm` itálica y, si tiene videos, un botón `outline` de 44 px por video: `Play` + título corto, que abre `VideoModal` |
| `TechniquesGrid` | Rejilla de posters 16:9 agrupados por categoría, con título del video y duración (`text-xs`, `tabular-nums`) |
| `QuestionnaireForm` | Una pregunta por grupo, en una columna. Deportes y equipo con `Checkbox`, nivel con `RadioGroup`, días con `Select` de 1 a 7, lesiones con `Textarea` y la nota "Solo Sam ve esta información". Botón `default lg` "Enviar cuestionario" |

### 11.6 `player`

| Componente | Anatomía y reglas |
|---|---|
| `VideoPlayer` | Contenedor 16:9 `bg-negro rounded-lg overflow-hidden` con el `<video>` a todo el tamaño, `poster`, `playsInline`, `controlsList="nodownload"` y sin menú contextual. Antes de reproducir: botón ▶ centrado de 64 px (`rounded-full bg-negro/60`, ícono blanco) con `aria-label="Reproducir {título}"`. Cargando: `Skeleton` 16:9. Error: `ErrorState` dentro del mismo contenedor |
| `Watermark` | Correo del alumno en `font-mono text-xs` (`md:text-sm`), `text-blanco/30`, `pointer-events-none select-none`, con `aria-hidden`. Cambia cada 30 s entre las cuatro esquinas y el centro (`watermarkPosition(tick)`), con 1 s de transición de opacidad salvo con `prefers-reduced-motion`. Para que siga visible en pantalla completa, se pone en pantalla completa **el contenedor**, no el `<video>`. En iPhone, Safari usa su pantalla completa nativa y la marca no se ve: es parte de la "barrera blanda" de la planeación (§7.7) |
| `VideoModal` | `Dialog` con el título del video, `VideoPlayer` y la descripción si existe. En celular ocupa todo el ancho y el video queda arriba |

### 11.7 `admin/*` (tema claro)

| Componente | Anatomía y reglas |
|---|---|
| `AdminShell` | En `lg`+: barra lateral oscura de 240 px con logo y secciones. Por debajo de `lg`: barra superior con el título de la pantalla y **navegación inferior** con 5 destinos de 44 px: Inicio, Ventas, Alumnos, Videos y Más (`Sheet` con Planes, Productos, Personalizados y Acceso directo). Ícono + etiqueta siempre; el activo con `primary` |
| `LoginForm` · `OtpForm` | Pantalla centrada `max-w-sm`. El OTP es un campo de 6 dígitos con `inputMode="numeric"` y `autoComplete="one-time-code"` |
| `KpiTiles` | Ventas de hoy, semana y mes en `font-display text-display-2 tabular-nums`; el monto en `text-price` (único rojo del inicio) y la cantidad de órdenes en `text-sm text-muted-foreground` |
| `RecentPayments` · `OrdersTable` · `KeySearch` · `DirectAccessList` · `CustomPlansList` · `VideosTable` · `ProductsTable` | Tabla desde `md`, tarjetas en celular (§12.6). Filtros arriba en una fila que se desplaza en horizontal en celular |
| `OrderDetail` · `KeyDetail` | Encabezado con referencia o código en `font-mono` e insignia de estado. Datos en una lista de dos columnas (`dl`) desde `md`. Acciones abajo; las irreversibles con `AlertDialog` |
| `CustomPlanForm` | Buscador de alumno (`Command`), precio y crédito aplicado en `success`. Al crear el link, un `CopyLinkButton` grande (`cta`, "Copiar link de pago") y un botón `outline` "Enviar por WhatsApp" |
| `VideoForm` · `UploadProgress` | ID en `font-mono` con validación del formato `BOX-GOL-001`. La subida muestra `Progress` con porcentaje y "No cierres esta pestaña"; si falla, botón "Reanudar" (TUS reanuda donde quedó) |
| `PlanTree` | Árbol nivel → semana → día como `Accordion` anidado. En celular, tocar un día abre `DayEditor` a pantalla completa |
| `DayEditor` · `ExerciseEditor` | Ver §12.7 |
| `ImportRoutineDialog` | `Textarea` con el texto de la rutina y una vista previa a la derecha (abajo en celular). Los IDs desconocidos se marcan con `danger` |

---

## 12. Patrones

### 12.1 Precios
- Siempre con `formatCop()` (guía §7): `$ 160.000`. Sin decimales.
- El front no calcula totales: muestra `price_cop`, `full_price_cop`, `credit_cop` y `total_cop` tal como llegan.
- El precio vigente usa `text-price`; el tachado, `muted-foreground`. Un precio nunca se muestra solo con color: el tachado lleva `line-through` y su `aria-label`.

### 12.2 Código de acceso (`AccessCodeCard`)
- Tarjeta con borde de 2 px `border-foreground`, etiqueta "Tu código de acceso", el código en `font-mono text-3xl tracking-[0.15em] tabular-nums` y `select-all` para copiarlo con un toque largo.
- Botones: `outline` "Copiar" (pasa a `Check` + "Copiado" por 2 s y anuncia el cambio con `aria-live`) y `cta lg` "Entrar a mi plan".
- Debajo: "También te lo enviamos a {correo}. Guárdalo: es tu llave para entrar".
- El código nunca se escribe en la consola, Sentry, analítica ni `localStorage` (guía §9.1).

### 12.3 Contenido bloqueado (`SampleDayPreview`)
- Se muestra el primer bloque real que entrega la API.
- Después, `hidden_blocks` bloques **de relleno**: barras `bg-muted` del alto de una línea, con `blur-sm`, `aria-hidden` y `select-none`. El contenido real nunca llega al navegador (contrato §4).
- Encima del relleno, un degradado hacia `background`, `Lock` y el botón `cta` "Desbloquear el plan de Boxeo".

### 12.4 Estados de carga, vacío y error (guía §15.2)
| Estado | Cómo se ve |
|---|---|
| Cargando | `Skeleton` con la forma del contenido: tarjeta, filas de tabla o bloques del día. Nunca un spinner de pantalla completa |
| Vacío | `EmptyState` con una acción: "Aún no tienes planes" + "Ver planes" |
| Error | `ErrorState` con "Reintentar" |
| Guardando | El botón entra en estado de carga (§10.1); el resto de la pantalla sigue usable |

### 12.5 Día completado
- Botón `outline lg` a todo el ancho con `Circle` + "Marcar día completado". Al marcarlo, pasa a `CircleCheck` en `success` + "Día completado" y se actualiza al instante (actualización optimista, planeación del front §6).
- Es un `aria-pressed`, no una casilla: se puede desmarcar con el mismo botón.
- Si la API falla, vuelve al estado anterior y muestra un aviso con el error.

### 12.6 Tablas en el celular
Por debajo de `md`, cada fila es una tarjeta: primera línea con el dato principal (alumno, referencia) y la insignia de estado a la derecha; segunda línea con los datos secundarios en `text-sm text-muted-foreground`; toda la tarjeta lleva al detalle. Los filtros se abren en un `Sheet` con el botón "Filtros (2)".

### 12.7 Editor de rutinas en el celular
- Cada bloque y cada ejercicio es una tarjeta. Los controles son botones `ghost` de 44 px: `ChevronUp`, `ChevronDown` y `Trash2`, con `aria-label` ("Mover 'Golpe recto' arriba"). No hay arrastrar y soltar (planeación del front §4.1).
- El primer elemento no tiene "Mover arriba" activo y el último no tiene "Mover abajo".
- Borrar un ejercicio no pide confirmación, pero muestra un aviso con "Deshacer" durante 5 s.
- Con cambios sin guardar aparece la barra fija "Cambios sin guardar" + botón `default` "Guardar día". Salir de la pantalla con cambios pide confirmación.
- Los errores de validación se muestran en el ejercicio que falla y la pantalla se desplaza hasta el primero.

### 12.8 Formularios
- Una columna, siempre. Orden: datos, consentimiento, captcha, botón.
- Se valida al enviar y, después del primer intento, al salir de cada campo. Un error nunca borra lo que la persona escribió.
- El foco va al primer campo con error.

### 12.9 Enlaces externos
WhatsApp, Instagram y los legales que se abren desde el checkout usan `target="_blank" rel="noopener noreferrer"` y el ícono `ExternalLink` de 16 px cuando no es obvio que sale del sitio.

---

## 13. Voz y textos

- **Se tutea siempre** ("Revisa tu correo", "Entra con tu código"), como en la planeación.
- **En la landing habla Sam**, en primera persona ("Entrena conmigo"). En el checkout, el área del alumno y el panel habla la plataforma, en un tono neutro y corto.
- **Botones:** verbo + objeto ("Comprar plan de Boxeo", "Copiar código", "Guardar día"). Nada de "Aceptar", "OK" o "Enviar" a secas.
- **Mayúscula solo al inicio** ("Ya tengo código", no "Ya Tengo Código"). Las mayúsculas totales las pone Bebas Neue.
- **Errores:** dicen qué pasó y qué hacer ("El enlace venció o ya se usó. Pide uno nuevo."). Salen de `error-messages.ts` (planeación del front §7), nunca del texto del servidor.
- **Números y fechas:** `$ 160.000`; `Intl.DateTimeFormat("es-CO", { dateStyle: "medium" })` para fechas; "4 semanas · 3 días · 50 min" con el punto medio como separador.
- **Nombres fijos:** "código de acceso" (no "llave", que es el término interno), "Mis planes", "Acceso directo", "Pack completo", "Plan personalizado", "Básico" e "Intermedio".
- **Sin emojis** en la interfaz; se usan los íconos de §8.1. La planeación los usa solo como referencia.

---

## 14. Trabajo con Adobe XD

Alex está diseñando las vistas en XD. Para que pasar del diseño al código sea directo:

1. **Colores en "Recursos del documento"** con los nombres de §3.1 (`negro`, `carbon`, `rojo`…), y los semánticos de §3.2 como segundo grupo, uno por tema.
2. **Estilos de carácter** con los nombres de §4.2 (`hero`, `display-1`, `base`, `sm`…), en sus dos tamaños: 360 px y 1280 px.
3. **Componentes de XD con los mismos nombres y variantes del código:** `Button / cta / lg`, `Badge / warning`, `PlanCard / renovar`. Los estados (hover, cargando, deshabilitado, error) como estados del componente.
4. **Artboards** de 360 × 800, 768 × 1024 y 1280 × 800 por pantalla.
5. **Rejilla:** 4 columnas con márgenes de 16 px en celular y 12 columnas con contenedor de 1152 px en escritorio, con el paso de 4 px.
6. Si el diseño de XD necesita un valor que no está aquí (un color, un tamaño, un radio), **se agrega primero a este documento** y después se usa. Así XD, este documento y `globals.css` no se separan.

---

## 15. Ajustes a la guía del front

Se aplican al implementar HUF-2. La §8.1 de la guía se actualiza para que enlace a este documento en vez de repetir los tokens.

| # | Guía actual (§8.1) | Cambio | Por qué |
|---|---|---|---|
| 1 | `--primary: var(--color-rojo)` | `--primary` es negro en claro y blanco en oscuro; el rojo pasa a un token propio, `--cta` | shadcn usa `primary` en casillas, barras de progreso, pestañas y botones por defecto. Con `primary` rojo, todo eso sería rojo y se rompe la regla "el rojo solo vende" |
| 2 | `--color-gris` para textos secundarios | `acero` (`#6B6B6B`) para texto secundario en claro; `gris` queda para el tema oscuro y para los bordes de los campos | El gris da 3,45:1 sobre blanco y no pasa AA (§3.4) |
| 3 | Un solo rojo | `rojo-vivo` (`#FF3B30`) para texto rojo sobre negro y `rojo-oscuro` (`#B80500`) para el hover | El rojo base da 3,96:1 sobre negro: no alcanza para precios en texto normal |
| 4 | Solo tema claro | Tema oscuro con `.dark` por sección y por área (§2) | La landing alterna fondos y el área del alumno es oscura |
| 5 | `@theme` con las fuentes | Las fuentes van en `@theme inline` | Así las utilidades usan la variable que crea `next/font` y no un valor copiado |

---

## 16. Checklist de UI para cada PR

Complementa la definición de "Hecho" de la guía (§15.5):

- [ ] Solo usa tokens: sin colores, tamaños ni sombras sueltos.
- [ ] Hay como máximo un botón rojo por bloque visible, y el rojo solo está en lo que vende.
- [ ] Se revisó a 360, 768 y 1280 px, con capturas en el PR.
- [ ] Los textos cumplen el contraste de §3.4, incluido el texto sobre fotos reales.
- [ ] Todo se puede usar con teclado, con el foco visible; los botones con solo ícono tienen `aria-label`.
- [ ] Los objetivos táctiles miden al menos 44 px y los campos tienen 16 px de texto.
- [ ] La pantalla tiene sus estados de carga, vacío y error (§12.4).
- [ ] Se respeta `prefers-reduced-motion`.
- [ ] Los textos siguen §13 y los errores salen de `error-messages.ts`.
- [ ] Si se agregó un token o un componente, está en este documento.
