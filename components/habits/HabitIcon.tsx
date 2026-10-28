import { createElement } from "react";
import { resolveHabitIcon } from "@/lib/habit-icons";
import { cn } from "@/lib/utils";

/**
 * Renders a habit's icon. Accepts a Lucide key or a legacy emoji; unknown
 * values fall back to the raw text so no habit ever shows blank.
 */
export function HabitIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const lucide = resolveHabitIcon(icon);
  if (lucide) {
    return createElement(lucide, {
      className: cn("h-5 w-5", className),
      "aria-hidden": true,
    });
  }
  return (
    <span className={cn("text-base leading-none", className)} aria-hidden>
      {icon}
    </span>
  );
}
