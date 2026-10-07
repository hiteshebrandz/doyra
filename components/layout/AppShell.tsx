"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CheckSquare,
  Flame,
  Settings,
  LogOut,
  Plus,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo, BrandWordmark } from "@/components/layout/BrandLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

const NAV = [
  { href: "/dashboard", label: "Today", icon: CalendarDays },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/habits", label: "Habits", icon: Flame },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

const PAGE_SUBTITLE: Record<string, string> = {
  "/dashboard": "Dashboard Today",
  "/tasks": "Tasks List",
  "/habits": "Habits Tracker",
  "/settings": "Settings",
};

function subtitleFor(pathname: string): string {
  for (const [path, label] of Object.entries(PAGE_SUBTITLE)) {
    if (pathname.startsWith(path)) return label;
  }
  return "Doyrai";
}

export function DesktopSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-[100dvh] flex-col border-r border-outline-variant/30 bg-surface-container-lowest",
        "md:flex md:w-[72px] lg:w-[260px]",
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
                "relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition focus-ring",
                "justify-center lg:justify-start",
                active
                  ? "bg-primary-fixed/70 text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
              )}
              aria-current={active ? "page" : undefined}
              title={label}
            >
              <Icon className="relative h-5 w-5 shrink-0" />
              <span className="relative hidden lg:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-2 border-t border-outline-variant/30 p-3 lg:items-stretch">
        <ThemeToggle compact />
        <div className="hidden truncate px-2 text-xs text-on-surface-variant lg:block">
          {user?.displayName || user?.email}
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low focus-ring lg:justify-start"
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
      className="fixed inset-x-0 bottom-0 z-40 md:hidden pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(11,28,48,0.06)]"
      aria-label="Primary"
    >
      <div className="h-16 px-2 flex items-center justify-between">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all focus-ring rounded-xl",
                active
                  ? "text-primary font-semibold"
                  : "text-on-surface-variant hover:text-on-surface",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.25 : 1.75} />
              <span className="text-[0.6875rem] font-medium tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileFab({
  onClick,
  href = "/tasks",
}: {
  onClick?: () => void;
  href?: string;
}) {
  const className =
    "flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary text-on-primary shadow-[0_8px_24px_rgba(70,72,212,0.4)] active:scale-95 transition-transform focus-ring";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "fixed bottom-[calc(var(--tabbar-h)+var(--safe-bottom)+8px)] left-1/2 -translate-x-1/2 z-50 md:hidden",
          className,
        )}
        aria-label="Quick add"
      >
        <Plus className="h-7 w-7" />
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "fixed bottom-[calc(var(--tabbar-h)+var(--safe-bottom)+8px)] left-1/2 -translate-x-1/2 z-50 md:hidden",
        className,
      )}
      aria-label="Quick add"
    >
      <Plus className="h-7 w-7" />
    </Link>
  );
}

export function MobileHeader({ title }: { title: string }) {
  const pathname = usePathname();
  const subtitle = title || subtitleFor(pathname);

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] md:hidden">
      <div className="h-16 px-4 flex items-center justify-between gap-3">
        <BrandWordmark subtitle={subtitle} />
        <div className="flex items-center gap-1 flex-shrink-0">
          <ThemeToggle compact />
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(70,72,212,0.3)]">
            <User className="h-[18px] w-[18px] text-on-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
