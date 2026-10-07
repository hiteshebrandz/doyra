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
      "w-full min-h-11 rounded-xl border border-transparent bg-surface-container-low px-4 py-2.5 text-[16px] text-on-surface placeholder:text-outline-variant outline-none transition-all",
      "focus:bg-surface-container-lowest focus:shadow-[0_0_0_3px_var(--ring)]",
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
      "w-full min-h-[96px] rounded-xl border border-transparent bg-surface-container-low px-4 py-3 text-[16px] text-on-surface placeholder:text-outline-variant outline-none resize-y transition-all",
      "focus:bg-surface-container-lowest focus:shadow-[0_0_0_3px_var(--ring)]",
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
        "mb-1.5 block text-sm font-semibold text-on-surface",
        className,
      )}
    >
      {children}
    </label>
  );
}
