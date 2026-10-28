import type { GymPlan } from "@/lib/types";

const keyFor = (uid: string) => `ritualoop.gym-plan.${uid}`;

function isPlan(value: unknown): value is GymPlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as GymPlan;
  return typeof plan.id === "string" && Array.isArray(plan.days);
}

export function readStoredGymPlan(uid: string): GymPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(keyFor(uid));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isPlan(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStoredGymPlan(uid: string, plan: GymPlan | null) {
  if (typeof window === "undefined") return;
  try {
    if (!plan) localStorage.removeItem(keyFor(uid));
    else localStorage.setItem(keyFor(uid), JSON.stringify(plan));
  } catch {
    // Private mode or a full disk should not block the screen.
  }
}

/** Keeps whichever copy was updated last. A missing cloud copy loses to the device copy. */
export function chooseGymPlan(stored: GymPlan | null, remote: GymPlan | null): GymPlan | null {
  if (!stored) return remote;
  if (!remote) return stored;
  const storedAt = Date.parse(stored.updatedAt || "") || 0;
  const remoteAt = Date.parse(remote.updatedAt || "") || 0;
  return storedAt > remoteAt ? stored : remote;
}
