import { isAdminEmail } from "@/lib/broadcasts";
import { firebaseAccountFromRequest } from "@/lib/firebase-account";
import { readUserLocations, saveUserLocation } from "@/lib/user-locations";

export async function GET(request: Request) {
  const account = await firebaseAccountFromRequest(request);
  if (!account || !isAdminEmail(account.email)) {
    return Response.json({ error: "Admin sign-in required" }, { status: 401 });
  }
  const users = await readUserLocations();
  return Response.json({ users });
}

export async function POST(request: Request) {
  const account = await firebaseAccountFromRequest(request);
  if (!account) {
    return Response.json({ error: "Sign-in required" }, { status: 401 });
  }

  let body: { latitude?: unknown; longitude?: unknown };
  try {
    body = (await request.json()) as { latitude?: unknown; longitude?: unknown };
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return Response.json({ error: "Latitude is missing" }, { status: 400 });
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return Response.json({ error: "Longitude is missing" }, { status: 400 });
  }

  try {
    await saveUserLocation({
      id: account.id,
      username: account.username,
      email: account.email,
      latitude: Math.round(latitude * 1e6) / 1e6,
      longitude: Math.round(longitude * 1e6) / 1e6,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return Response.json({ error: "The location file could not be saved" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
