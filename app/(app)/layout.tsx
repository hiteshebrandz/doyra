"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import {
  DesktopSidebar,
  MobileTabBar,
} from "@/components/layout/AppShell";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { ThemeSync } from "@/components/providers/ThemeSync";
import { useAppStore } from "@/store/app-store";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard mode="app">
      <ThemeSync />
      <AppFrame>{children}</AppFrame>
    </AuthGuard>
  );
}

function AppFrame({ children }: { children: ReactNode }) {
  const hydrated = useAppStore((s) => s.hydrated);
  const hydrating = useAppStore((s) => s.hydrating);
  const offline = useAppStore((s) => s.offline);

  return (
    <div className="min-h-[100dvh] bg-surface">
      <DesktopSidebar />
      <div className="md:pl-[72px] lg:pl-[260px]">
        {offline ? (
          <div
            className="bg-warning/15 px-4 py-2 text-center text-sm font-medium text-warning"
            role="status"
          >
            You&apos;re offline — changes will sync when you reconnect.
          </div>
        ) : null}
        <main className="mx-auto min-h-[100dvh] w-full max-w-6xl pt-16 pb-[calc(var(--tabbar-h)+var(--safe-bottom)+72px)] md:pt-6 md:pb-8 md:px-6">
          {!hydrated || hydrating ? <PageSkeleton /> : children}
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
