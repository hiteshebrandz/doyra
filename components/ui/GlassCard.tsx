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
        "glass-panel rounded-3xl p-5 md:p-6 transition duration-200",
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
