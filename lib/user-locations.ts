import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";

/** How many recent fixes to keep on one person. At one fix every 2 minutes this is about an hour. */
const POINT_LIMIT = 30;

export type LocationPoint = {
  latitude: number;
  longitude: number;
  recordedAt: string;
};

export type StoredUserLocation = {
  id: string;
  username: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  updatedAt: string;
  points: LocationPoint[];
};

export function accountLabel(user: User): { username: string; email: string } {
  const email = user.email?.trim().toLowerCase() ?? "";
  const username = user.displayName?.trim() || (email ? email.split("@")[0] : "Ritualoop user");
  return { username: username.slice(0, 80), email };
}

function roundCoord(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}

function asPoints(value: unknown): LocationPoint[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const point = item as Record<string, unknown>;
    if (typeof point.latitude !== "number" || typeof point.longitude !== "number") return [];
    if (typeof point.recordedAt !== "string") return [];
    return [{ latitude: point.latitude, longitude: point.longitude, recordedAt: point.recordedAt }];
  });
}

/** Writes this signed-in person. A GPS fix is appended as a new point, and the latest pin is kept on the record. */
export async function saveOpenedUser(
  user: User,
  coords?: { latitude: number; longitude: number },
): Promise<void> {
  const { username, email } = accountLabel(user);
  const updatedAt = new Date().toISOString();
  const ref = doc(db, "userLocations", user.uid);
  const payload: {
    username: string;
    email: string;
    updatedAt: string;
    latitude?: number;
    longitude?: number;
    points?: LocationPoint[];
  } = {
    username,
    email,
    updatedAt,
  };
  if (coords) {
    const latitude = roundCoord(coords.latitude);
    const longitude = roundCoord(coords.longitude);
    const existing = await getDoc(ref);
    const points = asPoints(existing.data()?.points);
    points.push({ latitude, longitude, recordedAt: updatedAt });
    payload.latitude = latitude;
    payload.longitude = longitude;
    payload.points = points.slice(-POINT_LIMIT);
  }
  await setDoc(ref, payload, { merge: true });
}

export function watchUserLocations(
  onChange: (people: StoredUserLocation[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const people = query(collection(db, "userLocations"), orderBy("updatedAt", "desc"));
  return onSnapshot(
    people,
    (snap) => {
      onChange(
        snap.docs.map((item) => {
          const data = item.data();
          const latitude = typeof data.latitude === "number" ? data.latitude : null;
          const longitude = typeof data.longitude === "number" ? data.longitude : null;
          return {
            id: item.id,
            username: typeof data.username === "string" ? data.username : "Ritualoop user",
            email: typeof data.email === "string" ? data.email : "",
            latitude,
            longitude,
            updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
            points: asPoints(data.points),
          };
        }),
      );
    },
    (error) => onError(error),
  );
}
