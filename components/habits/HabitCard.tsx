"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn, vibrate } from "@/lib/utils";
import { useHabitStats } from "@/hooks/useHabits";
import type { Habit } from "@/lib/types";

const WEEK_LABELS_MON = ["M", "T", "W", "T", "F", "S", "S"];
const WEEK_LABELS_SUN = ["S", "M", "T", "W", "T", "F", "S"];

export function HabitCard({
  habit,
  dateKey,
  weekStart,
  onToggle,
  onEdit,
}: {
  habit: Habit;
  dateKey: string;
  weekStart: 0 | 1;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const stats = useHabitStats(habit.id, dateKey);
  const labels = weekStart === 1 ? WEEK_LABELS_MON : WEEK_LABELS_SUN;

  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl shadow-sm focus-ring"
            style={{ backgroundColor: `${habit.color}22` }}
            aria-label={`Edit ${habit.name}`}
          >
            {habit.icon}
          </button>
          <div className="flex flex-col min-w-0">
            <button
              type="button"
              onClick={onEdit}
              className="text-left focus-ring rounded-lg"
            >
              <span
                className={cn(
                  "font-semibold text-on-surface truncate block",
                  stats.checked && "line-through opacity-70",
                )}
              >
                {habit.name}
              </span>
            </button>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[0.6875rem] font-semibold text-primary">
                {stats.current} days 🔥
              </span>
              <span className="text-outline-variant text-[0.6875rem]">•</span>
              <span className="text-[0.6875rem] text-on-surface-variant">
                {stats.monthPct}% monthly
              </span>
            </div>
          </div>
        </div>
        <motion.button
          type="button"
          aria-pressed={stats.checked}
          aria-label={stats.checked ? "Uncheck habit" : "Check habit"}
          onClick={() => {
            vibrate(10);
            onToggle();
          }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-transform focus-ring",
            stats.checked
              ? "bg-primary text-on-primary shadow-md shadow-primary/30"
              : "bg-surface-container text-on-surface-variant",
          )}
        >
          {stats.checked ? <Check className="h-[22px] w-[22px]" /> : null}
        </motion.button>
      </div>

      <div className="mt-3 flex items-center gap-1.5 pt-2">
        <div className="h-1.5 flex-1 rounded-full bg-surface-container-highest overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${stats.monthPct}%` }}
          />
        </div>
        <span className="text-[0.6875rem] text-on-surface-variant">{stats.monthPct}%</span>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {stats.weekKeys.map((key, i) => {
          const on = !!stats.doneByDay[key];
          const isSelected = key === dateKey;
          return (
            <div key={key} className="text-center">
              <span className="mb-1 block text-[10px] font-semibold text-on-surface-variant">
                {labels[i]}
              </span>
              <div
                className={cn(
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                  on
                    ? "text-white"
                    : "bg-surface-container text-on-surface-variant",
                  isSelected && "ring-2 ring-primary ring-offset-1 ring-offset-surface",
                )}
                style={on ? { backgroundColor: habit.color } : undefined}
                aria-label={`${key}${on ? " done" : ""}`}
              >
                {key.slice(8)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
