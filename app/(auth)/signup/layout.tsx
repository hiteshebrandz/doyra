import type { Metadata } from "next";
import type { ReactNode } from "react";
import { privateMetadata } from "@/lib/site";

export const metadata: Metadata = privateMetadata(
  "Create account",
  "Create a free Ritualoop account for tasks, habits, and a gym plan.",
  true,
);

export default function SignupLayout({ children }: { children: ReactNode }) {
  return children;
}
