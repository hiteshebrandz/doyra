"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Bell, Dumbbell, Flame, ListChecks } from "lucide-react";
import { hoverLift } from "./motion";
import { Reveal, RevealItem } from "./Reveal";

const STEPS = [
  {
    icon: ListChecks,
    title: "Write down the task",
    body: "Give it a title, pick daily, weekly or monthly, set a due date. Add a reminder time if you want a nudge. Tap the circle when it is done; swipe left to delete.",
  },
  {
    icon: Flame,
    title: "Check your habits once a day",
    body: "Start from Gym, Water, Reading or Meditation, or make your own. One tap per day. The week strip and the streak count fill in on their own.",
  },
  {
    icon: Dumbbell,
    title: "Follow the gym plan",
    body: "Tell the trainer your level and goal and get a 7-day plan with sets and reps. Each exercise has steps and form cues. Edit anything, then press Finish workout.",
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:px-6 lg:py-24">
      <Reveal>
        <RevealItem as="p" className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
          How it works
        </RevealItem>
        <RevealItem
          as="h2"
          className="mt-3 max-w-xl font-heading text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-5xl"
        >
          Three things, done the same way every day.
        </RevealItem>
        <RevealItem as="p" className="mt-4 max-w-xl text-[16px] leading-relaxed text-on-surface-variant">
          There is no setup wizard. You sign in, add the first task, and the
          rest of the app fills in as you use it.
        </RevealItem>
      </Reveal>

      <Reveal as="ul" className="mt-10 grid gap-4 md:grid-cols-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <RevealItem as="li" key={step.title} className="min-w-0">
              <motion.article
                whileHover={reduce ? undefined : hoverLift}
                className="card-surface-hover flex h-full flex-col rounded-3xl border border-outline-variant bg-surface-container-lowest p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-fixed text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-heading text-4xl font-extrabold leading-none text-outline-variant tabular">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-2xl font-extrabold leading-tight text-on-surface">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-on-surface-variant">{step.body}</p>
              </motion.article>
            </RevealItem>
          );
        })}
      </Reveal>

      <Reveal className="mt-4">
        <RevealItem className="flex flex-col gap-3 rounded-3xl border border-outline-variant bg-surface-container-low p-5 sm:flex-row sm:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--lime)] text-[#0d0d0d]">
            <Bell className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-on-surface">Reminders, 8:00 pm by default</p>
            <p className="text-[15px] leading-relaxed text-on-surface-variant">
              Turn on &quot;Remind me&quot; on a task or habit and pick a time. If it
              is still open at that time, the Android app sends one
              notification. Nothing goes out by email, and the browser version
              stays quiet.
            </p>
          </div>
        </RevealItem>
      </Reveal>
    </section>
  );
}
