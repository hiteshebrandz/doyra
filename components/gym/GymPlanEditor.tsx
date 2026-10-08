"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import type { GymDay, GymExercise, GymPlan, GymSet } from "@/lib/types";

function clonePlan(plan: GymPlan): GymPlan {
  return JSON.parse(JSON.stringify(plan)) as GymPlan;
}

export function GymPlanEditor({ plan, onSave, onCancel }: { plan: GymPlan; onSave: (plan: GymPlan) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState(() => clonePlan(plan));
  const [dayIndex, setDayIndex] = useState(0);
  const day = draft.days[dayIndex];

  const updateDay = (patch: Partial<GymDay>) => {
    setDraft((current) => ({ ...current, days: current.days.map((item, index) => index === dayIndex ? { ...item, ...patch } : item) }));
  };
  const updateExercise = (exerciseIndex: number, patch: Partial<GymExercise>) => {
    updateDay({ exercises: day.exercises.map((item, index) => index === exerciseIndex ? { ...item, ...patch } : item) });
  };
  const updateSet = (exerciseIndex: number, setIndex: number, patch: Partial<GymSet>) => {
    updateExercise(exerciseIndex, { sets: day.exercises[exerciseIndex].sets.map((item, index) => index === setIndex ? { ...item, ...patch } : item) });
  };
  const addExercise = () => {
    const id = `custom-${Date.now()}`;
    updateDay({ exercises: [...day.exercises, { id, name: "New exercise", type: "strength", muscleGroup: "Full body", notes: "", sets: [{ id: `${id}-set-1`, reps: 10, weight: null, durationMinutes: null, distanceKm: null, completed: false }] }] });
  };
  const addSet = (exerciseIndex: number) => {
    const exercise = day.exercises[exerciseIndex];
    updateExercise(exerciseIndex, { sets: [...exercise.sets, { id: `${exercise.id}-set-${Date.now()}`, reps: 10, weight: null, durationMinutes: null, distanceKm: null, completed: false }] });
  };

  return (
    <div className="flex max-h-[calc(92dvh-5rem)] flex-col">
      <div className="min-h-0 space-y-5 overflow-y-auto pr-1">
        <div className="rounded-xl bg-primary-fixed/40 p-3 text-sm text-on-surface-variant">Edit your plan one day at a time. Changes are saved only when you press <strong className="text-on-surface">Save plan</strong>.</div>
        <div className="grid gap-3 sm:grid-cols-2"><div><Label htmlFor="gym-plan-name">Plan name</Label><Input id="gym-plan-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></div><div><Label htmlFor="gym-plan-time">Workout minutes</Label><Input id="gym-plan-time" type="number" min="10" max="180" value={draft.sessionMinutes} onChange={(event) => setDraft({ ...draft, sessionMinutes: Number(event.target.value) || 45 })} /></div></div>
        <div className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-4 shadow-sm"><div className="flex items-center justify-between gap-3"><button type="button" aria-label="Previous day" disabled={dayIndex === 0} onClick={() => setDayIndex((index) => index - 1)} className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low disabled:opacity-30"><ChevronLeft className="h-5 w-5" /></button><div className="min-w-0 text-center"><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Day {dayIndex + 1} of {draft.days.length}</p><h3 className="truncate text-lg font-bold text-on-surface">{day?.name ?? "Training day"}</h3></div><button type="button" aria-label="Next day" disabled={dayIndex === draft.days.length - 1} onClick={() => setDayIndex((index) => index + 1)} className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low disabled:opacity-30"><ChevronRight className="h-5 w-5" /></button></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><div><Label htmlFor="gym-day-name">Day name</Label><Input id="gym-day-name" value={day?.name ?? ""} onChange={(event) => updateDay({ name: event.target.value })} /></div><div><Label htmlFor="gym-day-focus">What is the focus?</Label><Input id="gym-day-focus" value={day?.focus ?? ""} onChange={(event) => updateDay({ focus: event.target.value })} /></div></div></div>
        {day ? <div className="space-y-4"><div className="flex items-center justify-between"><div><h3 className="font-bold text-on-surface">Exercises</h3><p className="text-sm text-on-surface-variant">Give each movement a name, note, and clear set target.</p></div><Button size="sm" variant="secondary" onClick={addExercise}><Plus className="h-4 w-4" /> Add exercise</Button></div>{day.exercises.map((exercise, exerciseIndex) => <div key={exercise.id} className="rounded-2xl border border-outline-variant/25 bg-surface-container-low p-4"><div className="flex items-start gap-3"><div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2"><div><Label htmlFor={`exercise-${exercise.id}`}>Exercise name</Label><Input id={`exercise-${exercise.id}`} value={exercise.name} onChange={(event) => updateExercise(exerciseIndex, { name: event.target.value })} /></div><div><Label htmlFor={`muscle-${exercise.id}`}>Body area</Label><Input id={`muscle-${exercise.id}`} value={exercise.muscleGroup} onChange={(event) => updateExercise(exerciseIndex, { muscleGroup: event.target.value })} /></div></div><button type="button" aria-label={`Remove ${exercise.name}`} onClick={() => updateDay({ exercises: day.exercises.filter((_, index) => index !== exerciseIndex) })} className="mt-6 rounded-lg p-2 text-danger hover:bg-error-container"><Trash2 className="h-4 w-4" /></button></div><div className="mt-3"><Label htmlFor={`notes-${exercise.id}`}>Beginner notes</Label><Textarea id={`notes-${exercise.id}`} className="min-h-16" placeholder="Example: Keep your back supported and move slowly." value={exercise.notes} onChange={(event) => updateExercise(exerciseIndex, { notes: event.target.value })} /></div><div className="mt-4"><div className="mb-2 flex items-center justify-between"><p className="text-sm font-bold text-on-surface">Sets</p><button type="button" onClick={() => addSet(exerciseIndex)} className="text-sm font-bold text-primary">+ Add set</button></div><div className="space-y-2">{exercise.sets.map((set, setIndex) => <div key={set.id} className="grid grid-cols-[auto_1fr_1fr_auto] items-end gap-2 rounded-xl bg-surface-container px-3 py-3"><span className="pb-2 text-xs font-bold text-on-surface-variant">Set {setIndex + 1}</span><div><Label className="text-xs" htmlFor={`${set.id}-reps`}>Reps</Label><Input id={`${set.id}-reps`} type="number" min="1" placeholder="10" value={set.reps ?? ""} onChange={(event) => updateSet(exerciseIndex, setIndex, { reps: Number(event.target.value) || null })} /></div><div><Label className="text-xs" htmlFor={`${set.id}-weight`}>Weight (kg)</Label><Input id={`${set.id}-weight`} type="number" min="0" placeholder="Optional" value={set.weight ?? ""} onChange={(event) => updateSet(exerciseIndex, setIndex, { weight: Number(event.target.value) || null })} /></div><button type="button" aria-label={`Remove set ${setIndex + 1}`} disabled={exercise.sets.length === 1} onClick={() => updateExercise(exerciseIndex, { sets: exercise.sets.filter((_, index) => index !== setIndex) })} className="mb-2 text-danger disabled:opacity-30">×</button></div>)}</div></div></div>)}</div> : null}
      </div>
      <div className="mt-4 flex shrink-0 justify-end gap-2 border-t border-outline-variant/25 bg-surface-container-lowest pt-4"><Button variant="ghost" onClick={onCancel}>Cancel</Button><Button onClick={() => onSave({ ...draft, updatedAt: new Date().toISOString() })}><Save className="h-4 w-4" /> Save plan</Button></div>
    </div>
  );
}
