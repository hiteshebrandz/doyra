"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

/** Mobile bottom sheet with drag-to-dismiss. */
export function Sheet({ open, onClose, title, children, className }: SheetProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 80 || info.velocity.y > 500) onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] md:hidden">
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-label={title}
            className={cn(
              "absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-auto rounded-t-3xl glass p-4 pb-[calc(16px+var(--safe-bottom))]",
              className,
            )}
            initial={reduce ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={reduce ? undefined : { y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            drag={reduce ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={onDragEnd}
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-black/15 dark:bg-white/20" />
            {title ? (
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button
                  type="button"
                  aria-label="Close"
                  className="rounded-xl p-2 hover:bg-black/5 dark:hover:bg-white/10 focus-ring"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : null}
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

/** Desktop centered modal. */
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] hidden items-center justify-center p-6 md:flex">
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-label={title}
            className={cn(
              "relative w-full max-w-lg glass rounded-3xl p-6",
              className,
            )}
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
          >
            {title ? (
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{title}</h2>
                <button
                  type="button"
                  aria-label="Close"
                  className="rounded-xl p-2 hover:bg-black/5 dark:hover:bg-white/10 focus-ring"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : null}
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

/** Responsive: Sheet on mobile, Modal on desktop. */
export function ResponsiveDialog(props: SheetProps) {
  return (
    <>
      <Sheet {...props} />
      <Modal {...props} />
    </>
  );
}
