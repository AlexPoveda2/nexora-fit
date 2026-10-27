# 0001 — Next.js 15 (App Router) en lugar de Vite + React Router

- Estado: aceptada (2026-10-23)
- Contexto: la guía de desarrollo del back (§4.2) propone, como valor por defecto para cualquier front, React + Vite + React Router. Este repositorio es el sitio público de Nexora Fit: tiene landing, páginas de deporte y checkout que se comparten en redes e indexan en buscadores (una vez se active, guía front §9.5), y necesita un proxy hacia la API para que la cookie de sesión no requiera un `Domain` compartido entre dos dominios (guía front §5.4).
- Decisión:
  - Se usa **Next.js 15 con App Router** en vez de Vite + React Router.
  - Esto da SSR/SSG para SEO en la landing y las páginas de deporte, `next/image` y `next/font` sin configuración manual, y el mecanismo de `rewrites` de `next.config.ts` como proxy hacia el back sin montar un servidor Node propio.
  - Se documenta aquí porque es una excepción al valor por defecto de la guía del back; esa guía (§4.2) se actualiza para dejar de asumir Vite + React Router como único camino, o anotar que Nexora Fit es una excepción documentada en este ADR.
- Consecuencias:
  - Server Components y Client Components son dos mundos distintos: una instancia de clase (p. ej. el cliente Axios) no puede pasar de uno a otro como prop, así que el *composition root* (`src/core/providers.tsx`) crea el contenedor en el cliente en vez de recibirlo del layout (TF-4).
  - El equipo necesita entender App Router (layouts, metadata, Server/Client Components), que es más que lo mínimo de una SPA con Vite.
  - El despliegue en Render es un servicio Node (`npm run build && npm run start`), no un sitio estático — ver `render.yaml` (TF-6).
