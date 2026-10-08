import type { GymDay, GymExperience, GymGoal, GymPlan } from "@/lib/types";

const exercise = (id: string, name: string, muscleGroup: string, reps = 10) => ({
  id,
  name,
  type: "strength" as const,
  muscleGroup,
  notes: "Move with control and stop if you feel pain.",
  sets: [1, 2, 3].map((set) => ({
    id: `${id}-set-${set}`,
    reps,
    weight: null,
    durationMinutes: null,
    distanceKm: null,
    completed: false,
  })),
});

const templates: Record<string, Omit<GymPlan, "id" | "updatedAt" | "generatedAt">> = {
  "new-fitness-3": {
    name: "Foundation: 3 days",
    goal: "fitness",
    experience: "new",
    daysPerWeek: 3,
    sessionMinutes: 45,
    equipment: ["Gym machines", "Dumbbells"],
    limitations: "",
    days: [
      { id: "day-1", dayOfWeek: 1, name: "Full body A", focus: "Strength basics", rest: false, exercises: [exercise("goblet-squat", "Goblet squat", "Legs"), exercise("chest-press", "Chest press", "Chest"), exercise("seated-row", "Seated row", "Back")] },
      { id: "day-2", dayOfWeek: 3, name: "Full body B", focus: "Build confidence", rest: false, exercises: [exercise("leg-press", "Leg press", "Legs"), exercise("lat-pulldown", "Lat pulldown", "Back"), exercise("shoulder-press", "Shoulder press", "Shoulders")] },
      { id: "day-3", dayOfWeek: 5, name: "Full body C", focus: "Steady progress", rest: false, exercises: [exercise("romanian-deadlift", "Romanian deadlift", "Hamstrings"), exercise("incline-press", "Incline dumbbell press", "Chest"), exercise("plank", "Plank", "Core", 1)] },
    ],
  },
  "experienced-strength-4": {
    name: "Strength: 4 days",
    goal: "strength",
    experience: "experienced",
    daysPerWeek: 4,
    sessionMinutes: 60,
    equipment: ["Barbell", "Rack", "Cables"],
    limitations: "",
    days: [
      { id: "upper-1", dayOfWeek: 1, name: "Upper strength", focus: "Press and pull", rest: false, exercises: [exercise("bench", "Barbell bench press", "Chest", 5), exercise("row", "Barbell row", "Back", 6), exercise("ohp", "Overhead press", "Shoulders", 5)] },
      { id: "lower-1", dayOfWeek: 2, name: "Lower strength", focus: "Squat pattern", rest: false, exercises: [exercise("squat", "Back squat", "Legs", 5), exercise("rdl", "Romanian deadlift", "Hamstrings", 6), exercise("calf", "Standing calf raise", "Calves", 12)] },
      { id: "upper-2", dayOfWeek: 4, name: "Upper volume", focus: "Hypertrophy", rest: false, exercises: [exercise("incline", "Incline press", "Chest", 8), exercise("pullup", "Pull-up", "Back", 8), exercise("lateral", "Lateral raise", "Shoulders", 12)] },
      { id: "lower-2", dayOfWeek: 5, name: "Lower volume", focus: "Posterior chain", rest: false, exercises: [exercise("deadlift", "Deadlift", "Back", 5), exercise("split-squat", "Bulgarian split squat", "Legs", 8), exercise("hamstring", "Hamstring curl", "Hamstrings", 10)] },
    ],
  },
};

export function createGymTemplate(goal: GymGoal, experience: GymExperience, daysPerWeek: number): GymPlan {
  const key = `${experience === "new" ? "new" : "experienced"}-${goal === "strength" ? "strength" : "fitness"}-${daysPerWeek}`;
  const source = templates[key] ?? (experience === "new" ? templates["new-fitness-3"] : templates["experienced-strength-4"]);
  const now = new Date().toISOString();
  const focusByDay = [
    "Push + core",
    "Legs + mobility",
    "Pull + posture",
    "Cardio + core",
    "Upper body",
    "Lower body",
    "Full body flow",
  ];
  const allDays: GymDay[] = Array.from({ length: 7 }, (_, index) => {
    const baseDay = source.days[index % source.days.length];
    return {
      ...baseDay,
      id: `day-${index + 1}`,
      dayOfWeek: index === 6 ? 0 : index + 1,
      name: focusByDay[index],
      focus: "Train with control, then leave with energy.",
      rest: false,
      exercises: baseDay.exercises.map((item) => ({
        ...item,
        id: `${item.id}-${index}`,
        sets: item.sets.map((set, setIndex) => ({
          ...set,
          id: `${item.id}-${index}-set-${setIndex + 1}`,
          completed: false,
        })),
      })),
    };
  });
  return {
    ...source,
    id: `gym-${Date.now()}`,
    daysPerWeek: 7,
    days: allDays,
    updatedAt: now,
    generatedAt: null,
  };
}
