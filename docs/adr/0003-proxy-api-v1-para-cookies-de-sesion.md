# 0003 — Proxy `/api/v1` en Next.js para las cookies de sesión

- Estado: aceptada (2026-10-24)
- Contexto: el front y el back son dos servicios distintos (nexora-fit y nexorafit-back, cada uno con su propio dominio en Render). La sesión del alumno y del admin vive en una cookie (`nxf_session`, `nxf_admin`) que pone el back. Si el navegador llamara directo a la API en su propio dominio, la cookie necesitaría el atributo `Domain` compartido entre los dos dominios, o `SameSite=None` con los problemas de privacidad y de bloqueo de cookies de terceros que eso trae en navegadores modernos.
- Decisión:
  - El navegador **nunca** llama directo al back. Llama a `/api/v1/...` en el mismo dominio del front, y `next.config.ts` lo reescribe (`rewrites`) hacia `${API_URL}/api/v1/...` en el servidor de Next.
  - `API_URL` se valida con Zod al arrancar (`src/shared/infrastructure/env.ts`, TF-5/TF-6): si falta, el build falla con un mensaje claro en vez de un rewrite inválido confuso.
  - El cliente HTTP (`src/shared/infrastructure/http/client.ts`) usa una `baseURL` relativa (`""`) y `withCredentials: true`, para que la cookie viaje siempre al mismo origen que sirvió la página.
- Consecuencias:
  - La cookie de sesión no necesita `Domain` ni `SameSite=None`: es una cookie normal de primer origen.
  - Cualquier endpoint nuevo de la API queda disponible en el front sin configuración adicional, porque el proxy reescribe todo `/api/v1/:path*`.
  - El front depende de que `API_URL` apunte al back correcto en cada ambiente (local, dev, prod); en Render se configura a mano por servicio (`render.yaml`, TF-6) porque el blueprint no resuelve URLs entre servicios de blueprints distintos.
  - Un error de red o un 4xx/5xx del back se normaliza a `AppError` en el interceptor de Axios (TF-4) antes de llegar a la UI, así que la UI nunca necesita saber si el error vino del proxy o del back.
