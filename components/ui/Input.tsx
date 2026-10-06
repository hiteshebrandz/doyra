"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full min-h-11 rounded-2xl border border-[var(--glass-border)] bg-white/70 dark:bg-white/5 px-4 py-2.5 text-[16px] text-[var(--text)] placeholder:text-[var(--muted)] focus-ring outline-none",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full min-h-[96px] rounded-2xl border border-[var(--glass-border)] bg-white/70 dark:bg-white/5 px-4 py-3 text-[16px] text-[var(--text)] placeholder:text-[var(--muted)] focus-ring outline-none resize-y",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-1.5 block text-sm font-medium text-[var(--muted)]",
        className,
      )}
    >
      {children}
    </label>
  );
}
