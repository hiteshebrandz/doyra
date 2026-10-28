"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BatteryMedium,
  Check,
  CheckSquare,
  Dumbbell,
  Flame,
  Home,
  ListChecks,
  Signal,
  Wifi,
} from "lucide-react";
import { HabitIcon } from "@/components/habits/HabitIcon";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { greetingForNow } from "@/lib/dates";
import { cn } from "@/lib/utils";

/**
 * A phone showing the dashboard with fixture data. The classes are the same
 * ones the real dashboard uses so the mock stays honest about what you get.
 */

const HABITS = [
  { name: "Gym", icon: "dumbbell", streak: 12 },
  { name: "Water", icon: "droplets", streak: 30 },
  { name: "Reading", icon: "book-open", streak: 4 },
] as const;

const TASKS = [
  { title: "Call the dentist", priority: "High", type: "Daily" },
  { title: "Push the release notes", priority: "Medium", type: "Weekly" },
] as const;

/** Each step is what is checked at that moment in the loop. */
const STEPS: { habits: boolean[]; tasks: boolean[] }[] = [
  { habits: [true, false, false], tasks: [false, false] },
  { habits: [true, true, false], tasks: [false, false] },
  { habits: [true, true, false], tasks: [true, false] },
  { habits: [true, true, true], tasks: [true, false] },
  { habits: [true, true, true], tasks: [true, true] },
];

const STATIC_STEP = 2;

