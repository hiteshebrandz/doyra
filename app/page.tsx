import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { CheckCircle2, Flame, LayoutDashboard, Smartphone } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
        <BrandLogo size="md" />
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-[var(--muted)] hover:text-[var(--text)] focus-ring"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus-ring"
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
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Doyra
            </span>
          </h1>
          <p className="mt-3 text-xl font-medium text-[var(--text)] md:text-2xl">
            Plan it. Do it. Repeat.
          </p>
          <p className="mt-4 max-w-md text-[var(--muted)]">
            A calm glass workspace for daily tasks and lasting habits — built to
            feel native on your phone and polished on your desktop.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex min-h-12 items-center rounded-2xl bg-primary px-6 text-base font-semibold text-white shadow-md focus-ring"
            >
              Start free
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center rounded-2xl glass px-6 text-base font-semibold focus-ring"
            >
              I have an account
            </Link>
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-[var(--glass-border)] glass p-4 md:min-h-[420px]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
          <div className="relative space-y-3">
            <div className="glass rounded-2xl p-4">
              <p className="text-sm text-[var(--muted)]">Today</p>
              <p className="text-2xl font-bold tabular">4 tasks · 3 habits</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-2xl p-4">
                <p className="text-3xl">💪</p>
                <p className="mt-2 font-semibold">Gym</p>
                <p className="text-sm text-success">Streak 12</p>
              </div>
              <div className="glass rounded-2xl p-4">
                <p className="text-3xl">📚</p>
                <p className="mt-2 font-semibold">Reading</p>
                <p className="text-sm text-success">Streak 7</p>
              </div>
            </div>
            <div className="glass rounded-2xl p-4 opacity-90">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-white text-xs">
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
        <p className="mx-auto mt-2 max-w-xl text-center text-[var(--muted)]">
          Tasks, habits, streaks, and a dashboard that respects your attention —
          and your Firebase free tier.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <CheckSquareIcon />,
              title: "Smart tasks",
              body: "Daily, weekly, and monthly views with priorities and swipe gestures.",
            },
            {
              icon: <Flame className="h-6 w-6" />,
              title: "Habit streaks",
              body: "One-tap check-ins, weekly grids, and streaks that end today or yesterday.",
            },
            {
              icon: <LayoutDashboard className="h-6 w-6" />,
              title: "Clear dashboard",
              body: "Progress rings, weekly bars, and a monthly heatmap at a glance.",
            },
            {
              icon: <Smartphone className="h-6 w-6" />,
              title: "Installable PWA",
              body: "Standalone display, safe-area aware, and offline-friendly cache.",
            },
          ].map((f) => (
            <div key={f.title} className="glass rounded-3xl p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {f.icon}
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Designed for every screen
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-[var(--muted)]">
          Floating glass tab bar on phones. Sidebar dashboard on desktop.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["Mobile-first tabs", "Tablet icon rail", "Desktop sidebar"].map(
            (label, i) => (
              <div
                key={label}
                className="glass flex aspect-[4/3] flex-col items-center justify-center rounded-3xl p-6 text-center"
              >
                <Image
                  src="/doyra-mark.svg"
                  alt=""
                  width={48}
                  height={48}
                  className="mb-3 opacity-80"
                />
                <p className="font-semibold">{label}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Preview {i + 1}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="glass rounded-[2rem] px-6 py-12 text-center md:px-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready when you are
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[var(--muted)]">
            Create a free account and start your first streak today.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-flex min-h-12 items-center rounded-2xl bg-primary px-8 text-base font-semibold text-white focus-ring"
          >
            Create account
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--glass-border)] px-4 py-8 text-center text-sm text-[var(--muted)] md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 md:flex-row">
          <BrandLogo size="sm" />
          <p>© {new Date().getFullYear()} Doyra. Plan it. Do it. Repeat.</p>
        </div>
      </footer>
    </div>
  );
}

function CheckSquareIcon() {
  return <CheckCircle2 className="h-6 w-6" />;
}
