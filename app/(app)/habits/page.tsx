"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Flame, Plus } from "lucide-react";
import { MobileHeader, MobileFab } from "@/components/layout/AppShell";
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
import { useAppStore } from "@/store/app-store";

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
  const logs = useAppStore((s) => s.logs);

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
    if (editing) updateHabit(editing.id, values);
    else addHabit(values);
    setEditorOpen(false);
    setEditing(null);
  };

  const dayStats = useMemo(() => {
    if (!active.length) return { done: 0, pct: 0 };
    const month = dateKey.slice(0, 7);
    const day = dateKey.slice(8, 10);
    const dayLog = logs[month]?.[day] ?? {};
    const done = active.filter((h) => dayLog[h.id]).length;
    return { done, pct: Math.round((done / active.length) * 100) };
  }, [active, logs, dateKey]);

  const isToday = dateKey === toDateKey();

  return (
    <div>
      <MobileHeader title="Habits Tracker" />

      <div className="px-4 md:px-0 space-y-5">
        <div className="hidden md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">Habits</h1>
            <p className="text-sm text-on-surface-variant">
              Build streaks one check-in at a time.
            </p>
          </div>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> New habit
          </Button>
        </div>

        {/* Streak banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary p-4 text-on-primary shadow-lg shadow-primary/20">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight">
                    {dayStats.done}/{active.length || 0} done
                  </span>
                  {dayStats.pct >= 80 ? (
                    <span className="rounded-full bg-tertiary-fixed px-2 py-0.5 text-[0.6875rem] font-bold text-[var(--on-tertiary-fixed,#002113)]">
                      Strong day
                    </span>
                  ) : null}
                </div>
                <span className="text-sm opacity-90">
                  Keep the momentum going today!
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold leading-none">{dayStats.pct}%</span>
              <span className="block text-[0.6875rem] opacity-80">day score</span>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-10 h-32 w-32 rounded-full bg-secondary-container opacity-40 blur-2xl" />
          <div className="absolute -left-6 -top-8 h-28 w-28 rounded-full bg-tertiary opacity-30 blur-xl" />
        </div>

        {/* Date navigator */}
        <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest px-3 py-2.5 shadow-sm">
          <button
            type="button"
            aria-label="Previous day"
            onClick={() => go(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface active:scale-90 transition-all focus-ring"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-on-surface">{formatDisplayDate(dateKey)}</span>
            {isToday ? (
              <span className="flex items-center gap-1 rounded-full bg-primary-fixed px-2.5 py-0.5 text-[0.6875rem] font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Today
              </span>
            ) : (
              <button
                type="button"
                className="text-[0.6875rem] font-semibold text-primary focus-ring rounded"
                onClick={() => setDateKey(toDateKey())}
              >
                Jump to today
              </button>
            )}
          </div>
          <button
            type="button"
            aria-label="Next day"
            onClick={() => go(1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface active:scale-90 transition-all focus-ring"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-on-surface">Today&apos;s Habits</span>
            <span className="rounded-full bg-surface-container-highest px-2 py-0.5 text-[0.6875rem] font-medium text-on-surface-variant">
              {dayStats.done} of {active.length} done
            </span>
          </div>
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
          <div className="grid grid-cols-1 gap-3.5">
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
      </div>

      <MobileFab onClick={openNew} />

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
