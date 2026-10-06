import { addDays, toDateKey, parseDateKey } from "@/lib/dates";

/**
 * Streak = consecutive days the habit is done, ending today or yesterday.
 * If neither today nor yesterday is checked, streak is 0.
 */
export function computeStreak(
  habitId: string,
  /** map of YYYY-MM-DD -> true when done */
  doneByDay: Record<string, boolean>,
  today = new Date(),
): { current: number; best: number } {
  const todayKey = toDateKey(today);
  const yesterdayKey = toDateKey(addDays(today, -1));

  let current = 0;
  let cursor: string | null = null;

  if (doneByDay[todayKey]) cursor = todayKey;
  else if (doneByDay[yesterdayKey]) cursor = yesterdayKey;

  while (cursor && doneByDay[cursor]) {
    current += 1;
    cursor = toDateKey(addDays(parseDateKey(cursor), -1));
  }

  // Best streak from all known days
  const keys = Object.keys(doneByDay)
    .filter((k) => doneByDay[k])
    .sort();

  let best = 0;
  let run = 0;
  let prev: string | null = null;

  for (const key of keys) {
    if (prev && toDateKey(addDays(parseDateKey(prev), 1)) === key) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > best) best = run;
    prev = key;
  }

  // Ensure current is reflected even if doneByDay is sparse for history
  if (current > best) best = current;

  void habitId;
  return { current, best };
}

export function flattenMonthLogs(
  months: Record<string, Record<string, Record<string, boolean>>>,
  habitId: string,
): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const [month, days] of Object.entries(months)) {
    for (const [day, habits] of Object.entries(days)) {
      if (habits[habitId]) {
        out[`${month}-${day}`] = true;
      }
    }
  }
  return out;
}
