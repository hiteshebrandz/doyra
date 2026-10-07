import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { CheckCircle2, Flame, LayoutDashboard, Smartphone } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-surface text-on-surface">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
        <BrandLogo size="md" />
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

      <section className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 md:grid-cols-2 md:items-center md:px-6 md:pt-16">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
            Personal task & habit manager
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-on-surface">
            Doyrai
          </h1>
          <p className="mt-3 text-xl font-medium text-on-surface md:text-2xl">
            Plan it. Do it. Repeat.
          </p>
          <p className="mt-4 max-w-md text-on-surface-variant">
            A calm productivity workspace for daily tasks and lasting habits —
            native on your phone, polished on desktop.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex min-h-12 items-center rounded-xl bg-primary px-6 text-base font-semibold text-on-primary shadow-[0_8px_24px_rgba(70,72,212,0.35)] focus-ring"
            >
              Start free
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center rounded-xl bg-surface-container-lowest px-6 text-base font-semibold shadow-sm focus-ring"
            >
              I have an account
            </Link>
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] bg-surface-container-lowest p-4 shadow-[var(--shadow-float)] md:min-h-[420px]">
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-primary-fixed/60 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-secondary-fixed/50 blur-2xl pointer-events-none" />
          <div className="relative space-y-3">
            <div className="rounded-2xl bg-surface-container-low p-4">
              <p className="text-sm text-on-surface-variant">Today</p>
              <p className="text-2xl font-bold tabular">4 tasks · 3 habits</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
                <p className="text-3xl">💪</p>
                <p className="mt-2 font-semibold">Gym</p>
                <p className="text-sm text-tertiary font-semibold">Streak 12</p>
              </div>
              <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
                <p className="text-3xl">📚</p>
                <p className="mt-2 font-semibold">Reading</p>
                <p className="text-sm text-secondary font-semibold">Streak 7</p>
              </div>
            </div>
            <div className="rounded-2xl bg-surface-container-low p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tertiary text-on-tertiary text-xs">
                  ✓
                </span>
                <span className="line-through opacity-60">Ship landing page</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Everything you need to stay consistent
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-on-surface-variant">
          Tasks, habits, streaks, and a dashboard that respects your attention.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <CheckCircle2 className="h-6 w-6" />,
              title: "Smart tasks",
              body: "Daily, weekly, and monthly views with priorities and swipe gestures.",
            },
            {
              icon: <Flame className="h-6 w-6" />,
              title: "Habit streaks",
              body: "One-tap check-ins, weekly grids, and streaks that stick.",
            },
            {
              icon: <LayoutDashboard className="h-6 w-6" />,
              title: "Clear dashboard",
              body: "Progress rings, weekly bars, and a monthly heatmap at a glance.",
            },
            {
              icon: <Smartphone className="h-6 w-6" />,
              title: "Installable PWA",
              body: "Standalone display, safe-area aware, and offline-friendly.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-surface-container-lowest p-5 shadow-[var(--shadow-card)]"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                {f.icon}
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-on-surface-variant">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="rounded-[1.5rem] bg-surface-container-lowest px-6 py-12 text-center shadow-[var(--shadow-card)] md:px-12">
          <h2 className="text-3xl font-bold tracking-tight">Ready when you are</h2>
          <p className="mx-auto mt-2 max-w-md text-on-surface-variant">
            Create a free account and start your first streak today.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-primary px-8 text-base font-semibold text-on-primary focus-ring"
          >
            Create account
          </Link>
        </div>
      </section>

      <footer className="border-t border-outline-variant/30 px-4 py-8 text-center text-sm text-on-surface-variant md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 md:flex-row">
          <BrandLogo size="sm" />
          <p>© {new Date().getFullYear()} Doyrai. Plan it. Do it. Repeat.</p>
        </div>
      </footer>
    </div>
  );
}
