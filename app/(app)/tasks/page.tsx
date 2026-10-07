"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Plus, Search, ListTodo } from "lucide-react";
import { MobileHeader, MobileFab } from "@/components/layout/AppShell";
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

  const openPct = useMemo(() => {
    if (!counts.all) return 0;
    return Math.round((counts.completed / counts.all) * 100);
  }, [counts]);

  const openNew = useCallback(() => {
    setEditing(null);
    setEditorOpen(true);
  }, []);

  const onSave = (values: TaskFormValues) => {
    if (editing) updateTask(editing.id, values);
    else addTask(values);
    setEditorOpen(false);
    setEditing(null);
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
      <MobileHeader title="Tasks List" />
      <KeyboardShortcuts
        onNewTask={openNew}
        onSearch={() => searchRef.current?.focus()}
      />

      <div className="px-4 md:px-0 flex flex-col gap-4">
        <div className="hidden md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">Tasks</h1>
            <p className="text-sm text-on-surface-variant">
              Press N for new · / to search
            </p>
          </div>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> New task
          </Button>
        </div>

        {/* Progress pill */}
        <div className="flex items-center justify-between bg-surface-container-low px-4 py-3 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--surface-container-highest)"
                  strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--primary)"
                  strokeDasharray={`${openPct}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute text-[0.6875rem] font-bold text-primary">
                {openPct}%
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-on-surface truncate leading-tight">
                Focus Flow Active
              </span>
              <span className="text-[0.75rem] text-on-surface-variant truncate">
                {counts.completed} of {counts.all} tasks knocked out!
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full text-secondary text-[0.6875rem] font-semibold">
            <span>🔥</span>
            <span>{counts.pending} open</span>
          </div>
        </div>

        {/* Segmented tabs */}
        <div className="flex items-center p-1 bg-surface-container-low rounded-xl overflow-x-auto no-scrollbar shadow-[inset_0_1px_3px_rgba(11,28,48,0.06)]">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setFilters((f) => ({ ...f, tab: t.key }))}
              className={cn(
                "relative z-10 flex-1 min-w-[76px] py-2 px-3 rounded-lg text-center text-[0.75rem] font-semibold transition-all",
                filters.tab === t.key
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Search + chips */}
        <div className="flex flex-col gap-2.5">
          <div className="relative flex items-center w-full">
            <Search className="pointer-events-none absolute left-3 h-5 w-5 text-on-surface-variant" />
            <Input
              ref={searchRef}
              value={filters.query}
              onChange={(e) =>
                setFilters((f) => ({ ...f, query: e.target.value }))
              }
              placeholder="Search tasks…"
              className="pl-10 bg-surface-container-lowest shadow-sm"
              aria-label="Search tasks"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <select
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface text-[0.6875rem] font-semibold flex-shrink-0 shadow-sm focus-ring border-0"
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  status: e.target.value as TaskFilters["status"],
                }))
              }
              aria-label="Filter by status"
            >
              <option value="all">Status: All</option>
              <option value="open">Status: Open</option>
              <option value="done">Status: Done</option>
            </select>
            <select
              className="px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface text-[0.6875rem] font-semibold flex-shrink-0 shadow-sm focus-ring border-0"
              value={filters.priority}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  priority: e.target.value as TaskFilters["priority"],
                }))
              }
              aria-label="Filter by priority"
            >
              <option value="all">Priority: All</option>
              <option value="high">Priority: High</option>
              <option value="medium">Priority: Medium</option>
              <option value="low">Priority: Low</option>
            </select>
            <select
              className="px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface text-[0.6875rem] font-semibold flex-shrink-0 shadow-sm focus-ring border-0"
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
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold tracking-tight text-on-surface">
            Active Deliverables
          </span>
          <span className="text-[0.6875rem] text-on-surface-variant">
            {list.filter((t) => !t.done).length} remaining
          </span>
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
          <ul className="space-y-3.5">
            {list.map((task) => (
              <li key={task.id}>
                <TaskRow
                  task={task}
                  onToggle={() => toggleTaskDone(task.id)}
                  onDelete={() => setConfirmDelete(task)}
                  onEdit={() => {
                    setEditing(task);
                    setEditorOpen(true);
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <MobileFab onClick={openNew} />

      <ResponsiveDialog
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit task" : "Create New Task"}
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
        <p className="text-sm text-on-surface-variant">
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
