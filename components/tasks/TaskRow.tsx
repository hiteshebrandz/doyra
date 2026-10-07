"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Check, Trash2, Pencil, Clock } from "lucide-react";
import { cn, vibrate } from "@/lib/utils";
import { isOverdue } from "@/lib/dates";
import type { Task } from "@/lib/types";

const priorityBadge: Record<Task["priority"], string> = {
  low: "bg-tertiary-fixed/40 text-tertiary",
  medium: "bg-primary-fixed text-primary",
  high: "bg-error text-on-error",
};

export function TaskRow({
  task,
  onToggle,
  onDelete,
  onEdit,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const x = useMotionValue(0);
  const bg = useTransform(
    x,
    [-120, 0, 120],
    ["rgba(186,26,26,0.15)", "transparent", "rgba(0,108,73,0.15)"],
  );
  const overdue = isOverdue(task.dueDate, task.done);
  const [dragging, setDragging] = useState(false);
  const locked = useRef(false);

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl"
      style={{ backgroundColor: bg }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-tertiary">
        <Check className="h-5 w-5" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-error">
        <Trash2 className="h-5 w-5" />
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        style={{ x }}
        onDragStart={() => {
          setDragging(true);
          locked.current = false;
        }}
        onDragEnd={(_, info) => {
          setDragging(false);
          if (locked.current) return;
          if (info.offset.x > 90) {
            locked.current = true;
            vibrate(12);
            onToggle();
          } else if (info.offset.x < -90) {
            locked.current = true;
            vibrate(18);
            onDelete();
          }
          void animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
        }}
        className={cn(
          "relative flex flex-col p-4 rounded-xl bg-surface-container-lowest shadow-[0_4px_16px_rgba(70,72,212,0.06),0_1px_3px_rgba(11,28,48,0.04)] transition-all",
          overdue && !task.done && "shadow-[0_4px_16px_rgba(186,26,26,0.08)]",
          task.done && "bg-surface opacity-80",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <button
              type="button"
              aria-label={task.done ? "Mark incomplete" : "Mark complete"}
              onClick={() => {
                vibrate(8);
                onToggle();
              }}
              className={cn(
                "mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition focus-ring flex-shrink-0",
                task.done
                  ? "bg-primary text-on-primary shadow-[0_0_12px_rgba(70,72,212,0.35)]"
                  : "bg-surface-container text-transparent hover:text-outline",
              )}
            >
              {task.done ? <Check className="h-3.5 w-3.5" /> : null}
            </button>

            <button
              type="button"
              className="min-w-0 flex-1 text-left focus-ring rounded-lg"
              onClick={() => {
                if (!dragging) onEdit();
              }}
            >
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {overdue && !task.done ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-error font-semibold text-[0.6875rem]">
                    <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                    Overdue
                  </span>
                ) : null}
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full font-semibold text-[0.6875rem] capitalize",
                    priorityBadge[task.priority],
                  )}
                >
                  {task.priority} Priority
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold text-[0.6875rem] capitalize">
                  {task.type}
                </span>
              </div>
              <h2
                className={cn(
                  "font-semibold tracking-tight leading-snug text-on-surface",
                  task.done && "line-through opacity-60",
                )}
              >
                {task.title}
              </h2>
              {task.notes ? (
                <p className="mt-1 text-sm text-on-surface-variant line-clamp-2">
                  {task.notes}
                </p>
              ) : null}
            </button>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              aria-label="Edit task"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors focus-ring"
              onClick={() => onEdit()}
            >
              <Pencil className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              aria-label="Delete task"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container transition-colors focus-ring"
              onClick={() => onDelete()}
            >
              <Trash2 className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        {task.dueDate ? (
          <div className="mt-3.5 pt-3 flex items-center justify-between bg-surface-container-low/60 -mx-4 -mb-4 px-4 py-2.5 rounded-b-xl">
            <div
              className={cn(
                "flex items-center gap-1.5 font-semibold text-[0.6875rem]",
                overdue && !task.done ? "text-error" : "text-on-surface-variant",
              )}
            >
              <Clock className="h-4 w-4" />
              <span>{task.dueDate}</span>
            </div>
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
