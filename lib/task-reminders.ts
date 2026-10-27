import type { Task } from "@/lib/types";
import { isNativeApp } from "@/lib/native-app";

const REMINDER_HOUR = 20;
const CHANNEL_ID = "task-reminders";

function notificationId(taskId: string): number {
  let hash = 0;
  for (let i = 0; i < taskId.length; i += 1) {
    hash = (hash * 31 + taskId.charCodeAt(i)) | 0;
  }
  const id = Math.abs(hash) % 2147483646;
  return id === 0 ? 1 : id;
}

/** 8:00 pm on the due date, or the next 8:00 pm if that moment has passed. */
export function nextReminderAt(dueDate: string, now = new Date()): Date {
  const [year, month, day] = dueDate.split("-").map(Number);
  const onDueDate = new Date(year, month - 1, day, REMINDER_HOUR, 0, 0, 0);
  if (onDueDate.getTime() > now.getTime()) return onDueDate;
  const next = new Date(now);
  next.setHours(REMINDER_HOUR, 0, 0, 0);
  if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
  return next;
}

export async function syncTaskReminders(tasks: Task[]): Promise<void> {
  if (!isNativeApp()) return;
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  const permission = await LocalNotifications.checkPermissions();
  if (permission.display !== "granted") {
    const requested = await LocalNotifications.requestPermissions();
    if (requested.display !== "granted") return;
  }

  await LocalNotifications.createChannel({
    id: CHANNEL_ID,
    name: "Task reminders",
    description: "Warnings for work that is still open",
    importance: 4,
    visibility: 1,
  });
  await LocalNotifications.cancelAll();

  const open = tasks.filter((task) => !task.done && task.dueDate);
  if (!open.length) return;

  await LocalNotifications.schedule({
    notifications: open.map((task) => ({
      id: notificationId(task.id),
      title: task.title,
      body: "This work is still remaining.",
      channelId: CHANNEL_ID,
      schedule: {
        at: nextReminderAt(task.dueDate as string),
        allowWhileIdle: true,
      },
      extra: { taskId: task.id },
    })),
  });
}
