"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { BrandLogo } from "@/components/layout/BrandLogo";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard mode="auth">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-10">
        <div className="mb-8">
          <BrandLogo size="lg" href="/" />
        </div>
        <div className="glass w-full max-w-md rounded-3xl p-6 md:p-8">
          {children}
        </div>
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Plan it. Do it. Repeat.
        </p>
      </div>
    </AuthGuard>
  );
}
