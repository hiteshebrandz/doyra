"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Plus, Search, ListTodo } from "lucide-react";
import { MobileHeader } from "@/components/layout/AppShell";
import { KeyboardShortcuts } from "@/components/layout/KeyboardShortcuts";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { ResponsiveDialog } from "@/components/ui/Sheet";
import { useToast } from "@/components/ui/Toast";
import { TaskRow } from "@/components/tasks/TaskRow";
import { TaskForm, type TaskFormValues } from "@/components/tasks/TaskForm";
import {
  filterSortTasks,
  taskCounts,
  useTasks,
  type TaskFilters,
} from "@/hooks/useTasks";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function TasksPage() {
  const { tasks, addTask, updateTask, toggleTaskDone, deleteTask, restoreTask } =
    useTasks();
  const { toast } = useToast();
  const searchRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<TaskFilters>({
    tab: "all",
    status: "all",
    priority: "all",
    query: "",
    sort: "due",
  });
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Task | null>(null);

  const counts = useMemo(() => taskCounts(tasks), [tasks]);
  const list = useMemo(
    () => filterSortTasks(tasks, filters),
    [tasks, filters],
  );

  const openNew = useCallback(() => {
    setEditing(null);
    setEditorOpen(true);
  }, []);

  const onSave = (values: TaskFormValues) => {
    if (editing) {
      updateTask(editing.id, values);
    } else {
      addTask(values);
    }
    setEditorOpen(false);
    setEditing(null);
  };

  const handleDelete = (task: Task) => {
    setConfirmDelete(task);
  };

  const confirmDeleteAction = () => {
    if (!confirmDelete) return;
    const removed = deleteTask(confirmDelete.id);
    setConfirmDelete(null);
    if (removed) {
      toast({
        title: "Task deleted",
        actionLabel: "Undo",
        onAction: () => restoreTask(removed),
      });
    }
  };

  const tabs: { key: TaskFilters["tab"]; label: string; count: number }[] = [
    { key: "daily", label: "Daily", count: counts.daily },
    { key: "weekly", label: "Weekly", count: counts.weekly },
    { key: "monthly", label: "Monthly", count: counts.monthly },
    { key: "all", label: "All", count: counts.all },
  ];

  return (
    <div>
      <MobileHeader title="Tasks" />
      <KeyboardShortcuts
        onNewTask={openNew}
        onSearch={() => searchRef.current?.focus()}
      />

      <div className="mb-4 hidden md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-[var(--muted)]">
            Press <kbd className="rounded bg-black/5 px-1 dark:bg-white/10">N</kbd>{" "}
            for new · <kbd className="rounded bg-black/5 px-1 dark:bg-white/10">/</kbd>{" "}
            to search
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> New task
        </Button>
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilters((f) => ({ ...f, tab: t.key }))}
            className={cn(
              "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-2xl px-3.5 text-sm font-semibold focus-ring",
              filters.tab === t.key
                ? "bg-primary text-white"
                : "glass text-[var(--muted)]",
            )}
          >
            {t.label}
            <span
              className={cn(
                "tabular rounded-full px-1.5 text-xs",
                filters.tab === t.key ? "bg-white/20" : "bg-black/5 dark:bg-white/10",
              )}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <Input
            ref={searchRef}
            value={filters.query}
            onChange={(e) =>
              setFilters((f) => ({ ...f, query: e.target.value }))
            }
            placeholder="Search tasks…"
            className="pl-10"
            aria-label="Search tasks"
          />
        </div>
        <select
          className="min-h-11 rounded-2xl border border-[var(--glass-border)] bg-white/70 dark:bg-white/5 px-3 focus-ring"
          value={filters.status}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              status: e.target.value as TaskFilters["status"],
            }))
          }
          aria-label="Filter by status"
        >
          <option value="all">All status</option>
          <option value="open">Open</option>
          <option value="done">Done</option>
        </select>
        <select
          className="min-h-11 rounded-2xl border border-[var(--glass-border)] bg-white/70 dark:bg-white/5 px-3 focus-ring"
          value={filters.priority}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              priority: e.target.value as TaskFilters["priority"],
            }))
          }
          aria-label="Filter by priority"
        >
          <option value="all">All priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          className="min-h-11 rounded-2xl border border-[var(--glass-border)] bg-white/70 dark:bg-white/5 px-3 focus-ring"
          value={filters.sort}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              sort: e.target.value as TaskFilters["sort"],
            }))
          }
          aria-label="Sort tasks"
        >
          <option value="due">Sort: due</option>
          <option value="priority">Sort: priority</option>
          <option value="created">Sort: created</option>
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={<ListTodo className="h-6 w-6" />}
          title="No tasks yet"
          description="Add a task to get momentum. Swipe right to complete, left to delete."
          action={
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" /> Add task
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2">
          {list.map((task) => (
            <li key={task.id}>
              <TaskRow
                task={task}
                onToggle={() => toggleTaskDone(task.id)}
                onDelete={() => handleDelete(task)}
                onEdit={() => {
                  setEditing(task);
                  setEditorOpen(true);
                }}
              />
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={openNew}
        className="fixed bottom-[calc(var(--tabbar-h)+var(--safe-bottom)+16px)] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg focus-ring md:hidden active:scale-95"
        aria-label="Add task"
      >
        <Plus className="h-6 w-6" />
      </button>

      <ResponsiveDialog
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit task" : "New task"}
      >
        <TaskForm
          key={editing?.id ?? "new"}
          initial={editing ?? undefined}
          onSubmit={onSave}
          onCancel={() => {
            setEditorOpen(false);
            setEditing(null);
          }}
          submitLabel={editing ? "Save changes" : "Add task"}
        />
      </ResponsiveDialog>

      <ResponsiveDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete task?"
      >
        <p className="text-sm text-[var(--muted)]">
          “{confirmDelete?.title}” will be removed. You can undo from the toast.
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setConfirmDelete(null)}
          >
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={confirmDeleteAction}>
            Delete
          </Button>
        </div>
      </ResponsiveDialog>
    </div>
  );
}
