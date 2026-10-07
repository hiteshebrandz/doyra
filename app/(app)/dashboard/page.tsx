"use client";

import { useMemo, useState } from "react";
import { CheckSquare, ListChecks, Flame, BadgeCheck, Plus } from "lucide-react";
import { MobileHeader, MobileFab } from "@/components/layout/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ResponsiveDialog } from "@/components/ui/Sheet";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { WeeklyBarChart } from "@/components/dashboard/WeeklyBarChart";
import { HabitHeatmap } from "@/components/dashboard/HabitHeatmap";
import { TaskForm, type TaskFormValues } from "@/components/tasks/TaskForm";
import { TaskRow } from "@/components/tasks/TaskRow";
import { useAuth } from "@/hooks/useAuth";
import { useTasks, taskCounts } from "@/hooks/useTasks";
import { useHabits, useHabitStats } from "@/hooks/useHabits";
import { useAppStore } from "@/store/app-store";
import {
  greetingForNow,
  toDateKey,
  toMonthKey,
  weekDayKeys,
  dayOfMonthKey,
} from "@/lib/dates";
import { useToast } from "@/components/ui/Toast";
import { KeyboardShortcuts } from "@/components/layout/KeyboardShortcuts";
import { cn, vibrate } from "@/lib/utils";
import { Check } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const settings = useAppStore((s) => s.settings);
  const logs = useAppStore((s) => s.logs);
  const { tasks, addTask, toggleTaskDone, deleteTask, restoreTask, updateTask } =
    useTasks();
  const { active, toggleHabitCheckIn } = useHabits();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const today = toDateKey();
  const name =
    settings.displayName ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "there";

  const counts = useMemo(() => taskCounts(tasks), [tasks]);
  const todayTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.dueDate === today)
        .sort((a, b) => Number(a.done) - Number(b.done)),
    [tasks, today],
  );

  const habitDone = useMemo(() => {
    if (!active.length) return { done: 0, pct: 0 };
    const month = toMonthKey();
    const day = dayOfMonthKey();
    const dayLog = logs[month]?.[day] ?? {};
    const done = active.filter((h) => dayLog[h.id]).length;
    return { done, pct: Math.round((done / active.length) * 100) };
  }, [active, logs]);

  const weeklyData = useMemo(() => {
    const keys = weekDayKeys(new Date(), settings.weekStart);
    const labels =
      settings.weekStart === 1
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return keys.map((key, i) => {
      const month = key.slice(0, 7);
      const day = key.slice(8);
      const dayLog = logs[month]?.[day] ?? {};
      const value = active.filter((h) => dayLog[h.id]).length;
      return { label: labels[i], value };
    });
  }, [logs, active, settings.weekStart]);

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const onSave = (values: TaskFormValues) => {
    if (editingId) updateTask(editingId, values);
    else addTask(values);
    setOpen(false);
    setEditingId(null);
  };

  const stats = [
    {
      label: "Today's Tasks",
      value: counts.today,
      hint: `${counts.pending} remaining`,
      icon: <CheckSquare className="h-[18px] w-[18px]" />,
      glow: "bg-primary-fixed/40",
      iconBg: "bg-primary-fixed text-primary shadow-[0_0_12px_rgba(70,72,212,0.2)]",
      shadow: "shadow-[0_10px_25px_-5px_rgba(70,72,212,0.08)]",
    },
    {
      label: "Completed",
      value: counts.completed,
      hint: "Keep going",
      icon: <ListChecks className="h-[18px] w-[18px]" />,
      glow: "bg-tertiary-fixed/50",
      iconBg: "bg-tertiary-fixed text-tertiary shadow-[0_0_12px_rgba(0,108,73,0.2)]",
      shadow: "shadow-[0_10px_25px_-5px_rgba(0,108,73,0.08)]",
    },
    {
      label: "Habits Done",
      value: `${habitDone.done}/${active.length || 0}`,
      hint: habitDone.pct >= 75 ? "High flow state" : "Build momentum",
      icon: <Flame className="h-[18px] w-[18px]" />,
      glow: "bg-secondary-fixed/50",
      iconBg: "bg-secondary-fixed text-secondary",
      shadow: "shadow-[0_10px_25px_-5px_rgba(107,56,212,0.08)]",
    },
    {
      label: "Overdue",
      value: counts.overdue,
      hint: counts.overdue === 0 ? "Caught up 🎉" : "Needs attention",
      icon: <BadgeCheck className="h-[18px] w-[18px]" />,
      glow: "bg-surface-container-high/60",
      iconBg: "bg-surface-container text-on-surface-variant",
      shadow: "shadow-[0_10px_25px_-5px_rgba(70,72,212,0.06)]",
    },
  ];

  return (
    <div>
      <MobileHeader title="Dashboard Today" />
      <KeyboardShortcuts onNewTask={() => setOpen(true)} />

      <div className="px-4 md:px-0 space-y-6">
        {/* Hero greeting */}
        <section className="relative w-full rounded-3xl p-5 overflow-hidden bg-surface-container-lowest shadow-[0_12px_32px_-4px_rgba(70,72,212,0.08),0_4px_16px_rgba(11,28,48,0.03)]">
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-primary-fixed/60 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-secondary-fixed/50 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[0.75rem] font-semibold tracking-wide uppercase text-on-surface-variant">
                {dateLabel}
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/70 text-secondary text-[0.6875rem] font-bold">
                <span>🔥</span>
                <span>Keep your flow</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-[2rem] font-bold tracking-tight text-on-surface">
                {greetingForNow()}, {name}{" "}
                <span className="inline-block">✨</span>
              </h1>
              <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                “Small disciplined actions compound into quiet mastery.”
              </p>
            </div>
          </div>
        </section>

        {/* Stat cards */}
        <section className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={cn(
                "relative overflow-hidden rounded-2xl p-4 bg-surface-container-lowest active:scale-[0.98] transition-all flex flex-col justify-between",
                s.shadow,
              )}
            >
              <div
                className={cn(
                  "absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-xl pointer-events-none",
                  s.glow,
                )}
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.6875rem] font-medium text-on-surface-variant">
                  {s.label}
                </span>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    s.iconBg,
                  )}
                >
                  {s.icon}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-on-surface tabular">{s.value}</div>
                <div className="text-[0.75rem] text-on-surface-variant mt-0.5">{s.hint}</div>
              </div>
            </div>
          ))}
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Habit focus */}
          <GlassCard className="rounded-3xl lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-on-surface">Habit Focus</h2>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-[0.6875rem] font-semibold">
                    Today
                  </span>
                </div>
                <p className="text-[0.75rem] text-on-surface-variant mt-0.5">
                  Maintain consistent momentum
                </p>
              </div>
              <ProgressRing value={habitDone.pct} size={56} stroke={4.5} />
            </div>
            <ul className="space-y-2.5">
              {active.slice(0, 5).map((h) => {
                const checked = !!logs[toMonthKey()]?.[dayOfMonthKey()]?.[h.id];
                return (
                  <HabitFocusRow
                    key={h.id}
                    habitId={h.id}
                    name={h.name}
                    icon={h.icon}
                    checked={checked}
                    onToggle={() => {
                      vibrate(10);
                      toggleHabitCheckIn(h.id, today);
                    }}
                  />
                );
              })}
              {active.length === 0 ? (
                <p className="text-center text-sm text-on-surface-variant py-4">
                  Create a habit to track progress.
                </p>
              ) : null}
            </ul>
          </GlassCard>

          {/* Today tasks */}
          <GlassCard className="rounded-3xl lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold text-on-surface">Today&apos;s tasks</h2>
              <Button size="sm" onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
            {todayTasks.length === 0 ? (
              <p className="py-8 text-center text-sm text-on-surface-variant">
                No tasks due today. Enjoy the calm — or add one.
              </p>
            ) : (
              <ul className="space-y-2">
                {todayTasks.slice(0, 8).map((task) => (
                  <li key={task.id}>
                    <TaskRow
                      task={task}
                      onToggle={() => toggleTaskDone(task.id)}
                      onDelete={() => {
                        const removed = deleteTask(task.id);
                        if (removed) {
                          toast({
                            title: "Task deleted",
                            actionLabel: "Undo",
                            onAction: () => restoreTask(removed),
                          });
                        }
                      }}
                      onEdit={() => {
                        setEditingId(task.id);
                        setOpen(true);
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>

          <GlassCard className="rounded-3xl lg:col-span-2">
            <h2 className="mb-3 font-bold text-on-surface">This week</h2>
            <WeeklyBarChart data={weeklyData} />
          </GlassCard>

          <GlassCard className="rounded-3xl">
            <HabitHeatmap habits={active} logs={logs} />
          </GlassCard>
        </div>
      </div>

      <MobileFab onClick={() => setOpen(true)} />

      <ResponsiveDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingId(null);
        }}
        title={editingId ? "Edit task" : "Create New Task"}
      >
        <TaskForm
          key={editingId ?? "new"}
          initial={editingId ? tasks.find((t) => t.id === editingId) : undefined}
          onSubmit={onSave}
          onCancel={() => {
            setOpen(false);
            setEditingId(null);
          }}
        />
      </ResponsiveDialog>
    </div>
  );
}

function HabitFocusRow({
  habitId,
  name,
  icon,
  checked,
  onToggle,
}: {
  habitId: string;
  name: string;
  icon: string;
  checked: boolean;
  onToggle: () => void;
}) {
  const stats = useHabitStats(habitId);
  return (
    <div
      className={cn(
        "group flex items-center justify-between p-3 rounded-2xl transition-all active:scale-[0.99]",
        checked ? "bg-surface-container-low" : "bg-surface-container-lowest shadow-[0_4px_16px_rgba(70,72,212,0.08)]",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center text-lg shadow-sm flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <span
            className={cn(
              "font-medium text-on-surface block truncate text-sm",
              checked && "line-through opacity-70",
            )}
          >
            {name}
          </span>
          <span className="text-[0.6875rem] font-semibold text-tertiary">
            {stats.current}-day streak 🔥
          </span>
        </div>
      </div>
      <button
        type="button"
        aria-label={checked ? "Uncheck" : "Check"}
        onClick={onToggle}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 focus-ring",
          checked
            ? "bg-tertiary text-on-tertiary shadow-[0_0_12px_rgba(0,108,73,0.35)]"
            : "bg-surface-container text-on-surface-variant",
        )}
      >
        {checked ? <Check className="h-[18px] w-[18px]" /> : null}
      </button>
    </div>
  );
}
