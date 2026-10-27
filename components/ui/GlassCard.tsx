import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

/** Elevated white card matching Calm Flow Level 1 surfaces. */
export function GlassCard({
  className,
  children,
  hover,
  ...props
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "glass-panel rounded-3xl p-4 md:p-5 transition duration-200",
        hover && "card-surface-hover active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export const Card = GlassCard;
