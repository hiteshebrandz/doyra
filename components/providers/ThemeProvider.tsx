"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * next-themes injects an inline <script> to prevent theme flash.
 * React 19 / Next 16 warn when a client component renders a <script>.
 * On the client, mark it as non-JS so React stops complaining; SSR still
 * serves a normal executable script for FOUC prevention.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const scriptProps =
    typeof window === "undefined"
      ? undefined
      : ({ type: "application/json" } as const);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
      scriptProps={scriptProps}
    >
      {children}
    </NextThemesProvider>
  );
}
