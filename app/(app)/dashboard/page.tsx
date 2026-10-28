"use client";

import { useMemo, useState } from "react";
import { CheckSquare, ListChecks, Flame, BadgeCheck, Plus, Check } from "lucide-react";
import { MobileHeader, MobileFab } from "@/components/layout/AppShell";
import { HabitIcon } from "@/components/habits/HabitIcon";
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
      iconBg: "bg-primary-fixed text-primary",
      shadow: "border border-outline-variant",
    },
    {
      label: "Completed",
      value: counts.completed,
      hint: "All time",
      icon: <ListChecks className="h-[18px] w-[18px]" />,
      glow: "bg-tertiary-fixed/50",
      iconBg: "bg-tertiary-fixed text-tertiary",
      shadow: "border border-outline-variant",
    },
    {
      label: "Habits Done",
      value: `${habitDone.done}/${active.length || 0}`,
      hint: habitDone.pct >= 75 ? "Almost all done" : "Still to check",
      icon: <Flame className="h-[18px] w-[18px]" />,
      glow: "bg-secondary-fixed/50",
      iconBg: "bg-secondary-fixed text-secondary",
      shadow: "border border-outline-variant",
    },
    {
      label: "Overdue",
      value: counts.overdue,
      hint: counts.overdue === 0 ? "All clear" : "Needs attention",
      icon: <BadgeCheck className="h-[18px] w-[18px]" />,
      glow: "bg-surface-container-high/60",
      iconBg: "bg-surface-container text-on-surface-variant",
      shadow: "border border-outline-variant",
    },
  ];

  return (
    <div>
      <MobileHeader title="Dashboard Today" />
      <KeyboardShortcuts onNewTask={() => setOpen(true)} />

      <div className="space-y-8 px-5 md:px-0">
        {/* Hero greeting */}
        <section className="relative w-full overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest p-5">
          <div className="relative z-10 flex flex-col space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="min-w-0 truncate text-[13px] font-medium uppercase tracking-[0.14em] text-on-surface-variant">
                {dateLabel}
              </span>
              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-fixed px-3 py-1 text-[12px] font-semibold text-primary">
                <Flame className="h-3.5 w-3.5" aria-hidden />
                <span>Today</span>
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="break-words font-heading text-[2.25rem] font-extrabold leading-none text-on-surface md:text-4xl">
                {greetingForNow()}, {name}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {counts.pending === 0
                  ? "Nothing open today. Add a task or check a habit."
                  : `${counts.pending} task${counts.pending === 1 ? "" : "s"} still open. Habits ${habitDone.done} of ${active.length} done.`}
              </p>
            </div>
          </div>
        </section>

        {/* Stat cards */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className={cn(
                "relative flex flex-col justify-between overflow-hidden rounded-3xl bg-surface-container-lowest p-5 transition duration-200 active:scale-[0.98]",
                s.shadow,
              )}
            >
              <div
                className={cn(
                  "absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-xl pointer-events-none",
                  s.glow,
                )}
              />
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="min-w-0 text-[0.6875rem] font-medium leading-tight text-on-surface-variant">
                  {s.label}
                </span>
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    s.iconBg,
                  )}
                >
                  {s.icon}
                </div>
              </div>
              <div>
                <div className="font-heading text-[2.625rem] font-extrabold leading-none text-on-surface tabular">{s.value}</div>
                <div className="text-[0.75rem] text-on-surface-variant mt-0.5">{s.hint}</div>
              </div>
            </div>
          ))}
        </section>

        <div className="grid gap-5 lg:grid-cols-3">
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
                  Tap the circle when a habit is done
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
                No tasks due today. Add one if something comes up.
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
        checked ? "border border-outline-variant bg-surface-container-low" : "border border-outline-variant bg-surface-container-lowest",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant">
          <HabitIcon icon={icon} className="h-[18px] w-[18px]" />
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
          <span className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-tertiary">
            <Flame className="h-3 w-3" aria-hidden />
            {stats.current}-day streak
          </span>
        </div>
      </div>
      <button
        type="button"
        aria-label={checked ? "Uncheck" : "Check"}
        onClick={onToggle}
        className={cn(
          "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border transition-transform duration-150 active:scale-95 focus-ring",
          checked
            ? "border-transparent bg-[var(--lime)] text-[#0d0d0d]"
            : "border-outline-variant bg-transparent text-on-surface-variant",
        )}
      >
        {checked ? <Check className="h-[18px] w-[18px]" /> : null}
      </button>
    </div>
  );
}
