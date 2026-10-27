import type { Habit, Task } from "@/lib/types";
import { isNativeApp } from "@/lib/native-app";
import { dayOfMonthKey, toMonthKey } from "@/lib/dates";

const CHANNEL_ID = "doyrai-reminders";

type DayLogs = Record<string, Record<string, Record<string, boolean>>>;

function notificationId(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  const id = Math.abs(hash) % 2147483646;
  return id === 0 ? 1 : id;
}

function clockParts(time: string): { hour: number; minute: number } | null {
  const [hour, minute] = time.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

/** The chosen date and time, when it is still in the future and the task is open. */
export function taskReminderAt(task: Task, now = new Date()): Date | null {
  if (task.done || !task.reminderTime) return null;
  const date = task.reminderDate || task.dueDate;
  const clock = clockParts(task.reminderTime);
  if (!date || !clock) return null;
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return null;
  const at = new Date(year, month - 1, day, clock.hour, clock.minute, 0, 0);
  if (at.getTime() <= now.getTime()) return null;
  return at;
}

/** Next daily habit reminder. Skips today when the habit is already checked. */
export function habitReminderAt(
  time: string,
  doneToday: boolean,
  now = new Date(),
): Date | null {
  const clock = clockParts(time);
  if (!clock) return null;
  const at = new Date(now);
  at.setHours(clock.hour, clock.minute, 0, 0);
  if (doneToday || at.getTime() <= now.getTime()) at.setDate(at.getDate() + 1);
  return at;
}

function habitDoneOn(logs: DayLogs, habitId: string, now: Date): boolean {
  const month = toMonthKey(now);
  const day = dayOfMonthKey(now);
  return Boolean(logs[month]?.[day]?.[habitId]);
}

export async function syncTaskReminders(
  tasks: Task[],
  habits: Habit[] = [],
  logs: DayLogs = {},
  now = new Date(),
): Promise<void> {
  if (!isNativeApp()) return;
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  const permission = await LocalNotifications.checkPermissions();
  if (permission.display !== "granted") {
    const requested = await LocalNotifications.requestPermissions();
    if (requested.display !== "granted") return;
  }

  await LocalNotifications.createChannel({
    id: CHANNEL_ID,
    name: "Reminders",
    description: "Warnings for tasks and habits that are still open",
    importance: 4,
    visibility: 1,
  });
  await LocalNotifications.cancelAll();

  const notifications = [
    ...tasks.flatMap((task) => {
      const at = taskReminderAt(task, now);
      if (!at) return [];
      return [
        {
          id: notificationId(`task:${task.id}`),
          title: task.title,
          body: "This work is still remaining.",
          channelId: CHANNEL_ID,
          schedule: { at, allowWhileIdle: true },
          extra: { taskId: task.id },
        },
      ];
    }),
    ...habits.flatMap((habit) => {
      if (habit.archived || !habit.reminderTime) return [];
      const at = habitReminderAt(
        habit.reminderTime,
        habitDoneOn(logs, habit.id, now),
        now,
      );
      if (!at) return [];
      return [
        {
          id: notificationId(`habit:${habit.id}`),
          title: habit.name,
          body: "This habit is still remaining.",
          channelId: CHANNEL_ID,
          schedule: { at, allowWhileIdle: true, repeats: true, every: "day" as const },
          extra: { habitId: habit.id },
        },
      ];
    }),
  ];

  if (!notifications.length) return;
  await LocalNotifications.schedule({ notifications });
}
