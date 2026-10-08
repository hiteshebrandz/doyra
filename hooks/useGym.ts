"use client";

import { useEffect, useMemo } from "react";
import { addDays, toDateKey, toMonthKey } from "@/lib/dates";
import { useAppStore } from "@/store/app-store";

export function useGym() {
  const plan = useAppStore((state) => state.gymPlan);
  const logs = useAppStore((state) => state.gymLogs);
  const setPlan = useAppStore((state) => state.setGymPlan);
  const toggleWorkout = useAppStore((state) => state.toggleGymWorkout);
  const updateLog = useAppStore((state) => state.updateGymLog);
  const flushNow = useAppStore((state) => state.flushNow);
  const ensureGymMonthLoaded = useAppStore((state) => state.ensureGymMonthLoaded);

  const today = toDateKey();
  const todayDay = new Date(`${today}T12:00:00`).getDay();
  const todayWorkout = plan?.days.find((day) => day.dayOfWeek === todayDay) ?? null;
  const week = useMemo(() => {
    const start = new Date(`${today}T12:00:00`);
    return Array.from({ length: 7 }, (_, index) => {
      const dateKey = toDateKey(addDays(start, index));
      return {
        dateKey,
        day: plan?.days.find((item) => item.dayOfWeek === new Date(`${dateKey}T12:00:00`).getDay()) ?? null,
        log: logs[dateKey],
      };
    });
  }, [logs, plan, today]);

  useEffect(() => {
    void ensureGymMonthLoaded(toMonthKey());
  }, [ensureGymMonthLoaded]);

  return {
    plan,
    logs,
    today,
    todayWorkout,
    week,
    setPlan,
    toggleWorkout,
    updateLog,
    flushNow,
  };
}
