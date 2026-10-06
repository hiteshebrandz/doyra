"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { MobileHeader } from "@/components/layout/AppShell";
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
import { useHabits } from "@/hooks/useHabits";
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
        .filter((t) => t.dueDate === today || (!t.done && t.dueDate === today))
        .sort((a, b) => Number(a.done) - Number(b.done)),
    [tasks, today],
  );

  const habitPct = useMemo(() => {
    if (!active.length) return 0;
    const month = toMonthKey();
    const day = dayOfMonthKey();
    const dayLog = logs[month]?.[day] ?? {};
    const done = active.filter((h) => dayLog[h.id]).length;
    return Math.round((done / active.length) * 100);
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

  const onSave = (values: TaskFormValues) => {
    if (editingId) {
      updateTask(editingId, values);
    } else {
      addTask(values);
    }
    setOpen(false);
    setEditingId(null);
  };

  return (
    <div>
      <MobileHeader title="Dashboard" />
      <KeyboardShortcuts onNewTask={() => setOpen(true)} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {greetingForNow()}, {name}
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Here&apos;s your focus for today.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Today", value: counts.today, color: "text-primary" },
          { label: "Pending", value: counts.pending, color: "text-warning" },
          { label: "Completed", value: counts.completed, color: "text-success" },
          { label: "Overdue", value: counts.overdue, color: "text-danger" },
        ].map((s) => (
          <GlassCard key={s.label} hover className="!p-4">
            <p className="text-sm text-[var(--muted)]">{s.label}</p>
            <p className={`mt-1 text-3xl font-bold tabular ${s.color}`}>
              {s.value}
            </p>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Today&apos;s tasks</h2>
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
          {todayTasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--muted)]">
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

        <GlassCard className="flex flex-col items-center">
          <h2 className="mb-3 self-start font-semibold">Habits today</h2>
          <ProgressRing value={habitPct} label="complete" />
          <ul className="mt-4 w-full space-y-2">
            {active.slice(0, 5).map((h) => {
              const checked =
                !!logs[toMonthKey()]?.[dayOfMonthKey()]?.[h.id];
              return (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => toggleHabitCheckIn(h.id, today)}
                    className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left hover:bg-black/5 dark:hover:bg-white/5 focus-ring"
                  >
                    <span className="text-xl">{h.icon}</span>
                    <span className="flex-1 font-medium">{h.name}</span>
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: checked ? h.color : "var(--glass-border)",
                      }}
                    />
                  </button>
                </li>
              );
            })}
            {active.length === 0 ? (
              <p className="text-center text-sm text-[var(--muted)]">
                Create a habit to track progress.
              </p>
            ) : null}
          </ul>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <h2 className="mb-3 font-semibold">This week</h2>
          <WeeklyBarChart data={weeklyData} />
        </GlassCard>

        <GlassCard>
          <HabitHeatmap habits={active} logs={logs} />
        </GlassCard>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-[calc(var(--tabbar-h)+var(--safe-bottom)+16px)] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg focus-ring md:hidden active:scale-95"
        aria-label="Quick add"
      >
        <Plus className="h-6 w-6" />
      </button>

      <ResponsiveDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingId(null);
        }}
        title={editingId ? "Edit task" : "Quick add"}
      >
        <TaskForm
          key={editingId ?? "new"}
          initial={
            editingId ? tasks.find((t) => t.id === editingId) : undefined
          }
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

