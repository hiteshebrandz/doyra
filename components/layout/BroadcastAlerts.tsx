"use client";

import { useEffect } from "react";
import { watchBroadcasts } from "@/lib/broadcasts";
import { isNativeApp } from "@/lib/native-app";
import { notificationId, presentReminderNotification } from "@/lib/task-reminders";

const CURSOR_KEY = "ritualoop.broadcast-seen-at";

/**
 * Turns an admin notice into the same looping reminder used by tasks and habits.
 * A phone that was closed plays it the next time Ritualoop opens.
 */
export function BroadcastAlerts() {
  useEffect(() => {
    if (!isNativeApp()) return;
    let cursor = window.localStorage.getItem(CURSOR_KEY);
    const seen = new Set<string>();
    let blocked = false;

    const unsub = watchBroadcasts(
      (items) => {
        const stamped = items.filter((item) => item.createdAt && item.title);
        if (!cursor) {
          const newest = stamped.reduce((max, item) => (item.createdAt > max ? item.createdAt : max), "");
          cursor = newest || new Date().toISOString();
          window.localStorage.setItem(CURSOR_KEY, cursor);
          return;
        }
        const fresh = stamped
          .filter((item) => item.createdAt > cursor! && !seen.has(item.id))
          .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
        if (!fresh.length || blocked) return;
        for (const item of fresh) seen.add(item.id);
        void (async () => {
          for (const item of fresh) {
            const shown = await presentReminderNotification({
              id: notificationId(`broadcast:${item.id}`),
              title: item.title,
              body: item.body,
              extra: { broadcastId: item.id },
            });
            if (!shown) {
              blocked = true;
              seen.delete(item.id);
              break;
            }
            cursor = item.createdAt;
            window.localStorage.setItem(CURSOR_KEY, item.createdAt);
          }
        })();
      },
      () => undefined,
    );

    return () => unsub();
  }, []);

  return null;
}
