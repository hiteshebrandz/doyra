"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "glow-button border border-transparent font-bold",
  secondary:
    "border border-outline-variant bg-transparent text-on-surface hover:border-primary hover:bg-surface-container-low",
  ghost:
    "bg-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface border-transparent",
  danger: "bg-error text-on-error hover:brightness-110 border-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-[10px]",
  md: "h-11 px-4 text-[15px] rounded-2xl",
  lg: "h-12 px-5 text-[15px] rounded-2xl",
  icon: "h-11 w-11 rounded-full inline-flex items-center justify-center",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl font-bold transition duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-ring",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : null}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
