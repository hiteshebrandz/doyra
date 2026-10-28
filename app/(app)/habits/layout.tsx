import type { Metadata } from "next";
import type { ReactNode } from "react";
import { privateMetadata } from "@/lib/site";

export const metadata: Metadata = privateMetadata(
  "Habits",
  "Daily habit check-ins and streaks in your Ritualoop account.",
);

export default function HabitsLayout({ children }: { children: ReactNode }) {
  return children;
}
