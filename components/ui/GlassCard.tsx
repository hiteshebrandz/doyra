import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function GlassCard({
  className,
  children,
  hover,
  ...props
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "glass rounded-3xl p-4 md:p-5",
        hover &&
          "transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
