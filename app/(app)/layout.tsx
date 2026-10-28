import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthenticatedApp } from "@/components/layout/AuthenticatedApp";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AuthenticatedApp>{children}</AuthenticatedApp>;
}
