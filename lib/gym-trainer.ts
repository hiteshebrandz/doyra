import type { GymExperience, GymGoal, GymPlan } from "@/lib/types";

export type GymTrainerInput = {
  goal: GymGoal;
  experience: GymExperience;
  daysPerWeek: number;
  sessionMinutes: number;
  equipment: string[];
  limitations: string;
  message?: string;
  currentPlan?: GymPlan | null;
};

function isPlan(value: unknown): value is GymPlan {
  if (!value || typeof value !== "object") return false;
  const plan = value as Partial<GymPlan>;
  return typeof plan.name === "string" && Array.isArray(plan.days) && plan.days.length > 0 && plan.days.every((day) =>
    typeof day === "object" && day !== null && typeof day.name === "string" && Array.isArray(day.exercises),
  );
}

function normalizePlan(plan: GymPlan): GymPlan {
  return {
    ...plan,
    id: `gym-ai-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    days: plan.days.slice(0, 7).map((day, dayIndex) => ({
      ...day,
      id: day.id || `day-${dayIndex + 1}`,
      dayOfWeek: Math.min(6, Math.max(0, Number(day.dayOfWeek) || dayIndex)),
      rest: Boolean(day.rest),
      exercises: day.exercises.slice(0, 12).map((exercise, exerciseIndex) => ({
        ...exercise,
        id: exercise.id || `exercise-${dayIndex}-${exerciseIndex}`,
        notes: typeof exercise.notes === "string" ? exercise.notes : "",
        sets: Array.isArray(exercise.sets) ? exercise.sets.slice(0, 8).map((set, setIndex) => ({
          ...set,
          id: set.id || `set-${dayIndex}-${exerciseIndex}-${setIndex}`,
          completed: false,
        })) : [],
      })),
    })),
  };
}

export async function generateGymPlan(input: GymTrainerInput): Promise<GymPlan> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  const models = [process.env.GEMINI_MODEL ?? "gemini-flash-lite-latest", "gemini-flash-lite-latest"]
    .filter((item, index, items) => items.indexOf(item) === index);
  const prompt = `You are a careful gym trainer. Create or revise one practical weekly gym plan as JSON only. Support the user's experience level, goal, equipment, schedule, and limitations. Never diagnose conditions. Avoid exercises that conflict with limitations and include a short safety note in plan limitations. Every exercise must include sets with reps or durationMinutes, nullable weight, nullable distanceKm, and completed false. Return exactly this shape: {"id":"","name":"","goal":"strength|muscle|fitness|fat-loss|mobility","experience":"new|returning|experienced","daysPerWeek":number,"sessionMinutes":number,"equipment":string[],"limitations":string,"days":[{"id":"","dayOfWeek":0,"name":"","focus":"","rest":boolean,"exercises":[{"id":"","name":"","type":"strength|cardio|mobility","muscleGroup":"","notes":"","sets":[{"id":"","reps":number|null,"weight":number|null,"durationMinutes":number|null,"distanceKm":number|null,"completed":false}]}]}]}. User request: ${JSON.stringify(input)}`;
  let data: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> } | null = null;
  let lastStatus = 502;
  for (const model of models) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.35 },
      }),
    });
    if (response.ok) {
      data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      break;
    }
    lastStatus = response.status;
    if (response.status !== 429 && response.status !== 503) break;
  }
  if (!data) throw new Error(`Gemini request failed (${lastStatus})`);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty plan");
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { throw new Error("Gemini returned invalid plan JSON"); }
  if (!isPlan(parsed)) throw new Error("Gemini returned an incomplete plan");
  return normalizePlan(parsed);
}
