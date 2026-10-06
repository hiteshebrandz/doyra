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
  // eslint-disable-next-line no-console
  console.debug(
    `[doyra:usage] +${count} read${count === 1 ? "" : "s"}${label ? ` (${label})` : ""} → reads=${state.reads} writes=${state.writes}`,
  );
}

export function trackWrite(count = 1, label?: string): void {
  if (!isDev) return;
  state.writes += count;
  // eslint-disable-next-line no-console
  console.debug(
    `[doyra:usage] +${count} write${count === 1 ? "" : "s"}${label ? ` (${label})` : ""} → reads=${state.reads} writes=${state.writes}`,
  );
}

export function getUsage(): Readonly<UsageState> {
  return { ...state };
}

export function resetUsage(): void {
  state.reads = 0;
  state.writes = 0;
}
