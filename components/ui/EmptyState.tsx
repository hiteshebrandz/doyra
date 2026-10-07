import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-bold text-on-surface">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-on-surface-variant">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
