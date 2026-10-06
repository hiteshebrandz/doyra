"use client";

import { useMemo } from "react";
import { daysInMonth, toDateKey, toMonthKey } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { Habit } from "@/lib/types";

export function HabitHeatmap({
  habits,
  logs,
  month = toMonthKey(),
}: {
  habits: Habit[];
  logs: Record<string, Record<string, Record<string, boolean>>>;
  month?: string;
}) {
  const year = Number(month.slice(0, 4));
  const monthIndex = Number(month.slice(5, 7)) - 1;
  const totalDays = daysInMonth(year, monthIndex);
  const today = toDateKey();
  const activeIds = habits.filter((h) => !h.archived).map((h) => h.id);

  const cells = useMemo(() => {
    return Array.from({ length: totalDays }, (_, i) => {
      const day = String(i + 1).padStart(2, "0");
      const key = `${month}-${day}`;
      const dayLog = logs[month]?.[day] ?? {};
      const done = activeIds.filter((id) => dayLog[id]).length;
      const ratio = activeIds.length ? done / activeIds.length : 0;
      return { key, day, done, ratio, isToday: key === today };
    });
  }, [totalDays, month, logs, activeIds, today]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">Monthly heatmap</h3>
        <span className="text-xs text-[var(--muted)]">{month}</span>
      </div>
      <div
        className="grid grid-cols-7 gap-1.5 sm:grid-cols-10 md:grid-cols-11"
        role="img"
        aria-label="Habit completion heatmap for the month"
      >
        {cells.map((c) => (
          <div
            key={c.key}
            title={`${c.key}: ${c.done}/${activeIds.length}`}
            className={cn(
              "aspect-square rounded-md transition",
              c.isToday && "ring-2 ring-primary",
            )}
            style={{
              backgroundColor:
                c.ratio === 0
                  ? "rgba(0,0,0,0.06)"
                  : `rgba(99, 102, 241, ${0.2 + c.ratio * 0.8})`,
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]">
        <span>Less</span>
        <span className="h-3 w-3 rounded-sm bg-black/10 dark:bg-white/10" />
        <span
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: "rgba(99,102,241,0.4)" }}
        />
        <span
          className="h-3 w-3 rounded-sm"
          style={{ backgroundColor: "rgba(99,102,241,0.85)" }}
        />
        <span>More</span>
      </div>
    </div>
  );
}
