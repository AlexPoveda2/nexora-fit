"use client";

import { useQuery } from "@tanstack/react-query";

import { useContainer } from "@/core/use-container";
import { errorMessage } from "@/shared/lib/error-messages";
import { ErrorState } from "@/shared/ui/error-state";
import { Skeleton } from "@/shared/ui/skeleton";

import { getHealth } from "../application/get-health";

// Componente temporal para verificar el proxy /api/v1 end to end (TF-4), y primer uso real
// de Skeleton/ErrorState (TF-9). HUF-3 lo retira.
export function HealthStatus() {
  const { health } = useContainer();
  const query = useQuery({
    queryKey: ["health"],
    queryFn: () => getHealth(health),
  });

  if (query.isPending) return <Skeleton className="h-5 w-64" />;
  if (query.isError) {
    return <ErrorState message={errorMessage(query.error)} onRetry={() => query.refetch()} />;
  }

  return (
    <p data-testid="health-status">
      API: {query.data.status} · base de datos: {query.data.database}
    </p>
  );
}
