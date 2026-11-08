import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// Ícono de 24px, título, una línea de explicación y una acción opcional (spec EmptyState).
type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <Icon className="text-muted-foreground size-6" aria-hidden />
      <p className="text-xl font-medium">{title}</p>
      {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
