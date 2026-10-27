"use client";

import { useEffect } from "react";
import { syncTaskReminders } from "@/lib/task-reminders";
import { useAppStore } from "@/store/app-store";

/** Schedules phone reminders in the Android app. Does nothing in the browser. */
export function TaskReminders() {
  const hydrated = useAppStore((s) => s.hydrated);
  const tasks = useAppStore((s) => s.tasks);

  useEffect(() => {
    if (!hydrated) return;
    void syncTaskReminders(Object.values(tasks));
  }, [hydrated, tasks]);

  return null;
}
