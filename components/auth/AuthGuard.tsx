"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const AUTH_ROUTES = new Set(["/login", "/signup", "/forgot-password"]);

export function AuthGuard({
  children,
  mode,
}: {
  children: ReactNode;
  mode: "app" | "auth";
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (mode === "app" && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
    if (mode === "auth" && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, mode, router, pathname]);

  if (loading || (mode === "app" && !user) || (mode === "auth" && user)) {
    return <AuthSplash />;
  }

  return <>{children}</>;
}

export function AuthSplash() {
  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-surface"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <Image
        src="/doyra-mark.svg"
        alt="Doyrai"
        width={56}
        height={56}
        priority
        className="animate-pulse"
      />
      <p className="text-sm text-on-surface-variant">Loading Doyrai…</p>
    </div>
  );
}

export function isAuthRoute(path: string): boolean {
  return AUTH_ROUTES.has(path);
}
