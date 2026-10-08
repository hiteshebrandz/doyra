import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  writeBatch,
  deleteField,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { trackRead, trackWrite } from "@/lib/usage";
import {
  DEFAULT_SETTINGS,
  type ExportPayload,
  type Habit,
  type GymLog,
  type GymPlan,
  type MonthLogDoc,
  type Task,
  type UserSettings,
} from "@/lib/types";
import { toMonthKey } from "@/lib/dates";

/** Firestore document size soft-warning: rotate completed tasks before hitting ~1 MiB. */
export const DOC_SIZE_SOFT_LIMIT = 900_000;

function settingsRef(uid: string) {
  return doc(db, "users", uid, "meta", "settings");
}
function habitsRef(uid: string) {
  return doc(db, "users", uid, "meta", "habits");
}
function activeTasksRef(uid: string) {
  return doc(db, "users", uid, "tasks", "active");
}
function archiveRef(uid: string, month: string) {
  return doc(db, "users", uid, "tasks", `archive_${month}`);
}
function logRef(uid: string, month: string) {
  return doc(db, "users", uid, "logs", month);
}
function gymPlanRef(uid: string) {
  return doc(db, "users", uid, "gym", "active");
}
function gymLogRef(uid: string, month: string) {
  return doc(db, "users", uid, "gymLogs", month);
}

async function readDoc<T>(
  ref: DocumentReference,
  label: string,
): Promise<T | null> {
  const snap = await getDoc(ref);
  trackRead(1, label);
  if (!snap.exists()) return null;
  return snap.data() as T;
}

export async function loadInitialData(uid: string): Promise<{
  settings: UserSettings;
  habits: Habit[];
  tasks: Record<string, Task>;
  currentLog: MonthLogDoc["days"];
  currentMonth: string;
  gymPlan: GymPlan | null;
  gymLogs: Record<string, GymLog>;
}> {
  const month = toMonthKey();
  const [settingsSnap, habitsSnap, tasksSnap, logSnap, gymPlanSnap] = await Promise.all([
    readDoc<UserSettings>(settingsRef(uid), "settings"),
    readDoc<{ items: Habit[] }>(habitsRef(uid), "habits"),
    readDoc<{ items: Record<string, Task> }>(activeTasksRef(uid), "tasks/active"),
    readDoc<MonthLogDoc>(logRef(uid, month), `logs/${month}`),
    readDoc<{ plan: GymPlan }>(gymPlanRef(uid), "gym/active"),
  ]);

  const settings = settingsSnap ?? {
    ...DEFAULT_SETTINGS,
    createdAt: new Date().toISOString(),
  };

  // Bootstrap settings doc once if missing (1 write, first login only)
  if (!settingsSnap) {
    await setDoc(settingsRef(uid), settings, { merge: true });
    trackWrite(1, "settings bootstrap");
  }
  if (!habitsSnap) {
    await setDoc(habitsRef(uid), { items: [] }, { merge: true });
    trackWrite(1, "habits bootstrap");
  }
  if (!tasksSnap) {
    await setDoc(activeTasksRef(uid), { items: {} }, { merge: true });
    trackWrite(1, "tasks bootstrap");
  }

  return {
    settings,
    habits: habitsSnap?.items ?? [],
    tasks: tasksSnap?.items ?? {},
    currentLog: logSnap?.days ?? {},
    currentMonth: month,
    gymPlan: gymPlanSnap?.plan ?? null,
    gymLogs: {},
  };
}

export async function loadMonthLog(
  uid: string,
  month: string,
): Promise<MonthLogDoc["days"]> {
  const data = await readDoc<MonthLogDoc>(logRef(uid, month), `logs/${month}`);
  return data?.days ?? {};
}

export async function loadGymMonth(
  uid: string,
  month: string,
): Promise<Record<string, GymLog>> {
  const data = await readDoc<{ items: Record<string, GymLog> }>(
    gymLogRef(uid, month),
    `gymLogs/${month}`,
  );
  return data?.items ?? {};
}

export async function loadArchiveMonth(
  uid: string,
  month: string,
): Promise<Record<string, Task>> {
  const data = await readDoc<{ items: Record<string, Task> }>(
    archiveRef(uid, month),
    `archive_${month}`,
  );
  return data?.items ?? {};
}

export type PendingPatch = {
  settings?: Partial<UserSettings>;
  /** Full habits array replacement when structure changes (reorder/archive). Prefer field paths when possible. */
  habitsItems?: Habit[];
  taskFields?: Record<string, Task | null>; // null = delete
  logFields?: Record<string, boolean | null>; // path like "days.05.<habitId>"
  archiveMoves?: {
    month: string;
    tasks: Record<string, Task>;
    removeFromActive: string[];
  };
  gymPlan?: GymPlan | null;
  gymLogFields?: Record<string, GymLog | null>;
};

