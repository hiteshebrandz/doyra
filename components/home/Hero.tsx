"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buttonClassName } from "@/components/ui/Button";
import { PhoneMock } from "./PhoneMock";
import { Reveal, RevealItem } from "./Reveal";

const POINTS = [
  "Tasks for today, this week and this month",
  "Habits with a streak you can see",
  "A 7-day gym plan you can edit",
];

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-10 md:px-6 md:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-24 lg:pt-20">
      <Reveal className="min-w-0">
        <RevealItem as="p" className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
          Tasks, habits and gym
        </RevealItem>
        <RevealItem
          as="h1"
          className="mt-4 font-heading text-[2.75rem] font-extrabold leading-[0.94] tracking-tight sm:text-6xl lg:text-7xl"
        >
          Plan it.
          <br />
          Do it.
          <br />
          Repeat.
        </RevealItem>
        <RevealItem as="p" className="mt-5 max-w-md text-[17px] leading-relaxed text-on-surface-variant">
          One place for the things you do every day. Write the task, check the
          habit, follow the workout. Set a reminder and the Android app tells
          you when something is still open.
        </RevealItem>

        <RevealItem className="mt-6">
          <ul className="space-y-2">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2.5 text-[15px] text-on-surface">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--lime)] text-[#0d0d0d]">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </RevealItem>

        <RevealItem className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/signup" className={buttonClassName("primary", "lg", "sm:min-w-44")}>
            Create a free account
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/login" className={buttonClassName("secondary", "lg", "sm:min-w-44")}>
            I have an account
          </Link>
        </RevealItem>

        <RevealItem as="p" className="mt-4 text-[13px] text-on-surface-variant">
          Free. Works in the browser and as an Android app. Your data stays in
          your own account.
        </RevealItem>
      </Reveal>

      <Reveal className="min-w-0">
        <RevealItem>
          <PhoneMock />
        </RevealItem>
      </Reveal>
    </section>
  );
}
