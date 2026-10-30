import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredUserLocation = {
  id: string;
  username: string;
  email: string;
  latitude: number;
  longitude: number;
  updatedAt: string;
};

const filePath = path.join(process.cwd(), "data", "user-locations.json");

let writeQueue: Promise<unknown> = Promise.resolve();

export async function readUserLocations(): Promise<StoredUserLocation[]> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as { users?: unknown };
    if (!Array.isArray(parsed.users)) return [];
    return parsed.users.filter(isStoredUser);
  } catch {
    return [];
  }
}

export function saveUserLocation(entry: StoredUserLocation): Promise<StoredUserLocation[]> {
  const run = writeQueue.then(() => upsert(entry));
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function upsert(entry: StoredUserLocation): Promise<StoredUserLocation[]> {
  const users = (await readUserLocations()).filter((user) => user.id !== entry.id);
  users.unshift(entry);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify({ users }, null, 2)}\n`, "utf8");
  return users;
}

function isStoredUser(value: unknown): value is StoredUserLocation {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<StoredUserLocation>;
  return (
    typeof row.id === "string" &&
    typeof row.username === "string" &&
    typeof row.email === "string" &&
    typeof row.latitude === "number" &&
    typeof row.longitude === "number" &&
    typeof row.updatedAt === "string"
  );
}
