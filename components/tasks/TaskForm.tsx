"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import type { Task, TaskPriority, TaskType } from "@/lib/types";
import { toDateKey } from "@/lib/dates";
import { cn } from "@/lib/utils";

export type TaskFormValues = {
  title: string;
  notes: string;
  type: TaskType;
  priority: TaskPriority;
  dueDate: string;
};

const SCOPES: { value: TaskType; label: string; emoji: string }[] = [
  { value: "daily", label: "Daily", emoji: "☀️" },
  { value: "weekly", label: "Weekly", emoji: "🗓️" },
  { value: "monthly", label: "Monthly", emoji: "🎯" },
];

const PRIORITIES: {
  value: TaskPriority;
  label: string;
  hint: string;
  dot: string;
}[] = [
  { value: "low", label: "Low", hint: "Easy pace", dot: "bg-tertiary-container shadow-[0_0_6px_rgba(0,136,93,0.35)]" },
  { value: "medium", label: "Medium", hint: "Normal focus", dot: "bg-primary shadow-[0_0_6px_rgba(70,72,212,0.35)]" },
  { value: "high", label: "High", hint: "Urgent push", dot: "bg-error shadow-[0_0_6px_rgba(186,26,26,0.35)]" },
];

export function TaskForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: {
  initial?: Partial<Task>;
  onSubmit: (values: TaskFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [type, setType] = useState<TaskType>(initial?.type ?? "daily");
  const [priority, setPriority] = useState<TaskPriority>(
    initial?.priority ?? "medium",
  );
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? toDateKey());

  const handle = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      notes: notes.trim(),
      type,
      priority,
      dueDate,
    });
  };

  const priorityHint =
    PRIORITIES.find((p) => p.value === priority)?.hint ?? "Normal focus";

  return (
    <form onSubmit={handle} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center px-0.5">
          <Label htmlFor="task-title" className="mb-0">
            Task Title
          </Label>
          <span className="text-[0.6875rem] font-medium text-primary">Required</span>
        </div>
        <Input
          id="task-title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Complete UI animations"
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="px-0.5">Frequency &amp; Scope</Label>
        <div className="w-full p-1 bg-surface-container-low rounded-xl flex items-center">
          {SCOPES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setType(s.value)}
              className={cn(
                "flex-1 py-2 px-1 rounded-lg font-semibold text-sm transition-all text-center flex items-center justify-center gap-1.5",
                type === s.value
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-0.5">
          <Label className="mb-0">Priority Matrix</Label>
          <span className="text-[0.6875rem] font-semibold text-tertiary-container">
            {priorityHint}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl transition-all",
                priority === p.value
                  ? "bg-surface-container-lowest shadow-sm ring-2 ring-primary/30"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container",
              )}
            >
              <span className={cn("w-2.5 h-2.5 rounded-full", p.dot)} />
              <span className="font-medium text-sm">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="task-due">Due date</Label>
        <Input
          id="task-due"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="task-notes">Notes</Label>
        <Textarea
          id="task-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional details"
        />
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
