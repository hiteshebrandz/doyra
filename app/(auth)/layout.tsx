import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { BrandLogo } from "@/components/layout/BrandLogo";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard mode="auth">
      <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-[max(2.5rem,var(--safe-top))] pb-[max(2.5rem,var(--safe-bottom))]">
        <div className="mb-8">
          <BrandLogo size="lg" href="/" />
        </div>
        <div className="glass-panel w-full max-w-md rounded-3xl p-6 md:p-8">
          {children}
        </div>
        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Plan it. Do it. Repeat.
        </p>
      </div>
    </AuthGuard>
  );
}
