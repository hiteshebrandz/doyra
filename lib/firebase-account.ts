export type FirebaseAccount = {
  id: string;
  email: string;
  username: string;
};

type LookupUser = {
  localId?: string;
  email?: string;
  displayName?: string;
};

/** Confirms the bearer token and returns the account Firebase has on file. */
export async function firebaseAccountFromRequest(request: Request): Promise<FirebaseAccount | null> {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!token || !apiKey) return null;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    },
  );
  if (!response.ok) return null;
  const data = (await response.json()) as { users?: LookupUser[] };
  const user = data.users?.[0];
  if (!user?.localId) return null;
  const email = user.email?.trim().toLowerCase() ?? "";
  const displayName = user.displayName?.trim() ?? "";
  const username = displayName || (email ? email.split("@")[0] : "Ritualoop user");
  return { id: user.localId, email, username };
}
