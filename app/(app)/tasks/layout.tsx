import type { Metadata } from "next";
import type { ReactNode } from "react";
import { privateMetadata } from "@/lib/site";

export const metadata: Metadata = privateMetadata(
  "Tasks",
  "Your Ritualoop task list, with due dates and reminders.",
);

export default function TasksLayout({ children }: { children: ReactNode }) {
  return children;
}
