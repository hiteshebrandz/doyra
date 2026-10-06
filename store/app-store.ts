"use client";

import { create } from "zustand";
import {
  flushPatches,
  loadInitialData,
  loadMonthLog,
  type PendingPatch,
  importData as dbImportData,
  deleteAllUserData,
} from "@/lib/db";
import { createId } from "@/lib/utils";
import {
  toDateKey,
  toMonthKey,
  addDays,
} from "@/lib/dates";
import type {
  ExportPayload,
  Habit,
  Task,
  TaskPriority,
  TaskType,
  UserSettings,
} from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";

type LogMonths = Record<string, Record<string, Record<string, boolean>>>;

type AppState = {
  uid: string | null;
  hydrated: boolean;
  hydrating: boolean;
  offline: boolean;
  error: string | null;
  settings: UserSettings;
  habits: Habit[];
  tasks: Record<string, Task>;
  logs: LogMonths;
  pending: PendingPatch;
  flushTimer: ReturnType<typeof setTimeout> | null;

  hydrate: (uid: string) => Promise<void>;
  reset: () => void;
  setOffline: (v: boolean) => void;
  queueFlush: () => void;
  flushNow: () => Promise<void>;

  updateSettings: (partial: Partial<UserSettings>) => void;

  addHabit: (data: Omit<Habit, "id" | "createdAt" | "archived">) => void;
  updateHabit: (id: string, data: Partial<Habit>) => void;
  archiveHabit: (id: string) => void;

  addTask: (data: {
    title: string;
    notes?: string;
    type: TaskType;
    priority: TaskPriority;
    dueDate?: string | null;
  }) => string;
  updateTask: (id: string, data: Partial<Task>) => void;
  toggleTaskDone: (id: string) => void;
  deleteTask: (id: string) => Task | null;
  restoreTask: (task: Task) => void;
  rotateOldCompleted: () => void;

  toggleHabitCheckIn: (habitId: string, dateKey: string) => void;
  ensureMonthLoaded: (month: string) => Promise<void>;

  exportJson: () => ExportPayload;
  importJson: (payload: ExportPayload) => Promise<void>;
  deleteMyData: () => Promise<void>;
};

const emptyPending = (): PendingPatch => ({});

