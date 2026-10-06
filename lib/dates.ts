/** Local-timezone date helpers. Keys are always YYYY-MM-DD or YYYY-MM. */

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function toDateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function toMonthKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
}

export function dayOfMonthKey(date: Date = new Date()): string {
  return pad2(date.getDate());
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function startOfWeek(date: Date, weekStartsOn: 0 | 1 = 1): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  const diff = weekStartsOn === 1 ? (day + 6) % 7 : day;
  d.setDate(d.getDate() - diff);
  return d;
}

export function weekDayKeys(date: Date, weekStartsOn: 0 | 1 = 1): string[] {
  const start = startOfWeek(date, weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => toDateKey(addDays(start, i)));
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function formatDisplayDate(key: string): string {
  const d = parseDateKey(key);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function greetingForNow(now = new Date()): string {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function isOverdue(dueDate: string | null | undefined, done: boolean): boolean {
  if (done || !dueDate) return false;
  return dueDate < toDateKey();
}

export function monthsAgoKey(months: number, from = new Date()): string {
  const d = new Date(from.getFullYear(), from.getMonth() - months, 1);
  return toMonthKey(d);
}
