import type { Metadata } from "next";
import type { ReactNode } from "react";
import { privateMetadata } from "@/lib/site";

export const metadata: Metadata = privateMetadata(
  "Gym",
  "Your 7-day gym plan in Ritualoop.",
);

export default function GymLayout({ children }: { children: ReactNode }) {
  return children;
}
