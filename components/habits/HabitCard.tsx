"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn, vibrate } from "@/lib/utils";
import { useHabitStats } from "@/hooks/useHabits";
import type { Habit } from "@/lib/types";
import { GlassCard } from "@/components/ui/GlassCard";

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
    <GlassCard className="space-y-3">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onEdit}
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl focus-ring"
          style={{ backgroundColor: `${habit.color}22` }}
          aria-label={`Edit ${habit.name}`}
        >
          {habit.icon}
        </button>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={onEdit}
            className="text-left focus-ring rounded-lg"
          >
            <h3 className="font-semibold">{habit.name}</h3>
          </button>
          <p className="text-sm text-[var(--muted)]">
            Streak <span className="tabular font-semibold text-[var(--text)]">{stats.current}</span>
            {" · "}
            Best <span className="tabular">{stats.best}</span>
          </p>
          <p className="text-xs text-[var(--muted)]">
            Week {stats.weekPct}% · Month {stats.monthPct}%
          </p>
        </div>
        <motion.button
          type="button"
          aria-pressed={stats.checked}
          aria-label={stats.checked ? "Uncheck habit" : "Check habit"}
          onClick={() => {
            vibrate(10);
            onToggle();
          }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 focus-ring transition",
            stats.checked
              ? "border-transparent text-white"
              : "border-[var(--glass-border)] bg-white/40 dark:bg-white/5",
          )}
          style={
            stats.checked
              ? { backgroundColor: habit.color, borderColor: habit.color }
              : undefined
          }
        >
          <motion.span
            key={stats.checked ? "on" : "off"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {stats.checked ? <Check className="h-7 w-7" /> : null}
          </motion.span>
        </motion.button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {stats.weekKeys.map((key, i) => {
          const on = !!stats.doneByDay[key];
          const isSelected = key === dateKey;
          return (
            <div key={key} className="text-center">
              <span className="mb-1 block text-[10px] font-semibold text-[var(--muted)]">
                {labels[i]}
              </span>
              <div
                className={cn(
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                  on ? "text-white" : "bg-black/5 dark:bg-white/10 text-[var(--muted)]",
                  isSelected && "ring-2 ring-primary ring-offset-1 ring-offset-transparent",
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
    </GlassCard>
  );
}
