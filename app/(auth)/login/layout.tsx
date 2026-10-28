import type { Metadata } from "next";
import type { ReactNode } from "react";
import { privateMetadata } from "@/lib/site";

export const metadata: Metadata = privateMetadata(
  "Sign in",
  "Sign in to Ritualoop with Google or email.",
  true,
);

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
