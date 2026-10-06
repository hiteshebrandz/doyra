export type ThemePreference = "light" | "dark" | "system";
export type WeekStart = 0 | 1; // 0 = Sunday, 1 = Monday
export type TaskType = "daily" | "weekly" | "monthly";
export type TaskPriority = "low" | "medium" | "high";

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
