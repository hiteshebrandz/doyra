import type { Metadata } from "next";
import type { ReactNode } from "react";
import { privateMetadata } from "@/lib/site";

export const metadata: Metadata = privateMetadata(
  "Dashboard",
  "Today's tasks, habits, and progress in your Ritualoop account.",
);

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children;
}
