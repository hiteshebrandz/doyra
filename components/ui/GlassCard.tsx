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
        "card-surface rounded-2xl p-4 md:p-5",
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
