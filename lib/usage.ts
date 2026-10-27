/**
 * Dev-only Firestore usage counter.
 * Logs cumulative reads/writes so you can verify the free-tier budget.
 */

type UsageState = {
  reads: number;
  writes: number;
};

const state: UsageState = { reads: 0, writes: 0 };

const isDev = process.env.NODE_ENV === "development";

export function trackRead(count = 1, label?: string): void {
  if (!isDev) return;
  state.reads += count;
  console.debug(
    `[doyra:usage] +${count} read${count === 1 ? "" : "s"}${label ? ` (${label})` : ""} → reads=${state.reads} writes=${state.writes}`,
  );
}

export function trackWrite(count = 1, label?: string): void {
  if (!isDev) return;
  state.writes += count;
  console.debug(
    `[doyra:usage] +${count} write${count === 1 ? "" : "s"}${label ? ` (${label})` : ""} → reads=${state.reads} writes=${state.writes}`,
  );
}
