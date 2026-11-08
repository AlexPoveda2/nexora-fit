import * as React from "react";
import { cn } from "cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // h-11 (44px) y text-base (16px) SIEMPRE, incluso en escritorio: con menos, Safari en
        // iPhone hace zoom al tocar el campo (spec Input del design system).
        "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-danger aria-invalid:ring-danger/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:ring-danger/40 h-11 w-full min-w-0 rounded-lg border bg-transparent px-3 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
