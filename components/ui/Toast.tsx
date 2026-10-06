"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

type ToastContextValue = {
  toast: (t: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const reduce = useReducedMotion();

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<ToastItem, "id">) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setItems((prev) => [...prev, { ...t, id }]);
      window.setTimeout(() => dismiss(id), 4500);
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--tabbar-h)+var(--safe-bottom)+12px)] z-[80] flex flex-col items-center gap-2 px-4 md:bottom-6 md:items-end"
        aria-live="polite"
      >
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: 8 }}
              className={cn(
                "pointer-events-auto glass flex w-full max-w-sm items-start gap-3 rounded-2xl p-3.5",
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm">{item.title}</p>
                {item.description ? (
                  <p className="text-sm text-[var(--muted)]">{item.description}</p>
                ) : null}
                {item.actionLabel && item.onAction ? (
                  <button
                    type="button"
                    className="mt-1 text-sm font-semibold text-primary focus-ring rounded-lg"
                    onClick={() => {
                      item.onAction?.();
                      dismiss(item.id);
                    }}
                  >
                    {item.actionLabel}
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Dismiss"
                className="rounded-lg p-1 text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/10 focus-ring"
                onClick={() => dismiss(item.id)}
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
