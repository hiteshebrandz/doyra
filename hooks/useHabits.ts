"use client";

import { useMemo } from "react";
import { useAppStore, selectActiveHabits } from "@/store/app-store";
import { computeStreak, flattenMonthLogs } from "@/lib/streaks";
import {
  toDateKey,
  toMonthKey,
  dayOfMonthKey,
  weekDayKeys,
  parseDateKey,
} from "@/lib/dates";

export function useHabits() {
  const habits = useAppStore((s) => s.habits);
  const logs = useAppStore((s) => s.logs);
  const settings = useAppStore((s) => s.settings);
  const addHabit = useAppStore((s) => s.addHabit);
  const updateHabit = useAppStore((s) => s.updateHabit);
  const archiveHabit = useAppStore((s) => s.archiveHabit);
  const toggleHabitCheckIn = useAppStore((s) => s.toggleHabitCheckIn);
  const ensureMonthLoaded = useAppStore((s) => s.ensureMonthLoaded);

  const active = useMemo(() => selectActiveHabits(habits), [habits]);

  return {
    habits,
    active,
    logs,
    weekStart: settings.weekStart,
    addHabit,
    updateHabit,
    archiveHabit,
    toggleHabitCheckIn,
    ensureMonthLoaded,
  };
}

export function useHabitStats(habitId: string, dateKey = toDateKey()) {
  const logs = useAppStore((s) => s.logs);
  const weekStart = useAppStore((s) => s.settings.weekStart);

  return useMemo(() => {
    const doneByDay = flattenMonthLogs(logs, habitId);
    const streaks = computeStreak(habitId, doneByDay, parseDateKey(dateKey));
    const weekKeys = weekDayKeys(parseDateKey(dateKey), weekStart);
    const weekDone = weekKeys.filter((k) => doneByDay[k]).length;
    const month = dateKey.slice(0, 7);
    const monthDays = logs[month] ?? {};
    const daysInMonth = Object.keys(monthDays).length
      ? new Date(
          Number(month.slice(0, 4)),
          Number(month.slice(5, 7)),
          0,
        ).getDate()
      : new Date(
          Number(dateKey.slice(0, 4)),
          Number(dateKey.slice(5, 7)),
          0,
        ).getDate();
    let monthDone = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${month}-${String(d).padStart(2, "0")}`;
      if (doneByDay[key]) monthDone += 1;
    }
    const checked =
      !!logs[toMonthKey(parseDateKey(dateKey))]?.[dayOfMonthKey(parseDateKey(dateKey))]?.[
        habitId
      ];

    return {
      ...streaks,
      weekDone,
      weekPct: Math.round((weekDone / 7) * 100),
      monthDone,
      monthPct: Math.round((monthDone / daysInMonth) * 100),
      weekKeys,
      doneByDay,
      checked,
    };
  }, [logs, habitId, dateKey, weekStart]);
}

export function useLogs() {
  const logs = useAppStore((s) => s.logs);
  const ensureMonthLoaded = useAppStore((s) => s.ensureMonthLoaded);
  const toggleHabitCheckIn = useAppStore((s) => s.toggleHabitCheckIn);
  return { logs, ensureMonthLoaded, toggleHabitCheckIn };
}
