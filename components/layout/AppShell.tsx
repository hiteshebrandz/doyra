"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/habits", label: "Habits", icon: Flame },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function DesktopSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-[100dvh] flex-col border-r border-[var(--glass-border)] glass",
        "md:flex md:w-[72px] lg:w-64",
        "pt-[var(--safe-top)] pb-[var(--safe-bottom)]",
      )}
    >
      <div className="flex h-16 items-center justify-center px-3 lg:justify-start lg:px-5">
        <span className="lg:hidden">
          <BrandLogo markOnly href="/dashboard" size="sm" />
        </span>
        <span className="hidden lg:inline-flex">
          <BrandLogo href="/dashboard" size="sm" />
        </span>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1 px-2 lg:px-3" aria-label="Main">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition focus-ring",
                "justify-center lg:justify-start",
                active
                  ? "text-primary"
                  : "text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text)]",
              )}
              aria-current={active ? "page" : undefined}
              title={label}
            >
              {active ? (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-2xl bg-primary/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              ) : null}
              <Icon className="relative h-5 w-5 shrink-0" />
              <span className="relative hidden lg:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-2 border-t border-[var(--glass-border)] p-3 lg:items-stretch">
        <ThemeToggle compact />
        <div className="hidden truncate px-2 text-xs text-[var(--muted)] lg:block">
          {user?.displayName || user?.email}
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-semibold text-[var(--muted)] hover:bg-black/5 dark:hover:bg-white/5 focus-ring lg:justify-start"
          aria-label="Sign out"
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden lg:inline">Sign out</span>
        </button>
      </div>
    </aside>
  );
}

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{ paddingBottom: "var(--safe-bottom)" }}
      aria-label="Primary"
    >
      <div className="mx-3 mb-2 glass rounded-3xl px-2 py-1.5">
        <ul className="relative grid grid-cols-4">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "relative flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2 text-[11px] font-semibold focus-ring",
                    active ? "text-primary" : "text-[var(--muted)]",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {active ? (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-1 rounded-2xl bg-primary/10"
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  ) : null}
                  <Icon className="relative h-5 w-5" />
                  <span className="relative">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export function MobileHeader({ title }: { title: string }) {
  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--glass-border)] glass px-4 md:hidden"
      style={{
        paddingTop: "calc(12px + var(--safe-top))",
        paddingBottom: 12,
      }}
    >
      <BrandLogo markOnly href="/dashboard" size="sm" />
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>
    </header>
  );
}
