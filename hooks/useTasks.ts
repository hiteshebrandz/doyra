"use client";

import { useMemo } from "react";
import { useAppStore, selectTasksList } from "@/store/app-store";
import { isOverdue, toDateKey } from "@/lib/dates";
import type { Task, TaskPriority, TaskType } from "@/lib/types";

export function useTasks() {
  const tasksMap = useAppStore((s) => s.tasks);
  const addTask = useAppStore((s) => s.addTask);
  const updateTask = useAppStore((s) => s.updateTask);
  const toggleTaskDone = useAppStore((s) => s.toggleTaskDone);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const restoreTask = useAppStore((s) => s.restoreTask);

  const tasks = useMemo(() => selectTasksList(tasksMap), [tasksMap]);

  return {
    tasks,
    tasksMap,
    addTask,
    updateTask,
    toggleTaskDone,
    deleteTask,
    restoreTask,
  };
}

export type TaskFilters = {
  tab: TaskType | "all";
  status: "all" | "open" | "done";
  priority: TaskPriority | "all";
  query: string;
  sort: "due" | "priority" | "created";
};

export function filterSortTasks(tasks: Task[], f: TaskFilters): Task[] {
  const today = toDateKey();
  let list = tasks.filter((t) => {
    if (f.tab !== "all" && t.type !== f.tab) return false;
    if (f.status === "open" && t.done) return false;
    if (f.status === "done" && !t.done) return false;
    if (f.priority !== "all" && t.priority !== f.priority) return false;
    if (f.query) {
      const q = f.query.toLowerCase();
      if (
        !t.title.toLowerCase().includes(q) &&
        !t.notes.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const pri = { high: 0, medium: 1, low: 2 };
  list = [...list].sort((a, b) => {
    if (f.sort === "priority") return pri[a.priority] - pri[b.priority];
    if (f.sort === "created")
      return b.createdAt.localeCompare(a.createdAt);
    // due: overdue first, then by date, nulls last
    const ad = a.dueDate ?? "9999";
    const bd = b.dueDate ?? "9999";
    if (a.done !== b.done) return a.done ? 1 : -1;
    return ad.localeCompare(bd);
  });

  void today;
  return list;
}

export function taskCounts(tasks: Task[]) {
  const today = toDateKey();
  return {
    daily: tasks.filter((t) => t.type === "daily").length,
    weekly: tasks.filter((t) => t.type === "weekly").length,
    monthly: tasks.filter((t) => t.type === "monthly").length,
    all: tasks.length,
    today: tasks.filter((t) => !t.done && t.dueDate === today).length,
    pending: tasks.filter((t) => !t.done).length,
    completed: tasks.filter((t) => t.done).length,
    overdue: tasks.filter((t) => isOverdue(t.dueDate, t.done)).length,
  };
}
