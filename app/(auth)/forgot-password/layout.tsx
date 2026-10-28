import type { Metadata } from "next";
import type { ReactNode } from "react";
import { privateMetadata } from "@/lib/site";

export const metadata: Metadata = privateMetadata(
  "Reset password",
  "Email yourself a link to reset your Ritualoop password.",
  true,
);

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
