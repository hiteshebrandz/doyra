"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { BrandLogo } from "@/components/layout/BrandLogo";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard mode="auth">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-surface px-4 py-10">
        <div className="mb-8">
          <BrandLogo size="lg" href="/" />
        </div>
        <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 md:p-8 shadow-[var(--shadow-float)]">
          {children}
        </div>
        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Plan it. Do it. Repeat.
        </p>
      </div>
    </AuthGuard>
  );
}
