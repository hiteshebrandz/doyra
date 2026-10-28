import {
  BookOpen,
  Brain,
  Droplets,
  Dumbbell,
  Footprints,
  Moon,
  Music,
  PenLine,
  Salad,
  Target,
  type LucideIcon,
} from "lucide-react";

/**
 * Habit icons are stored in Firestore as a string key. Older habits saved an
 * emoji instead; LEGACY_EMOJI_TO_KEY maps those to a key so nothing breaks.
 */
export const HABIT_ICONS = {
  dumbbell: Dumbbell,
  droplets: Droplets,
  "book-open": BookOpen,
  brain: Brain,
  footprints: Footprints,
  salad: Salad,
  moon: Moon,
  "pen-line": PenLine,
  target: Target,
  music: Music,
} satisfies Record<string, LucideIcon>;

export type HabitIconKey = keyof typeof HABIT_ICONS;

export const HABIT_ICON_KEYS = Object.keys(HABIT_ICONS) as HabitIconKey[];

export const HABIT_ICON_LABELS: Record<HabitIconKey, string> = {
  dumbbell: "Gym",
  droplets: "Water",
  "book-open": "Reading",
  brain: "Meditation",
  footprints: "Walk or run",
  salad: "Eat well",
  moon: "Sleep",
  "pen-line": "Journal",
  target: "Goal",
  music: "Practice",
};

const LEGACY_EMOJI_TO_KEY: Record<string, HabitIconKey> = {
  "💪": "dumbbell",
  "💧": "droplets",
  "📚": "book-open",
  "🧘": "brain",
  "🏃": "footprints",
  "🥗": "salad",
  "😴": "moon",
  "📝": "pen-line",
  "🎯": "target",
  "🎵": "music",
};

export function isHabitIconKey(value: string): value is HabitIconKey {
  return value in HABIT_ICONS;
}

/** Returns the Lucide component for a stored icon value, or null for unknown values. */
export function resolveHabitIcon(value: string): LucideIcon | null {
  if (isHabitIconKey(value)) return HABIT_ICONS[value];
  const legacy = LEGACY_EMOJI_TO_KEY[value];
  return legacy ? HABIT_ICONS[legacy] : null;
}

/** Normalises a stored value to a key so edits re-save a key instead of an emoji. */
export function toHabitIconKey(value: string | undefined): HabitIconKey {
  if (!value) return "dumbbell";
  if (isHabitIconKey(value)) return value;
  return LEGACY_EMOJI_TO_KEY[value] ?? "dumbbell";
}
