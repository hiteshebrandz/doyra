"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { HabitIcon } from "@/components/habits/HabitIcon";
import {
  HABIT_ICON_KEYS,
  HABIT_ICON_LABELS,
  toHabitIconKey,
  type HabitIconKey,
} from "@/lib/habit-icons";
import { HABIT_COLORS, HABIT_PRESETS, type Habit } from "@/lib/types";
import { cn } from "@/lib/utils";

export type HabitFormValues = {
  name: string;
  icon: string;
  color: string;
  reminderTime: string | null;
};

export function HabitForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: {
  initial?: Partial<Habit>;
  onSubmit: (v: HabitFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [icon, setIcon] = useState<HabitIconKey>(toHabitIconKey(initial?.icon));
  const [color, setColor] = useState(initial?.color ?? HABIT_COLORS[0]);
  const [remind, setRemind] = useState(Boolean(initial?.reminderTime));
  const [reminderTime, setReminderTime] = useState(initial?.reminderTime || "20:00");

  const handle = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      icon,
      color,
      reminderTime: remind ? reminderTime : null,
    });
  };

  return (
    <form onSubmit={handle} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {HABIT_PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-surface-container-low px-3 py-2 text-sm font-semibold focus-ring"
            onClick={() => {
              setName(p.name);
              setIcon(toHabitIconKey(p.icon));
              setColor(p.color);
            }}
          >
            <HabitIcon icon={p.icon} className="h-4 w-4 text-on-surface-variant" />
            {p.name}
          </button>
        ))}
      </div>
      <div>
        <Label htmlFor="habit-name">Name</Label>
        <Input
          id="habit-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Habit name"
        />
      </div>
      <div>
        <Label>Icon</Label>
        <div className="flex flex-wrap gap-2">
          {HABIT_ICON_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              aria-label={HABIT_ICON_LABELS[key]}
              aria-pressed={icon === key}
              title={HABIT_ICON_LABELS[key]}
              onClick={() => setIcon(key)}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl focus-ring transition",
                icon === key
                  ? "bg-primary-fixed text-primary ring-2 ring-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:text-on-surface",
              )}
            >
              <HabitIcon icon={key} />
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {HABIT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Color ${c}`}
              onClick={() => setColor(c)}
              className={cn(
                "h-9 w-9 rounded-full focus-ring",
                color === c && "ring-2 ring-offset-2 ring-on-surface",
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-surface-container-low p-3">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 accent-primary"
            checked={remind}
            onChange={(e) => setRemind(e.target.checked)}
          />
          <span>
            <span className="block text-sm font-semibold text-on-surface">
              Remind me every day
            </span>
            <span className="block text-xs text-on-surface-variant">
              You will see this time on the habit. The app reminds you if it is still open.
            </span>
          </span>
        </label>
        {remind ? (
          <div className="mt-3">
            <Label htmlFor="habit-reminder-time">Reminder time</Label>
            <Input
              id="habit-reminder-time"
              type="time"
              required
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>
        ) : null}
      </div>
      <div className="flex gap-2 pt-2">
        {onCancel ? (
          <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" className="flex-1">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
