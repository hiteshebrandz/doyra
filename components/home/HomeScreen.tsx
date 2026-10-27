"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Dumbbell, Flame, ListChecks } from "lucide-react";
import { AuthSplash } from "@/components/auth/AuthGuard";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useAuth } from "@/hooks/useAuth";

const FEATURES = [
  {
    icon: ListChecks,
    title: "Tasks",
    body: "Kept until you delete them.",
  },
  {
    icon: Flame,
    title: "Habits",
    body: "Streaks you can see each day.",
  },
  {
    icon: Dumbbell,
    title: "Gym",
    body: "A trainer beside the rest of your day.",
  },
  {
    icon: Bell,
    title: "8:00 pm",
    body: "A reminder when work is still open.",
  },
] as const;

const PREVIEW_TASKS = [
  { title: "Read one book chapter", done: false },
  { title: "Run a sample Docker container", done: false },
  { title: "Review today's habits", done: true },
] as const;

function DayPreview({ className = "" }: { className?: string }) {
  return (
    <div className={`glass-panel w-full rounded-[1.7rem] p-4 text-left sm:p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
            Today
          </p>
          <p className="mt-1 truncate text-xl font-semibold tracking-tight">Good evening</p>
        </div>
        <span className="shrink-0 rounded-2xl bg-primary px-3.5 py-2 text-sm font-bold text-on-primary shadow-[0_8px_20px_rgba(77,80,230,0.35)]">
          75%
        </span>
      </div>

      <ul className="mt-4 space-y-2.5">
        {PREVIEW_TASKS.map((task) => (
          <li
            key={task.title}
            className="flex min-h-12 items-center gap-3 rounded-2xl bg-surface/70 px-3"
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                task.done
                  ? "border-tertiary bg-tertiary text-on-tertiary"
                  : "border-outline-variant"
              }`}
            >
              {task.done ? (
                <span className="text-[11px] font-bold leading-none">✓</span>
              ) : null}
            </span>
            <span
              className={`min-w-0 truncate text-sm ${
                task.done ? "text-on-surface-variant line-through" : "text-on-surface"
              }`}
            >
              {task.title}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="min-w-0 rounded-2xl bg-surface/70 px-3 py-3">
          <p className="text-xs text-on-surface-variant">Habits</p>
          <p className="mt-1 truncate text-lg font-semibold">3 of 4</p>
        </div>
        <div className="min-w-0 rounded-2xl bg-surface/70 px-3 py-3">
          <p className="text-xs text-on-surface-variant">Gym streak</p>
          <p className="mt-1 truncate text-lg font-semibold text-tertiary">12 days</p>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ className = "" }: { className?: string }) {
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      {FEATURES.map((feature) => {
        const Icon = feature.icon;
        return (
          <li key={feature.title} className="glass-panel flex min-w-0 items-center gap-3 rounded-2xl px-3 py-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{feature.title}</span>
              <span className="block text-[13px] leading-snug text-on-surface-variant">
                {feature.body}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function JewelLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`glow-button inline-flex h-12 items-center justify-center rounded-full px-6 text-base font-semibold focus-ring ${className}`}
    >
      {children}
    </Link>
  );
}

function PhoneHome() {
  return (
    <div className="flex min-h-[100dvh] flex-col md:hidden">
      <header className="px-5 pt-[max(1.15rem,var(--safe-top))]">
        <BrandLogo size="sm" href="/" />
      </header>

      <main className="flex flex-1 flex-col px-5 pb-2 pt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
          Your day, in one place
        </p>
        <h1 className="mt-3 max-w-[12ch] text-[2.75rem] font-bold leading-[0.96] tracking-tight">
          Plan it.
          <br />
          Do it.
          <br />
          Repeat.
        </h1>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-on-surface-variant">
          Tasks, habits, and gym. Open the app and unfinished work reminds you at 8:00 pm.
        </p>
        <DayPreview className="mt-6" />
      </main>

      <div className="px-5 pt-3 pb-[max(1.25rem,var(--safe-bottom))]">
        <JewelLink href="/signup" className="w-full">
          Get started
        </JewelLink>
        <Link
          href="/login"
          className="mt-1 flex h-12 w-full items-center justify-center rounded-full text-base font-semibold text-on-surface focus-ring"
        >
          I have an account
        </Link>
      </div>
    </div>
  );
}

function DesktopHome() {
  return (
    <div className="hidden min-h-[100dvh] md:block">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <BrandLogo size="md" href="/" />
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface focus-ring"
          >
            Sign in
          </Link>
          <JewelLink href="/signup" className="h-11 text-sm">
            Get started
          </JewelLink>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-14">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
            Your day, in one place
          </p>
          <h1 className="mt-4 text-6xl font-bold leading-[0.96] tracking-tight lg:text-7xl">
            Plan it.
            <br />
            Do it.
            <br />
            Repeat.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-on-surface-variant">
            Tasks, habits, and gym in one calm place. At 8:00 pm the app reminds you what is still open.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <JewelLink href="/signup">Start free</JewelLink>
            <Link
              href="/login"
              className="inline-flex h-12 items-center rounded-full border border-outline-variant/50 bg-surface-container-lowest/80 px-6 text-base font-semibold focus-ring"
            >
              I have an account
            </Link>
          </div>
        </div>
        <DayPreview />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <FeatureRow />
      </section>

      <footer className="border-t border-outline-variant/30 px-6 py-8 text-sm text-on-surface-variant">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
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