export async function flushPatches(
  uid: string,
  patch: PendingPatch,
): Promise<void> {
  const batch = writeBatch(db);
  let ops = 0;

  if (patch.settings && Object.keys(patch.settings).length > 0) {
    batch.set(settingsRef(uid), patch.settings, { merge: true });
    ops += 1;
  }

  if (patch.habitsItems) {
    batch.set(habitsRef(uid), { items: patch.habitsItems }, { merge: true });
    ops += 1;
  }

  if (patch.taskFields && Object.keys(patch.taskFields).length > 0) {
    const updates: Record<string, Task | ReturnType<typeof deleteField>> = {};
    for (const [id, task] of Object.entries(patch.taskFields)) {
      updates[`items.${id}`] = task === null ? deleteField() : task;
    }
    // Ensure parent doc exists before field-path updates
    batch.set(activeTasksRef(uid), { items: {} }, { merge: true });
    batch.update(activeTasksRef(uid), updates);
    ops += 2;
  }

  if (patch.logFields && Object.keys(patch.logFields).length > 0) {
    // Group by month from path "YYYY-MM.DD.habitId" stored as composite keys
    const byMonth: Record<string, Record<string, boolean | ReturnType<typeof deleteField>>> = {};
    for (const [path, value] of Object.entries(patch.logFields)) {
      // path format: month|day|habitId
      const [month, day, habitId] = path.split("|");
      if (!byMonth[month]) byMonth[month] = {};
      byMonth[month][`days.${day}.${habitId}`] =
        value === null ? deleteField() : value;
    }
    for (const [month, fields] of Object.entries(byMonth)) {
      const ref = logRef(uid, month);
      // Ensure doc exists then update field paths
      batch.set(ref, { days: {} }, { merge: true });
      batch.update(ref, fields);
      ops += 2;
    }
  }

  if (patch.archiveMoves) {
    const { month, tasks, removeFromActive } = patch.archiveMoves;
    const aRef = archiveRef(uid, month);
    const archiveFields: Record<string, Task> = {};
    for (const [id, task] of Object.entries(tasks)) {
      archiveFields[`items.${id}`] = task;
    }
    batch.set(aRef, { items: {} }, { merge: true });
    if (Object.keys(archiveFields).length) {
      batch.update(aRef, archiveFields);
    }
    const removals: Record<string, ReturnType<typeof deleteField>> = {};
    for (const id of removeFromActive) {
      removals[`items.${id}`] = deleteField();
    }
    if (Object.keys(removals).length) {
      batch.update(activeTasksRef(uid), removals);
    }
    ops += 3;
  }

  if (patch.gymPlan !== undefined) {
    if (patch.gymPlan === null) batch.delete(gymPlanRef(uid));
    else batch.set(gymPlanRef(uid), { plan: patch.gymPlan }, { merge: true });
    ops += 1;
  }

  if (patch.gymLogFields && Object.keys(patch.gymLogFields).length > 0) {
    const byMonth: Record<string, Record<string, GymLog | ReturnType<typeof deleteField>>> = {};
    for (const [path, value] of Object.entries(patch.gymLogFields)) {
      const [month, day] = path.split("|");
      if (!byMonth[month]) byMonth[month] = {};
      byMonth[month][`items.${day}`] = value === null ? deleteField() : value;
    }
    for (const [month, fields] of Object.entries(byMonth)) {
      const ref = gymLogRef(uid, month);
      batch.set(ref, { items: {} }, { merge: true });
      batch.update(ref, fields);
      ops += 2;
    }
  }

  if (ops === 0) return;
  await batch.commit();
  trackWrite(ops, "flushPatches");
}

export async function importData(
  uid: string,
  payload: ExportPayload,
): Promise<void> {
  const batch = writeBatch(db);
  batch.set(settingsRef(uid), payload.settings, { merge: true });
  batch.set(habitsRef(uid), { items: payload.habits }, { merge: true });
  batch.set(activeTasksRef(uid), { items: payload.tasks }, { merge: true });
  if (payload.gym?.plan) batch.set(gymPlanRef(uid), { plan: payload.gym.plan }, { merge: true });

  let count = 3;
  for (const [month, days] of Object.entries(payload.logs ?? {})) {
    batch.set(logRef(uid, month), { days }, { merge: true });
    count += 1;
  }
  for (const [month, items] of Object.entries(payload.archives ?? {})) {
    batch.set(archiveRef(uid, month), { items }, { merge: true });
    count += 1;
  }
  for (const [month, logs] of Object.entries(payload.gym?.logs ?? {})) {
    batch.set(gymLogRef(uid, month), { items: logs }, { merge: true });
    count += 1;
  }
  if (payload.gym?.plan) count += 1;

  await batch.commit();
  trackWrite(count, "importData");
}

export async function deleteAllUserData(
  uid: string,
  months: string[],
): Promise<void> {
  // Client SDK cannot list subcollections; delete known docs.
  const batch = writeBatch(db);
  batch.set(settingsRef(uid), {}, { merge: false });
  batch.delete(settingsRef(uid));
  batch.delete(habitsRef(uid));
  batch.delete(activeTasksRef(uid));
  batch.delete(gymPlanRef(uid));
  let count = 4;
  for (const month of months) {
    batch.delete(logRef(uid, month));
    batch.delete(archiveRef(uid, month));
    batch.delete(gymLogRef(uid, month));
    count += 3;
  }
  await batch.commit();
  trackWrite(count, "deleteAllUserData");
}

export async function patchSettings(
  uid: string,
  partial: Partial<UserSettings>,
): Promise<void> {
  await setDoc(settingsRef(uid), partial, { merge: true });
  trackWrite(1, "patchSettings");
}

export async function updateTaskField(
  uid: string,
  taskId: string,
  task: Task | null,
): Promise<void> {
  if (task === null) {
    await updateDoc(activeTasksRef(uid), { [`items.${taskId}`]: deleteField() });
  } else {
    await updateDoc(activeTasksRef(uid), { [`items.${taskId}`]: task });
  }
  trackWrite(1, `task ${taskId}`);
}
