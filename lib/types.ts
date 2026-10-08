export type ThemePreference = "light" | "dark" | "system";
export type WeekStart = 0 | 1; // 0 = Sunday, 1 = Monday
export type TaskType = "daily" | "weekly" | "monthly";
export type TaskPriority = "low" | "medium" | "high";
export type GymExperience = "new" | "returning" | "experienced";
export type GymGoal = "strength" | "muscle" | "fitness" | "fat-loss" | "mobility";
export type GymExerciseType = "strength" | "cardio" | "mobility";

export type GymSet = {
  id: string;
  reps: number | null;
  weight: number | null;
  durationMinutes: number | null;
  distanceKm: number | null;
  completed: boolean;
};

export type GymExercise = {
  id: string;
  name: string;
  type: GymExerciseType;
  muscleGroup: string;
  notes: string;
  sets: GymSet[];
};

export type GymDay = {
  id: string;
  dayOfWeek: number;
  name: string;
  focus: string;
  rest: boolean;
  exercises: GymExercise[];
};

export type GymPlan = {
  id: string;
  name: string;
  goal: GymGoal;
  experience: GymExperience;
  daysPerWeek: number;
  sessionMinutes: number;
  equipment: string[];
  limitations: string;
  days: GymDay[];
  generatedAt: string | null;
  updatedAt: string;
};

export type GymLog = {
  completedAt: string | null;
  notes: string;
  difficulty: number | null;
};

export type UserSettings = {
  theme: ThemePreference;
  displayName: string;
  createdAt: string;
  weekStart: WeekStart;
};

export type Habit = {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
  archived: boolean;
};

export type Task = {
  id: string;
  title: string;
  notes: string;
  type: TaskType;
  priority: TaskPriority;
  dueDate: string | null;
  done: boolean;
  doneAt: string | null;
  createdAt: string;
};

export type HabitsDoc = {
  items: Habit[];
};

export type TasksDoc = {
  items: Record<string, Task>;
};

/** days["01"] = { [habitId]: true } */
export type MonthLogDoc = {
  days: Record<string, Record<string, boolean>>;
};

export type ExportPayload = {
  version: 1;
  exportedAt: string;
  settings: UserSettings;
  habits: Habit[];
  tasks: Record<string, Task>;
  logs: Record<string, MonthLogDoc["days"]>;
  archives: Record<string, Record<string, Task>>;
  gym?: { plan: GymPlan | null; logs: Record<string, GymLog> };
};

export const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  displayName: "",
  createdAt: new Date().toISOString(),
  weekStart: 1,
};

export const HABIT_PRESETS: Omit<Habit, "id" | "createdAt" | "archived">[] = [
  { name: "Gym", icon: "💪", color: "#6366F1" },
  { name: "Water", icon: "💧", color: "#06B6D4" },
  { name: "Reading", icon: "📚", color: "#8B5CF6" },
  { name: "Meditation", icon: "🧘", color: "#22C55E" },
];

export const HABIT_COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#F59E0B",
  "#22C55E",
  "#06B6D4",
  "#3B82F6",
];
