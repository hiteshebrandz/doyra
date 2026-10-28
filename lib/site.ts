import type { Metadata } from "next";

/** Production origin. Override with NEXT_PUBLIC_SITE_URL when the domain changes. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://doyrai.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Ritualoop";

export const SITE_TITLE = "Ritualoop — Plan it. Do it. Repeat.";

export const SITE_DESCRIPTION =
  "Tasks, habits, and a 7-day gym plan in one free app. Use it in the browser or on Android, and get a reminder when something is still open.";

/** Preview deployments should not compete with the production site in search. */
export const isPreviewDeployment = process.env.VERCEL_ENV === "preview";

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function privateMetadata(
  title: string,
  description: string,
  follow = false,
): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow },
  };
}
