"use client";

import { useEffect } from "react";

import { errorMessage } from "@/shared/lib/error-messages";
import { ErrorState } from "@/shared/ui/error-state";

// Límite de errores de toda la app (guía front §15.1). Sentry llega después; por ahora
// queda en consola para no perder la traza mientras se desarrolla.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <ErrorState message={errorMessage(error)} onRetry={reset} />
    </div>
  );
}