function mergePending(a: PendingPatch, b: PendingPatch): PendingPatch {
  return {
    settings: { ...a.settings, ...b.settings },
    habitsItems: b.habitsItems ?? a.habitsItems,
    taskFields: { ...a.taskFields, ...b.taskFields },
    logFields: { ...a.logFields, ...b.logFields },
    archiveMoves: b.archiveMoves ?? a.archiveMoves,
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  uid: null,
  hydrated: false,
  hydrating: false,
  offline: typeof navigator !== "undefined" ? !navigator.onLine : false,
  error: null,
  settings: { ...DEFAULT_SETTINGS },
  habits: [],
  tasks: {},
  logs: {},
  pending: emptyPending(),
  flushTimer: null,

  hydrate: async (uid: string) => {
    if (get().hydrating && get().uid === uid) return;
    set({ hydrating: true, error: null, uid });
    try {
      const data = await loadInitialData(uid);
      set({
        settings: data.settings,
        habits: data.habits,
        tasks: data.tasks,
        logs: { [data.currentMonth]: data.currentLog },
        hydrated: true,
        hydrating: false,
      });
      // Rotate completed tasks older than 30 days (client-side archival)
      get().rotateOldCompleted();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load data";
      set({ error: message, hydrating: false, hydrated: true });
    }
  },

  reset: () => {
    const timer = get().flushTimer;
    if (timer) clearTimeout(timer);
    set({
      uid: null,
      hydrated: false,
      hydrating: false,
      error: null,
      settings: { ...DEFAULT_SETTINGS },
      habits: [],
      tasks: {},
      logs: {},
      pending: emptyPending(),
      flushTimer: null,
    });
  },

  setOffline: (v) => set({ offline: v }),

  queueFlush: () => {
    const existing = get().flushTimer;
    if (existing) clearTimeout(existing);
    const timer = setTimeout(() => {
      void get().flushNow();
    }, 1000);
    set({ flushTimer: timer });
  },

  flushNow: async () => {
    const { uid, pending, flushTimer } = get();
    if (flushTimer) clearTimeout(flushTimer);
    set({ flushTimer: null, pending: emptyPending() });
    if (!uid) return;
    const hasWork =
      (pending.settings && Object.keys(pending.settings).length > 0) ||
      pending.habitsItems ||
      (pending.taskFields && Object.keys(pending.taskFields).length > 0) ||
      (pending.logFields && Object.keys(pending.logFields).length > 0) ||
      pending.archiveMoves;
    if (!hasWork) return;
    try {
      await flushPatches(uid, pending);
    } catch (e) {
      // Re-queue failed patch
      set((s) => ({
        pending: mergePending(pending, s.pending),
        error: e instanceof Error ? e.message : "Sync failed",
      }));
      get().queueFlush();
    }
  },

  updateSettings: (partial) => {
    set((s) => ({
      settings: { ...s.settings, ...partial },
      pending: mergePending(s.pending, { settings: partial }),
    }));
    get().queueFlush();
  },

  addHabit: (data) => {
    const habit: Habit = {
      ...data,
      id: createId(),
      createdAt: new Date().toISOString(),
      archived: false,
    };
    set((s) => {
      const habits = [...s.habits, habit];
      return {
        habits,
        pending: mergePending(s.pending, { habitsItems: habits }),
      };
    });
    get().queueFlush();
  },

  updateHabit: (id, data) => {
    set((s) => {
      const habits = s.habits.map((h) => (h.id === id ? { ...h, ...data } : h));
      return {
        habits,
        pending: mergePending(s.pending, { habitsItems: habits }),
      };
    });
    get().queueFlush();
  },

  archiveHabit: (id) => {
    get().updateHabit(id, { archived: true });
  },

  addTask: ({ title, notes = "", type, priority, dueDate = toDateKey() }) => {
    const id = createId();
    const task: Task = {
      id,
      title,
      notes,
      type,
      priority,
      dueDate: dueDate ?? null,
      done: false,
      doneAt: null,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({
      tasks: { ...s.tasks, [id]: task },
      pending: mergePending(s.pending, { taskFields: { [id]: task } }),
    }));
    get().queueFlush();
    return id;
  },

  updateTask: (id, data) => {
    set((s) => {
      const prev = s.tasks[id];
      if (!prev) return s;
      const task = { ...prev, ...data };
      return {
        tasks: { ...s.tasks, [id]: task },
        pending: mergePending(s.pending, { taskFields: { [id]: task } }),
      };
    });
    get().queueFlush();
  },

  toggleTaskDone: (id) => {
    const task = get().tasks[id];
    if (!task) return;
    const done = !task.done;
    get().updateTask(id, {
      done,
      doneAt: done ? new Date().toISOString() : null,
    });
  },

  deleteTask: (id) => {
    const task = get().tasks[id] ?? null;
    if (!task) return null;
    set((s) => {
      const tasks = { ...s.tasks };
      delete tasks[id];
      return {
        tasks,
        pending: mergePending(s.pending, { taskFields: { [id]: null } }),
      };
    });
    get().queueFlush();
    return task;
  },

  restoreTask: (task) => {
    set((s) => ({
      tasks: { ...s.tasks, [task.id]: task },
      pending: mergePending(s.pending, { taskFields: { [task.id]: task } }),
    }));
    get().queueFlush();
  },

  /**
   * Completed tasks older than 30 days move to archive_YYYY-MM.
   * Keeps active doc under the ~1 MiB Firestore document limit.
   * Note: Firestore docs max ~1 MiB — rotate promptly if active grows large.
   */
  rotateOldCompleted: () => {
    const cutoff = toDateKey(addDays(new Date(), -30));
    const byMonth: Record<string, Record<string, Task>> = {};

    for (const task of Object.values(get().tasks)) {
      if (!task.done || !task.doneAt) continue;
      const doneKey = toDateKey(new Date(task.doneAt));
      if (doneKey > cutoff) continue;
      const month = doneKey.slice(0, 7);
      if (!byMonth[month]) byMonth[month] = {};
      byMonth[month][task.id] = task;
    }

    const months = Object.keys(byMonth);
    if (!months.length) return;

    // Optimistically remove all rotated tasks from local active set
    set((s) => {
      const tasks = { ...s.tasks };
      for (const month of months) {
        for (const id of Object.keys(byMonth[month])) delete tasks[id];
      }
      const first = months[0];
      return {
        tasks,
        pending: mergePending(s.pending, {
          archiveMoves: {
            month: first,
            tasks: byMonth[first],
            removeFromActive: Object.keys(byMonth[first]),
          },
        }),
      };
    });
    get().queueFlush();

    months.slice(1).forEach((month, index) => {
      window.setTimeout(() => {
        set((s) => ({
          pending: mergePending(s.pending, {
            archiveMoves: {
              month,
              tasks: byMonth[month],
              removeFromActive: Object.keys(byMonth[month]),
            },
          }),
        }));
        get().queueFlush();
      }, 1500 * (index + 1));
    });
  },

  toggleHabitCheckIn: (habitId, dateKey) => {
    const month = dateKey.slice(0, 7);
    const day = dateKey.slice(8, 10);
    set((s) => {
      const monthDays = { ...(s.logs[month] ?? {}) };
      const dayHabits = { ...(monthDays[day] ?? {}) };
      const currently = !!dayHabits[habitId];
      if (currently) delete dayHabits[habitId];
      else dayHabits[habitId] = true;
      monthDays[day] = dayHabits;
      const path = `${month}|${day}|${habitId}`;
      return {
        logs: { ...s.logs, [month]: monthDays },
        pending: mergePending(s.pending, {
          logFields: { [path]: currently ? null : true },
        }),
      };
    });
    get().queueFlush();
  },

  ensureMonthLoaded: async (month: string) => {
    const { uid, logs } = get();
    if (!uid || logs[month] !== undefined) return;
    try {
      const days = await loadMonthLog(uid, month);
      set((s) => ({ logs: { ...s.logs, [month]: days } }));
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to load month",
      });
    }
  },

  exportJson: () => {
    const { settings, habits, tasks, logs } = get();
    const payload: ExportPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings,
      habits,
      tasks,
      logs: Object.fromEntries(
        Object.entries(logs).map(([m, days]) => [m, days]),
      ),
      archives: {},
    };
    return payload;
  },

  importJson: async (payload: ExportPayload) => {
    const uid = get().uid;
    if (!uid) throw new Error("Not signed in");
    await get().flushNow();
    await dbImportData(uid, payload);
    set({
      settings: payload.settings,
      habits: payload.habits,
      tasks: payload.tasks,
      logs: payload.logs ?? {},
      pending: emptyPending(),
    });
  },

  deleteMyData: async () => {
    const uid = get().uid;
    if (!uid) return;
    await get().flushNow();
    const months = new Set<string>([
      ...Object.keys(get().logs),
      toMonthKey(),
      toMonthKey(addDays(new Date(), -30)),
      toMonthKey(addDays(new Date(), -60)),
    ]);
    await deleteAllUserData(uid, [...months]);
    get().reset();
  },
}));

// Flush on page hide / visibility change
if (typeof window !== "undefined") {
  const flush = () => {
    void useAppStore.getState().flushNow();
  };
  window.addEventListener("pagehide", flush);
  window.addEventListener("beforeunload", flush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("online", () =>
    useAppStore.getState().setOffline(false),
  );
  window.addEventListener("offline", () =>
    useAppStore.getState().setOffline(true),
  );
}

export function selectActiveHabits(habits: Habit[]): Habit[] {
  return habits.filter((h) => !h.archived);
}

export function selectTasksList(tasks: Record<string, Task>): Task[] {
  return Object.values(tasks);
}

