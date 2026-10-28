import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That address does not match a page in Ritualoop.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">404</p>
      <h1 className="mt-3 font-heading text-5xl font-extrabold tracking-tight text-on-surface">
        This page is not here.
      </h1>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-on-surface-variant">
        That address does not match a page in Ritualoop.
      </p>
      <Link
        href="/"
        className="glow-button mt-6 inline-flex h-12 items-center justify-center rounded-2xl px-5 text-[15px] font-bold focus-ring"
      >
        Back to the homepage
      </Link>
    </main>
  );
}
