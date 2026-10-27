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

function Ornament({ label }: { label: string }) {
  return (
    <div className="royal-gold flex items-center gap-3">
      <span className="h-px w-8 bg-current opacity-70" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">{label}</span>
      <span className="h-px w-8 bg-current opacity-70" />
    </div>
  );
}

function FeaturePanel({ className = "" }: { className?: string }) {
  return (
    <ul className={`royal-frame divide-y divide-[#c6a15b]/25 overflow-hidden rounded-[1.6rem] ${className}`}>
      {FEATURES.map((feature) => {
        const Icon = feature.icon;
        return (
          <li key={feature.title} className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-sm font-semibold tracking-tight">{feature.title}</span>
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
      className={`royal-button inline-flex h-12 items-center justify-center rounded-2xl px-6 text-base font-semibold focus-ring ${className}`}
    >
      {children}
    </Link>
  );
}

function PhoneHome() {
  return (
    <div className="royal-canvas flex min-h-[100dvh] flex-col md:hidden">
      <header className="flex justify-center px-6 pt-[max(1.15rem,var(--safe-top))]">
        <BrandLogo size="sm" href="/" />
      </header>

      <main className="flex flex-1 flex-col items-center px-6 pb-2 pt-8 text-center">
        <Ornament label="Your day" />
        <h1 className="mt-4 text-[2.65rem] font-bold leading-[0.98] tracking-tight">
          Plan it.
          <br />
          Do it.
          <br />
          Repeat.
        </h1>
        <div className="royal-rule mt-5" />
        <p className="mt-4 max-w-[17.5rem] text-[15px] leading-relaxed text-on-surface-variant">
          Tasks, habits, and gym, kept in one quiet place. At 8:00 pm the app reminds you what is still open.
        </p>
        <FeaturePanel className="mt-6 w-full" />
      </main>

      <div className="px-6 pt-4 pb-[max(1.35rem,var(--safe-bottom))]">
        <JewelLink href="/signup" className="w-full">
          Get started
        </JewelLink>
        <Link
          href="/login"
          className="mt-1 flex h-12 w-full items-center justify-center rounded-2xl text-base font-semibold text-on-surface focus-ring"
        >
          I have an account
        </Link>
      </div>
    </div>
  );
}

function DesktopHome() {
  return (
    <div className="royal-canvas hidden min-h-[100dvh] md:block">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <BrandLogo size="md" href="/" />
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface focus-ring"
          >
            Sign in
          </Link>
          <JewelLink href="/signup" className="h-11 rounded-xl text-sm">
            Get started
          </JewelLink>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-10 lg:grid-cols-[1.05fr_0.9fr] lg:pt-16">
        <div>
          <Ornament label="Your day" />
          <h1 className="mt-5 text-6xl font-bold leading-[0.98] tracking-tight lg:text-7xl">
            Plan it.
            <br />
            Do it.
            <br />
            Repeat.
          </h1>
          <div className="royal-rule mt-6" />
          <p className="mt-5 max-w-md text-lg leading-relaxed text-on-surface-variant">
            A quiet place for tasks, habits, and gym. On your phone it feels like an app, and at 8:00 pm it reminds you what is still open.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <JewelLink href="/signup">Start free</JewelLink>
            <Link
              href="/login"
              className="inline-flex h-12 items-center rounded-2xl border border-[#c6a15b]/40 bg-surface-container-lowest px-6 text-base font-semibold focus-ring"
            >
              I have an account
            </Link>
          </div>
        </div>
        <FeaturePanel />
      </section>

      <footer className="border-t border-[#c6a15b]/25 px-6 py-8 text-sm text-on-surface-variant">
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
