import { CircleAlert } from "lucide-react";

import { Button } from "@/shared/ui/button";

// CircleAlert en danger, el mensaje ya traducido por shared/lib/error-messages.ts y un botón
// "Reintentar" (spec ErrorState, UX.md). Las consultas lo usan; las mutaciones muestran
// su error junto al formulario, no aquí (guía front §15.1).
type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center" role="alert">
      <CircleAlert className="text-danger size-6" aria-hidden />
      <p className="text-muted-foreground text-sm">{message}</p>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          Reintentar
        </Button>
      ) : null}
    </div>
  );
}