function CheckDot({ on, size = "h-9 w-9" }: { on: boolean; size?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
        size,
        on
          ? "border-transparent bg-[var(--lime)] text-[#0d0d0d]"
          : "border-outline-variant bg-transparent text-transparent",
      )}
      aria-hidden
    >
      <AnimatePresence initial={false}>
        {on ? (
          <motion.span
            key="check"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="flex"
          >
            <Check className="h-4 w-4" />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

export function PhoneMock({ className, tilt = true }: { className?: string; tilt?: boolean }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [reduce]);

  const state = STEPS[reduce ? STATIC_STEP : step];
  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const habitsDone = state.habits.filter(Boolean).length;
  const tasksDone = state.tasks.filter(Boolean).length;
  const pct = Math.round((habitsDone / HABITS.length) * 100);

  return (
    <div
      className={cn(
        "mx-auto w-[300px] sm:w-[320px]",
        tilt &&
          "md:[transform:perspective(1400px)_rotateY(-9deg)_rotateX(3deg)] md:transition-transform md:duration-500 md:ease-out md:hover:[transform:perspective(1400px)_rotateY(0deg)_rotateX(0deg)]",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[2.6rem] border border-outline-variant bg-[#1e1e1e] p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
        <div className="relative h-[600px] overflow-hidden rounded-[2.1rem] bg-surface sm:h-[640px]">
          {/* status bar */}
          <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-on-surface">
            <span className="tabular">9:41</span>
            <span className="h-5 w-20 rounded-full bg-[#0d0d0d]" aria-hidden />
            <span className="flex items-center gap-1 text-on-surface-variant">
              <Signal className="h-3 w-3" />
              <Wifi className="h-3 w-3" />
              <BatteryMedium className="h-3.5 w-3.5" />
            </span>
          </div>

          {/* app header */}
          <div className="flex items-center justify-between px-4 pb-2 pt-3">
            <div className="flex items-center gap-2">
              <Image src="/ritualoop-mark.png" alt="" width={22} height={22} />
              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-[0.14em] text-on-surface-variant">
                  Ritualoop
                </p>
                <p className="text-sm font-bold text-on-surface">Dashboard</p>
              </div>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--lime)] text-[11px] font-bold text-[#0d0d0d]">
              A
            </span>
          </div>

          <div className="space-y-3 px-3 pb-24">
            {/* greeting */}
            <section className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-on-surface-variant">
                  {dateLabel}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-2 py-0.5 text-[10px] font-semibold text-primary">
                  <Flame className="h-3 w-3" aria-hidden />
                  Today
                </span>
              </div>
              <p className="mt-2 font-heading text-[1.6rem] font-extrabold leading-none text-on-surface">
                {greetingForNow()}, Asha
              </p>
              <p className="mt-1.5 text-[11px] leading-snug text-on-surface-variant">
                {TASKS.length - tasksDone === 0
                  ? "Nothing open today."
                  : `${TASKS.length - tasksDone} task${TASKS.length - tasksDone === 1 ? "" : "s"} still open. Habits ${habitsDone} of ${HABITS.length} done.`}
              </p>
            </section>

            {/* stat cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="relative overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest p-3">
                <div className="absolute -right-4 -bottom-4 h-14 w-14 rounded-full bg-primary-fixed/40 blur-xl" />
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <span className="text-[10px] font-medium text-on-surface-variant">Today&apos;s Tasks</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-fixed text-primary">
                    <CheckSquare className="h-3 w-3" />
                  </span>
                </div>
                <div className="font-heading text-[2rem] font-extrabold leading-none text-on-surface tabular">
                  {TASKS.length}
                </div>
                <div className="mt-0.5 text-[10px] text-on-surface-variant">
                  {TASKS.length - tasksDone} remaining
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest p-3">
                <div className="absolute -right-4 -bottom-4 h-14 w-14 rounded-full bg-secondary-fixed/50 blur-xl" />
                <div className="mb-1.5 flex items-start justify-between gap-2">
                  <span className="text-[10px] font-medium text-on-surface-variant">Habits Done</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-fixed text-secondary">
                    <Flame className="h-3 w-3" />
                  </span>
                </div>
                <div className="font-heading text-[2rem] font-extrabold leading-none text-on-surface tabular">
                  {habitsDone}/{HABITS.length}
                </div>
                <div className="mt-0.5 text-[10px] text-on-surface-variant">
                  {pct >= 75 ? "Almost all done" : "Still to check"}
                </div>
              </div>
            </div>

            {/* habit focus */}
            <section className="glass-panel rounded-3xl p-3.5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-on-surface">Habit Focus</p>
                    <span className="rounded-full bg-primary-fixed px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                      Today
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-on-surface-variant">
                    Tap the circle when a habit is done
                  </p>
                </div>
                <ProgressRing value={pct} size={44} stroke={4} />
              </div>
              <ul className="space-y-2">
                {HABITS.map((h, i) => {
                  const on = state.habits[i];
                  return (
                    <li
                      key={h.name}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border border-outline-variant p-2.5 transition-colors duration-200",
                        on ? "bg-surface-container-low" : "bg-surface-container-lowest",
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant">
                          <HabitIcon icon={h.icon} className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <span
                            className={cn(
                              "block truncate text-[12px] font-medium text-on-surface transition-opacity",
                              on && "line-through opacity-70",
                            )}
                          >
                            {h.name}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-tertiary">
                            <Flame className="h-2.5 w-2.5" aria-hidden />
                            {h.streak + (on ? 1 : 0)}-day streak
                          </span>
                        </div>
                      </div>
                      <CheckDot on={on} />
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* tasks */}
            <section className="glass-panel rounded-3xl p-3.5">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-sm font-bold text-on-surface">Today&apos;s tasks</p>
                <span className="rounded-[10px] bg-[var(--lime)] px-2 py-1 text-[10px] font-bold text-[#0d0d0d]">
                  + Add
                </span>
              </div>
              <ul className="space-y-2">
                {TASKS.map((t, i) => {
                  const on = state.tasks[i];
                  return (
                    <li
                      key={t.title}
                      className={cn(
                        "flex items-start gap-2.5 rounded-2xl border border-outline-variant bg-surface-container-lowest p-2.5 transition-opacity",
                        on && "opacity-80",
                      )}
                    >
                      <CheckDot on={on} size="h-8 w-8" />
                      <div className="min-w-0">
                        <div className="mb-0.5 flex flex-wrap gap-1">
                          <span
                            className={cn(
                              "rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                              t.priority === "High"
                                ? "bg-error text-on-error"
                                : "bg-primary-fixed text-primary",
                            )}
                          >
                            {t.priority}
                          </span>
                          <span className="rounded-full bg-surface-container px-1.5 py-0.5 text-[9px] font-semibold text-on-surface-variant">
                            {t.type}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "block truncate text-[12px] font-semibold text-on-surface",
                            on && "line-through opacity-60",
                          )}
                        >
                          {t.title}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          {/* fade so the cut-off content reads as scrollable */}
          <div className="pointer-events-none absolute inset-x-0 bottom-14 h-16 bg-gradient-to-t from-surface to-transparent" />

          {/* bottom nav */}
          <div className="absolute inset-x-0 bottom-0 border-t border-outline-variant bg-surface/95 px-6 pb-4 pt-2.5 backdrop-blur">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="flex flex-col items-center gap-0.5 text-primary">
                <Home className="h-4.5 w-4.5" />
                <span className="text-[9px] font-semibold">Home</span>
              </span>
              <span className="flex flex-col items-center gap-0.5">
                <ListChecks className="h-4.5 w-4.5" />
                <span className="text-[9px] font-semibold">Tasks</span>
              </span>
              <span className="flex flex-col items-center gap-0.5">
                <Flame className="h-4.5 w-4.5" />
                <span className="text-[9px] font-semibold">Habits</span>
              </span>
              <span className="flex flex-col items-center gap-0.5">
                <Dumbbell className="h-4.5 w-4.5" />
                <span className="text-[9px] font-semibold">Gym</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
