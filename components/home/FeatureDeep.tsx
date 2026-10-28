"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  Check,
  Clock,
  Dumbbell,
  Flame,
  ListChecks,
  Pencil,
  Timer,
  Trash2,
} from "lucide-react";
import { HabitIcon } from "@/components/habits/HabitIcon";
import { cn } from "@/lib/utils";
import { hoverLift } from "./motion";
import { Reveal, RevealItem } from "./Reveal";

/* ---------- Tasks cutout: three rows the way TaskRow draws them ---------- */

const TASK_ROWS = [
  { title: "Call the dentist", priority: "High", type: "Daily", due: "Today", done: false },
  { title: "Push the release notes", priority: "Medium", type: "Weekly", due: "Fri", done: false, remind: "6:30 pm" },
  { title: "Water the plants", priority: "Low", type: "Daily", due: "Today", done: true },
] as const;

function TasksCutout() {
  return (
    <ul className="space-y-2.5">
      {TASK_ROWS.map((t) => (
        <li
          key={t.title}
          className={cn(
            "rounded-3xl border border-outline-variant bg-surface-container-lowest p-4",
            t.done && "opacity-80",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                  t.done
                    ? "border-transparent bg-[var(--lime)] text-[#0d0d0d]"
                    : "border-outline-variant text-transparent",
                )}
                aria-hidden
              >
                <Check className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap gap-1.5">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold",
                      t.priority === "High"
                        ? "bg-error text-on-error"
                        : t.priority === "Medium"
                          ? "bg-primary-fixed text-primary"
                          : "bg-tertiary-fixed/40 text-tertiary",
                    )}
                  >
                    {t.priority} Priority
                  </span>
                  <span className="rounded-full bg-surface-container px-2 py-0.5 text-[0.6875rem] font-semibold text-on-surface-variant">
                    {t.type}
                  </span>
                </div>
                <p className={cn("font-semibold leading-snug text-on-surface", t.done && "line-through opacity-60")}>
                  {t.title}
                </p>
              </div>
            </div>
            <span className="flex items-center gap-0.5 text-on-surface-variant" aria-hidden>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg">
                <Pencil className="h-[18px] w-[18px]" />
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg">
                <Trash2 className="h-[18px] w-[18px]" />
              </span>
            </span>
          </div>
          <div className="-mx-4 -mb-4 mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-b-3xl bg-surface-container-low/60 px-4 py-2.5 text-[0.6875rem] font-semibold">
            <span className="flex items-center gap-1.5 text-on-surface-variant">
              <Clock className="h-4 w-4" /> Due {t.due}
            </span>
            {"remind" in t ? (
              <span className="flex items-center gap-1.5 text-primary">
                <Bell className="h-4 w-4" /> Reminder {t.remind}
              </span>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Habits cutout: one HabitCard with its week strip ---------- */

const WEEK = [
  { label: "M", day: "20", on: true },
  { label: "T", day: "21", on: true },
  { label: "W", day: "22", on: false },
  { label: "T", day: "23", on: true },
  { label: "F", day: "24", on: true },
  { label: "S", day: "25", on: true },
  { label: "S", day: "26", on: true, today: true },
];

function HabitsCutout() {
  const color = "#06B6D4";
  return (
    <div className="space-y-2.5">
      <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-4">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${color}22`, color }}
            >
              <HabitIcon icon="droplets" className="h-[22px] w-[22px]" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-on-surface">Water</p>
              <div className="mt-0.5 flex items-center gap-2 text-[0.6875rem]">
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  <Flame className="h-3 w-3" /> 30 day streak
                </span>
                <span className="text-outline-variant">•</span>
                <span className="text-on-surface-variant">88% monthly</span>
                <span className="text-outline-variant">•</span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  <Bell className="h-3 w-3" /> 8:00 pm
                </span>
              </div>
            </div>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--lime)] text-[#0d0d0d]" aria-hidden>
            <Check className="h-[22px] w-[22px]" />
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 pt-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
            <div className="h-full w-[88%] rounded-full bg-primary" />
          </div>
          <span className="text-[0.6875rem] text-on-surface-variant">88%</span>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {WEEK.map((d, i) => (
            <div key={i} className="text-center">
              <span className="mb-1 block text-[10px] font-semibold text-on-surface-variant">{d.label}</span>
              <span
                className={cn(
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                  d.on ? "text-white" : "bg-surface-container text-on-surface-variant",
                  d.today && "ring-2 ring-primary ring-offset-1 ring-offset-surface",
                )}
                style={d.on ? { backgroundColor: color } : undefined}
              >
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-3xl border border-outline-variant bg-surface-container-lowest p-4">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "#8B5CF622", color: "#8B5CF6" }}
        >
          <HabitIcon icon="book-open" className="h-[22px] w-[22px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-on-surface">Reading</p>
          <span className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-primary">
            <Flame className="h-3 w-3" /> 4 day streak
          </span>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-outline-variant" aria-hidden />
      </div>
    </div>
  );
}

/* ---------- Gym cutout: the 7-day picker plus one exercise card ---------- */

const GYM_WEEK = [
  { d: "Mon", name: "Push", done: true },
  { d: "Tue", name: "Pull", done: true },
  { d: "Wed", name: "Legs", done: false, selected: true },
  { d: "Thu", name: "Mobility", done: false },
];

function GymCutout() {
  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-4 gap-2">
        {GYM_WEEK.map((w) => (
          <div
            key={w.d}
            className={cn(
              "min-h-24 rounded-2xl border p-3 text-left",
              w.selected
                ? "border-transparent bg-[var(--lime)] text-[#0d0d0d]"
                : "border-outline-variant/25 bg-surface-container-lowest",
            )}
          >
            <div className="flex items-center justify-between">
              <p className={cn("text-xs font-bold", w.selected ? "text-[#0d0d0d]/70" : "text-on-surface-variant")}>
                {w.d}
              </p>
              {w.done ? <Check className="h-4 w-4 text-primary" /> : null}
            </div>
            <p className="mt-2 text-sm font-bold">{w.name}</p>
            <p className={cn("mt-1 text-xs", w.selected ? "text-[#0d0d0d]/70" : "text-on-surface-variant")}>
              {w.selected ? "Today" : w.d === "Mon" ? "10/26" : w.d === "Tue" ? "10/27" : "10/29"}
            </p>
          </div>
        ))}
      </div>
      <div className="glass-panel rounded-3xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-on-surface">Goblet squat</p>
            <p className="text-xs text-on-surface-variant">Legs · 3 sets · 10 reps</p>
          </div>
          <Timer className="h-5 w-5 shrink-0 text-primary" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-lg bg-surface-container-low px-2 py-2 text-center text-xs">
              <span className="block font-semibold text-on-surface">Set {n}</span>
              <span className="text-on-surface-variant">10 reps</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-fixed px-3 py-2 text-primary">
            How to do it
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-2 text-on-surface-variant">
            Watch demo
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Section ---------- */

const FEATURES = [
  {
    id: "tasks",
    icon: ListChecks,
    kicker: "Tasks",
    title: "A list that tells you what is due, not just what exists.",
    body: "Each task has a scope, a priority and a due date. Overdue ones turn red. Finished ones stay in the list until you delete them, so you can see what a week actually looked like.",
    bullets: ["Daily, weekly and monthly tabs", "Swipe right to finish, left to delete", "Undo from the toast if you slip"],
    cutout: <TasksCutout />,
  },
  {
    id: "habits",
    icon: Flame,
    kicker: "Habits",
    title: "One tap a day. The streak does the counting.",
    body: "Pick a colour and an icon, set an optional reminder, and check it off once a day. The week strip shows where you missed, and the monthly bar shows how the month is going.",
    bullets: ["Streak and monthly percentage per habit", "Heatmap of the whole month on the dashboard", "Archive a habit without losing its history"],
    cutout: <HabitsCutout />,
  },
  {
    id: "gym",
    icon: Dumbbell,
    kicker: "Gym",
    title: "A 7-day plan with the sets written out.",
    body: "Answer three questions and get a plan matched to your level. Every exercise has steps, form cues and a link to watch a demo. Change anything, save it, and send a session to your tasks.",
    bullets: ["Beginner, returning or experienced", "Edit any exercise, set or rest day", "Mark a workout finished from the week view"],
    cutout: <GymCutout />,
  },
];

export function FeatureDeep() {
  const reduce = useReducedMotion();

  return (
    <section id="features" className="scroll-mt-20 border-y border-outline-variant/60 bg-surface-container-low/40">
      <div className="mx-auto max-w-6xl space-y-20 px-5 py-16 md:px-6 lg:space-y-28 lg:py-24">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          const flip = i % 2 === 1;
          return (
            <Reveal
              key={f.id}
              className={cn(
                "grid items-center gap-8 lg:grid-cols-2 lg:gap-14",
              )}
            >
              <RevealItem className={cn("min-w-0", flip && "lg:order-2")}>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-fixed px-3 py-1 text-[12px] font-semibold text-primary">
                  <Icon className="h-3.5 w-3.5" />
                  {f.kicker}
                </span>
                <h2 className="mt-4 max-w-md font-heading text-[2rem] font-extrabold leading-[1.02] tracking-tight sm:text-4xl">
                  {f.title}
                </h2>
                <p className="mt-4 max-w-md text-[16px] leading-relaxed text-on-surface-variant">{f.body}</p>
                <ul className="mt-5 space-y-2">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[15px] text-on-surface">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--lime)] text-[#0d0d0d]">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </RevealItem>
              <RevealItem className={cn("min-w-0", flip && "lg:order-1")}>
                <motion.div
                  whileHover={reduce ? undefined : hoverLift}
                  className="mx-auto max-w-md rounded-[2rem] border border-outline-variant bg-surface p-3 sm:p-4"
                >
                  {f.cutout}
                </motion.div>
              </RevealItem>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
