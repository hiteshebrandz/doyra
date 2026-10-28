import type { Metadata } from "next";
import type { ReactNode } from "react";
import { privateMetadata } from "@/lib/site";

export const metadata: Metadata = privateMetadata(
  "Admin",
  "Sign in and send a notice to every Ritualoop phone.",
);

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
