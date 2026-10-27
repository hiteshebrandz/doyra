"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Check, Dumbbell, Flame, ListChecks } from "lucide-react";
import { AuthSplash } from "@/components/auth/AuthGuard";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useAuth } from "@/hooks/useAuth";

const FEATURES = [
  {
    icon: ListChecks,
    title: "Tasks",
    body: "Daily, weekly, and monthly work that stays until you delete it.",
  },
  {
    icon: Flame,
    title: "Habits",
    body: "One-tap check-ins, streaks, and a week you can see at a glance.",
  },
  {
    icon: Dumbbell,
    title: "Gym",
    body: "A simple trainer beside the rest of your day.",
  },
  {
    icon: Bell,
    title: "8:00 pm reminder",
    body: "The phone app warns you when unfinished work is still open.",
  },
] as const;

function PreviewCard() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-surface-container-lowest p-4 shadow-[var(--shadow-float)] md:p-5">
      <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-primary-fixed/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-secondary-fixed/60 blur-2xl" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Today
            </p>
            <p className="mt-1 text-lg font-bold tracking-tight">Good evening</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-fixed text-sm font-bold text-primary">
            75%
          </div>
        </div>
        <ul className="space-y-2">
          {[
            { title: "Read one book chapter", done: false },
            { title: "Run a sample Docker container", done: false },
            { title: "Review today's habits", done: true },
          ].map((task) => (
            <li
              key={task.title}
              className="flex items-center gap-3 rounded-2xl bg-surface-container-low px-3 py-3"
            >
              <span
                className={
                  task.done
                    ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-tertiary text-on-tertiary"
                    : "h-6 w-6 shrink-0 rounded-full border-2 border-outline-variant"
                }
              >
                {task.done ? <Check className="h-3.5 w-3.5" /> : null}
              </span>
              <span
                className={
                  task.done
                    ? "text-sm text-on-surface-variant line-through"
                    : "text-sm font-medium"
                }
              >
                {task.title}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-surface-container-low px-3 py-3">
            <p className="text-xs text-on-surface-variant">Habits</p>
            <p className="mt-0.5 font-bold">3 of 4</p>
          </div>
          <div className="rounded-2xl bg-surface-container-low px-3 py-3">
            <p className="text-xs text-on-surface-variant">Gym streak</p>
            <p className="mt-0.5 font-bold text-tertiary">12 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneHome() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-surface md:hidden">
      <header className="flex items-center justify-between px-5 pt-[max(1rem,var(--safe-top))]">
        <BrandLogo size="sm" href="/" />
      </header>

      <main className="flex flex-1 flex-col px-5 pb-4 pt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Your day, in one place
        </p>
        <h1 className="mt-2 text-[2.35rem] font-bold leading-[1.05] tracking-tight">
          Plan it.
          <br />
          Do it.
          <br />
          Repeat.
        </h1>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-on-surface-variant">
          Tasks, habits, and gym. Open the app and unfinished work reminds you at 8:00 pm.
        </p>
        <div className="mt-6">
          <PreviewCard />
        </div>
      </main>

      <div className="sticky bottom-0 bg-surface/95 px-5 pt-2 pb-[max(1rem,var(--safe-bottom))] backdrop-blur-xl">
        <Link
          href="/signup"
          className="flex h-12 w-full items-center justify-center rounded-2xl bg-primary text-base font-semibold text-on-primary shadow-[0_8px_24px_rgba(70,72,212,0.35)] focus-ring"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="mt-2 flex h-12 w-full items-center justify-center rounded-2xl text-base font-semibold text-primary focus-ring"
        >
          I have an account
        </Link>
      </div>
    </div>
  );
}

function DesktopHome() {
  return (
    <div className="hidden min-h-[100dvh] bg-surface md:block">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <BrandLogo size="md" href="/" />
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface focus-ring"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-sm focus-ring"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-8 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Personal task and habit manager
          </p>
          <h1 className="mt-3 text-5xl font-bold leading-[1.05] tracking-tight lg:text-6xl">
            Plan it.
            <br />
            Do it. Repeat.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-on-surface-variant">
            A calm place for tasks, habits, and gym. On your phone it feels like an app, and at 8:00 pm it reminds you what is still open.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center rounded-xl bg-primary px-6 text-base font-semibold text-on-primary shadow-[0_8px_24px_rgba(70,72,212,0.35)] focus-ring"
            >
              Start free
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center rounded-xl bg-surface-container-lowest px-6 text-base font-semibold shadow-sm focus-ring"
            >
              I have an account
            </Link>
          </div>
        </div>
        <PreviewCard />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl font-bold tracking-tight">Built for a daily rhythm</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
            <div
              key={feature.title}
              className="rounded-2xl bg-surface-container-lowest p-5 shadow-[var(--shadow-card)]"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                {feature.body}
              </p>
            </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-outline-variant/30 px-6 py-8 text-sm text-on-surface-variant">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <BrandLogo size="sm" href="/" />
          <p>© {new Date().getFullYear()} Doyrai. Plan it. Do it. Repeat.</p>
        </div>
      </footer>
    </div>
  );
}

export function HomeScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  if (loading || user) return <AuthSplash />;

  return (
    <>
      <PhoneHome />
      <DesktopHome />
    </>
  );
}
