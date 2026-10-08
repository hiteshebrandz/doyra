"use client";

import { useState } from "react";
import { Dumbbell, Check, Sparkles, Plus, Timer, CalendarDays, PlayCircle, ChevronDown, ShieldCheck, Pencil, ListPlus, RefreshCw, Save } from "lucide-react";
import { MobileHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useGym } from "@/hooks/useGym";
import { createGymTemplate } from "@/lib/gym-templates";
import type { GymExperience, GymGoal } from "@/lib/types";
import { auth } from "@/lib/firebase";
import { getGymExerciseGuide } from "@/lib/gym-guides";
import { ResponsiveDialog } from "@/components/ui/Sheet";
import { GymPlanEditor } from "@/components/gym/GymPlanEditor";
import { useTasks } from "@/hooks/useTasks";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function GymPage() {
  const { plan, today, todayWorkout, week, logs, setPlan, toggleWorkout, flushNow } = useGym();
  const { addTask } = useTasks();
  const [experience, setExperience] = useState<GymExperience>("new");
  const [goal, setGoal] = useState<GymGoal>("fitness");
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [showSetup, setShowSetup] = useState(!plan || plan.days.length < 7);
  const [trainerBusy, setTrainerBusy] = useState(false);
  const [trainerError, setTrainerError] = useState<string | null>(null);
  const [trainerMessage, setTrainerMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(today);
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [taskAdded, setTaskAdded] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);

  const selectedEntry = week.find((entry) => entry.dateKey === selectedDate) ?? week[0];
  const selectedWorkout = selectedEntry?.day ?? todayWorkout;

  const createPlan = () => {
    setPlan(createGymTemplate(goal, experience, daysPerWeek));
    setPlanSaved(false);
    setShowSetup(false);
  };

  const askTrainer = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setTrainerBusy(true);
    setTrainerError(null);
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/gym/trainer", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ goal, experience, daysPerWeek, sessionMinutes: 45, equipment: ["Gym machines", "Dumbbells"], limitations: "", message: trainerMessage, currentPlan: plan }),
      });
      const data = await response.json() as { plan?: typeof plan; error?: string };
      if (!response.ok || !data.plan) throw new Error(data.error ?? "Trainer request failed");
      setPlan(data.plan);
      setPlanSaved(false);
      setShowSetup(false);
    } catch (error) {
      setTrainerError(error instanceof Error ? error.message : "Trainer request failed");
    } finally {
      setTrainerBusy(false);
    }
  };

  const savePlan = async () => {
    if (!plan) return;
    setSavingPlan(true);
    try {
      await flushNow();
      setPlanSaved(true);
    } finally {
      setSavingPlan(false);
    }
  };

  const sendWorkoutToTasks = () => {
    if (!selectedWorkout || !selectedEntry) return;
    addTask({
      title: `Gym: ${selectedWorkout.name}`,
      notes: `${selectedWorkout.focus}\n${selectedWorkout.exercises.map((item) => `${item.name} - ${item.sets.length} sets x ${item.sets[0]?.reps ?? "as planned"} reps`).join("\n")}`,
      type: "daily",
      priority: "medium",
      dueDate: selectedEntry.dateKey,
    });
    setTaskAdded(true);
  };

  return (
    <div>
      <MobileHeader title="Gym Trainer" />
      <div className="space-y-5 px-4 md:px-0">
        <div className="hidden items-center justify-between md:flex">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">Gym</h1>
            <p className="text-sm text-on-surface-variant">A plan for every session, at every level.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowSetup(true)}><Plus className="h-4 w-4" /> New plan</Button>
            <Button variant="secondary" onClick={() => setEditorOpen(true)} disabled={!plan}><Pencil className="h-4 w-4" /> Edit plan</Button>
            <Button onClick={() => void askTrainer()} disabled={trainerBusy}><RefreshCw className="h-4 w-4" /> {trainerBusy ? "Planning..." : "Regenerate"}</Button>
          </div>
        </div>

        {!plan || showSetup || plan.days.length < 7 ? (
          <GlassCard className="border border-primary/15 bg-gradient-to-br from-primary-fixed/40 to-surface-container-lowest">
            <div className="mb-5 flex items-start gap-3">
              <div className="rounded-xl bg-primary p-3 text-on-primary"><Sparkles className="h-5 w-5" /></div>
              <div><h2 className="font-bold text-on-surface">Build your weekly plan</h2><p className="text-sm text-on-surface-variant">Tell us where you are starting. You can edit every exercise later.</p></div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="text-sm font-semibold text-on-surface">Experience<select value={experience} onChange={(event) => setExperience(event.target.value as GymExperience)} className="mt-2 w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2.5 font-normal"><option value="new">New to the gym</option><option value="returning">Returning</option><option value="experienced">Experienced</option></select></label>
              <label className="text-sm font-semibold text-on-surface">Main goal<select value={goal} onChange={(event) => setGoal(event.target.value as GymGoal)} className="mt-2 w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2.5 font-normal"><option value="fitness">General fitness</option><option value="strength">Strength</option><option value="muscle">Build muscle</option><option value="fat-loss">Fat loss</option><option value="mobility">Mobility</option></select></label>
              <label className="text-sm font-semibold text-on-surface">Training rhythm<select value={daysPerWeek} onChange={(event) => setDaysPerWeek(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2.5 font-normal"><option value="7">Every day</option></select></label>
            </div>
            <label className="mt-4 block text-sm font-semibold text-on-surface">Tell the trainer what you need
              <textarea value={trainerMessage} onChange={(event) => setTrainerMessage(event.target.value)} placeholder="Example: I only have 30 minutes on Wednesdays, and my knees feel sensitive." className="mt-2 min-h-20 w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2.5 font-normal" />
            </label>
            <div className="mt-5 flex flex-wrap gap-2"><Button onClick={createPlan}><Dumbbell className="h-4 w-4" /> Create my plan</Button><Button variant="secondary" onClick={() => void askTrainer()} disabled={trainerBusy}><Sparkles className="h-4 w-4" /> {trainerBusy ? "Planning..." : "Let AI plan it"}</Button>{plan ? <Button variant="ghost" onClick={() => setShowSetup(false)}>Cancel</Button> : null}</div>
            {trainerError ? <p className="mt-3 text-sm font-medium text-danger">{trainerError}</p> : null}
            <p className="mt-4 text-xs text-on-surface-variant">If you have an injury, medical condition, or pain, speak with a qualified professional before training.</p>
          </GlassCard>
        ) : null}

        {plan ? <>
          <GlassCard className="overflow-hidden border-0 bg-[radial-gradient(circle_at_90%_10%,rgba(192,193,255,0.35),transparent_32%),linear-gradient(120deg,#292a9e,#6063ee_58%,#00885d)] text-white shadow-xl shadow-primary/20">
            <div className="relative z-10 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Your seven-day system</p><h2 className="mt-2 text-2xl font-bold">{plan.name}</h2><p className="mt-1 text-sm text-white/80">{plan.sessionMinutes} minutes a day · {plan.goal.replace("-", " ")} · full-body balance</p></div><div className="flex flex-col items-end gap-3"><Dumbbell className="hidden h-12 w-12 text-white/80 sm:block" /><Button variant="secondary" onClick={() => void savePlan()} disabled={savingPlan}><Save className="h-4 w-4" /> {savingPlan ? "Saving..." : planSaved ? "Saved" : "Save plan"}</Button></div></div>
          </GlassCard>

          <section><div className="mb-3 flex items-center justify-between"><div><h2 className="font-bold text-on-surface">Next 7 days</h2><p className="text-sm text-on-surface-variant">Starting today. Pick any day to train.</p></div><CalendarDays className="h-5 w-5 text-primary" /></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">{week.map(({ dateKey, day, log }) => <button type="button" key={dateKey} onClick={() => setSelectedDate(dateKey)} className={`min-h-28 rounded-2xl border p-3 text-left transition ${dateKey === selectedDate ? "border-primary bg-primary text-on-primary shadow-lg shadow-primary/20" : "border-outline-variant/25 bg-surface-container-lowest hover:border-primary/40"}`}><div className="flex items-center justify-between"><p className={`text-xs font-bold ${dateKey === selectedDate ? "text-white/75" : "text-on-surface-variant"}`}>{days[new Date(`${dateKey}T12:00:00`).getDay()]}</p>{log?.completedAt ? <Check className="h-4 w-4 text-tertiary-fixed" /> : null}</div><p className="mt-2 text-sm font-bold">{day?.name ?? "Training"}</p><p className={`mt-1 text-xs ${dateKey === selectedDate ? "text-white/75" : "text-on-surface-variant"}`}>{dateKey === today ? "Today" : dateKey.slice(5).replace("-", "/")}</p></button>)}</div></section>

          <section><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{selectedDate === today ? "Today" : selectedDate}</p><h2 className="mt-1 font-bold text-on-surface">{selectedWorkout?.name ?? "Training session"}</h2><p className="text-sm text-on-surface-variant">{selectedWorkout?.focus ?? "Build a healthy, consistent training habit."}</p></div><div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={sendWorkoutToTasks} disabled={!selectedWorkout}><ListPlus className="h-4 w-4" /> {taskAdded ? "Added to tasks" : "Send to tasks"}</Button><Button onClick={() => toggleWorkout(selectedEntry?.dateKey ?? today)} variant={logs[selectedEntry?.dateKey ?? today]?.completedAt ? "secondary" : "primary"}>{logs[selectedEntry?.dateKey ?? today]?.completedAt ? <><Check className="h-4 w-4" /> Completed</> : "Finish workout"}</Button></div></div>{selectedWorkout ? <div className="grid gap-3 md:grid-cols-2">{selectedWorkout.exercises.map((item) => { const guide = getGymExerciseGuide(item.name); const guideOpen = openGuide === item.id; return <GlassCard key={item.id} hover className="p-4"><div className="flex items-center justify-between gap-3"><div><h3 className="font-semibold text-on-surface">{item.name}</h3><p className="text-xs text-on-surface-variant">{item.muscleGroup} · {item.sets.length} sets · {item.sets[0]?.reps ?? "-"} reps</p></div><Timer className="h-5 w-5 shrink-0 text-primary" /></div><div className="mt-3 grid grid-cols-3 gap-2">{item.sets.map((set, index) => <div key={set.id} className="rounded-lg bg-surface-container-low px-2 py-2 text-center text-xs"><span className="block font-semibold text-on-surface">Set {index + 1}</span><span className="text-on-surface-variant">{set.reps ?? "-"} reps</span></div>)}</div><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => setOpenGuide(guideOpen ? null : item.id)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary-fixed px-3 py-2 text-xs font-bold text-primary focus-ring"><ChevronDown className={`h-4 w-4 transition-transform ${guideOpen ? "rotate-180" : ""}`} /> How to do it</button><a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(guide.searchTerm)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-2 text-xs font-bold text-on-surface-variant focus-ring"><PlayCircle className="h-4 w-4" /> Watch demo</a></div>{guideOpen ? <div className="mt-4 border-t border-outline-variant/25 pt-4"><p className="text-sm text-on-surface">{guide.summary}</p><ol className="mt-3 space-y-2 text-sm text-on-surface-variant">{guide.steps.map((step, index) => <li key={step} className="flex gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">{index + 1}</span><span>{step}</span></li>)}</ol><div className="mt-3 rounded-xl bg-tertiary-fixed/30 p-3 text-xs text-on-surface"><p className="flex items-center gap-1 font-bold"><ShieldCheck className="h-4 w-4 text-tertiary" /> Form cues</p><ul className="mt-1 list-disc space-y-1 pl-4">{guide.cues.map((cue) => <li key={cue}>{cue}</li>)}</ul><p className="mt-2 font-medium">Avoid: {guide.avoid}</p></div></div> : null}</GlassCard>; })}</div> : null}</section>
        </> : null}
      </div>
      {plan ? <ResponsiveDialog open={editorOpen} onClose={() => setEditorOpen(false)} title="Edit saved plan" className="max-h-[90dvh] overflow-hidden md:max-w-3xl"><GymPlanEditor plan={plan} onCancel={() => setEditorOpen(false)} onSave={(updatedPlan) => { setPlan(updatedPlan); setEditorOpen(false); }} /></ResponsiveDialog> : null}
    </div>
  );
}
