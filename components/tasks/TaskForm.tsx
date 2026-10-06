"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import type { Task, TaskPriority, TaskType } from "@/lib/types";
import { toDateKey } from "@/lib/dates";

export type TaskFormValues = {
  title: string;
  notes: string;
  type: TaskType;
  priority: TaskPriority;
  dueDate: string;
};

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
  const [dueDate, setDueDate] = useState(
    initial?.dueDate ?? toDateKey(),
  );

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

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <Label htmlFor="task-title">Title</Label>
        <Input
          id="task-title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          autoFocus
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="task-type">Type</Label>
          <select
            id="task-type"
            className="w-full min-h-11 rounded-2xl border border-[var(--glass-border)] bg-white/70 dark:bg-white/5 px-3 focus-ring"
            value={type}
            onChange={(e) => setType(e.target.value as TaskType)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <Label htmlFor="task-priority">Priority</Label>
          <select
            id="task-priority"
            className="w-full min-h-11 rounded-2xl border border-[var(--glass-border)] bg-white/70 dark:bg-white/5 px-3 focus-ring"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
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
