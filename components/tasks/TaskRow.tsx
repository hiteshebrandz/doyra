"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import { cn, vibrate } from "@/lib/utils";
import { isOverdue } from "@/lib/dates";
import type { Task } from "@/lib/types";

const priorityColor: Record<Task["priority"], string> = {
  low: "text-success",
  medium: "text-warning",
  high: "text-danger",
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
    ["rgba(239,68,68,0.2)", "transparent", "rgba(34,197,94,0.2)"],
  );
  const overdue = isOverdue(task.dueDate, task.done);
  const [dragging, setDragging] = useState(false);
  const locked = useRef(false);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl"
      style={{ backgroundColor: bg }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-success">
        <Check className="h-5 w-5" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-danger">
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
          "glass relative flex items-center gap-3 rounded-2xl p-3.5",
          overdue && "border-l-4 border-l-danger",
          task.done && "opacity-70",
        )}
      >
        <button
          type="button"
          aria-label={task.done ? "Mark incomplete" : "Mark complete"}
          onClick={() => {
            vibrate(8);
            onToggle();
          }}
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition focus-ring",
            task.done
              ? "border-success bg-success text-white"
              : "border-[var(--muted)]",
          )}
        >
          {task.done ? <Check className="h-4 w-4" /> : null}
        </button>

        <button
          type="button"
          className="min-w-0 flex-1 text-left focus-ring rounded-xl"
          onClick={() => {
            if (!dragging) onEdit();
          }}
        >
          <p
            className={cn(
              "font-semibold leading-snug",
              task.done && "line-through opacity-60",
            )}
          >
            {task.title}
          </p>
          <small className="mt-0.5 block text-[var(--muted)]">
            <span
              className={cn(
                "capitalize font-semibold",
                priorityColor[task.priority],
              )}
            >
              {task.priority}
            </span>
            {" · "}
            <span className="capitalize">{task.type}</span>
            {task.dueDate ? ` · ${task.dueDate}` : null}
            {overdue ? (
              <span className="ml-1 font-semibold text-danger">Overdue</span>
            ) : null}
          </small>
        </button>
      </motion.div>
    </motion.div>
  );
}
