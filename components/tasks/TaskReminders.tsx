"use client";

import { useEffect } from "react";
import { syncTaskReminders } from "@/lib/task-reminders";
import { useAppStore } from "@/store/app-store";

/** Schedules phone reminders in the Android app. Does nothing in the browser. */
export function TaskReminders() {
  const hydrated = useAppStore((s) => s.hydrated);
  const tasks = useAppStore((s) => s.tasks);
  const habits = useAppStore((s) => s.habits);
  const logs = useAppStore((s) => s.logs);

  useEffect(() => {
    if (!hydrated) return;
    void syncTaskReminders(Object.values(tasks), habits, logs);
  }, [hydrated, tasks, habits, logs]);

  return null;
}
