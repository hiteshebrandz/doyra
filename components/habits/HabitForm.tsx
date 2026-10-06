"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { HABIT_COLORS, HABIT_PRESETS, type Habit } from "@/lib/types";
import { cn } from "@/lib/utils";

const EMOJIS = ["💪", "💧", "📚", "🧘", "🏃", "🥗", "😴", "📝", "🎯", "🎵"];

export type HabitFormValues = {
  name: string;
  icon: string;
  color: string;
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
  const [icon, setIcon] = useState(initial?.icon ?? "💪");
  const [color, setColor] = useState(initial?.color ?? HABIT_COLORS[0]);

  const handle = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), icon, color });
  };

  return (
    <form onSubmit={handle} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {HABIT_PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            className="rounded-2xl glass px-3 py-2 text-sm font-semibold focus-ring"
            onClick={() => {
              setName(p.name);
              setIcon(p.icon);
              setColor(p.color);
            }}
          >
            {p.icon} {p.name}
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
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              aria-label={`Icon ${e}`}
              onClick={() => setIcon(e)}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl text-xl focus-ring",
                icon === e ? "bg-primary/15 ring-2 ring-primary" : "glass",
              )}
            >
              {e}
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
                color === c && "ring-2 ring-offset-2 ring-[var(--text)]",
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
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
