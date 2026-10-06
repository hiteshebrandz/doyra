"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Flame, Plus } from "lucide-react";
import { MobileHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ResponsiveDialog } from "@/components/ui/Sheet";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitForm, type HabitFormValues } from "@/components/habits/HabitForm";
import { useHabits } from "@/hooks/useHabits";
import {
  addDays,
  formatDisplayDate,
  toDateKey,
  toMonthKey,
} from "@/lib/dates";
import type { Habit } from "@/lib/types";

export default function HabitsPage() {
  const {
    active,
    weekStart,
    addHabit,
    updateHabit,
    archiveHabit,
    toggleHabitCheckIn,
    ensureMonthLoaded,
  } = useHabits();

  const [dateKey, setDateKey] = useState(toDateKey());
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);

  useEffect(() => {
    void ensureMonthLoaded(toMonthKey());
    void ensureMonthLoaded(dateKey.slice(0, 7));
  }, [dateKey, ensureMonthLoaded]);

  const go = (delta: number) => {
    setDateKey(toDateKey(addDays(new Date(dateKey + "T12:00:00"), delta)));
  };

  const openNew = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const onSave = (values: HabitFormValues) => {
    if (editing) {
      updateHabit(editing.id, values);
    } else {
      addHabit(values);
    }
    setEditorOpen(false);
    setEditing(null);
  };

  return (
    <div>
      <MobileHeader title="Habits" />

      <div className="mb-4 hidden md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Habits</h1>
          <p className="text-sm text-[var(--muted)]">
            Build streaks one check-in at a time.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> New habit
        </Button>
      </div>

      <div className="mb-4 flex items-center justify-between gap-2 glass rounded-3xl p-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous day"
          onClick={() => go(-1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <p className="font-semibold">{formatDisplayDate(dateKey)}</p>
          {dateKey !== toDateKey() ? (
            <button
              type="button"
              className="text-xs font-semibold text-primary focus-ring rounded"
              onClick={() => setDateKey(toDateKey())}
            >
              Jump to today
            </button>
          ) : (
            <p className="text-xs text-[var(--muted)]">Today</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Next day"
          onClick={() => go(1)}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {active.length === 0 ? (
        <EmptyState
          icon={<Flame className="h-6 w-6" />}
          title="No habits yet"
          description="Try Gym, Water, Reading, or Meditation — or invent your own."
          action={
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" /> Create habit
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {active.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              dateKey={dateKey}
              weekStart={weekStart}
              onToggle={() => toggleHabitCheckIn(habit.id, dateKey)}
              onEdit={() => {
                setEditing(habit);
                setEditorOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={openNew}
        className="fixed bottom-[calc(var(--tabbar-h)+var(--safe-bottom)+16px)] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg focus-ring md:hidden active:scale-95"
        aria-label="Add habit"
      >
        <Plus className="h-6 w-6" />
      </button>

      <ResponsiveDialog
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit habit" : "New habit"}
      >
        <HabitForm
          key={editing?.id ?? "new"}
          initial={editing ?? undefined}
          onSubmit={onSave}
          onCancel={() => {
            setEditorOpen(false);
            setEditing(null);
          }}
          submitLabel={editing ? "Save changes" : "Create habit"}
        />
        {editing ? (
          <Button
            variant="danger"
            className="mt-3 w-full"
            onClick={() => {
              archiveHabit(editing.id);
              setEditorOpen(false);
              setEditing(null);
            }}
          >
            Archive habit
          </Button>
        ) : null}
      </ResponsiveDialog>
    </div>
  );
}
