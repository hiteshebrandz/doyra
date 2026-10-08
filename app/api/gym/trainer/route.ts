import { generateGymPlan, type GymTrainerInput } from "@/lib/gym-trainer";

async function verifyFirebaseToken(request: Request): Promise<boolean> {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!token || !apiKey) return false;
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    },
  );
  if (!response.ok) return false;
  const data = await response.json() as { users?: unknown[] };
  return Array.isArray(data.users) && data.users.length > 0;
}

export async function POST(request: Request) {
  if (!(await verifyFirebaseToken(request))) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  let input: GymTrainerInput;
  try {
    input = await request.json() as GymTrainerInput;
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!input || !input.goal || !input.experience || !input.daysPerWeek || !input.sessionMinutes) {
    return Response.json({ error: "Goal, experience, schedule, and session length are required" }, { status: 400 });
  }
  if (input.daysPerWeek < 1 || input.daysPerWeek > 7 || input.sessionMinutes < 15 || input.sessionMinutes > 180) {
    return Response.json({ error: "Training schedule is outside the supported range" }, { status: 400 });
  }

  try {
    const plan = await generateGymPlan(input);
    return Response.json({ plan });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Trainer request failed";
    const status = message.includes("not configured") ? 503 : 502;
    return Response.json({ error: message }, { status });
  }
}
