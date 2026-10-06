"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useAppStore } from "@/store/app-store";
import type { ThemePreference } from "@/lib/types";

/** Apply Firestore theme once after hydrate; persist user theme changes afterward. */
export function ThemeSync() {
  const { theme, setTheme } = useTheme();
  const settingsTheme = useAppStore((s) => s.settings.theme);
  const hydrated = useAppStore((s) => s.hydrated);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const applied = useRef(false);
  const skipNextPersist = useRef(false);

  useEffect(() => {
    if (!hydrated || applied.current) return;
    applied.current = true;
    if (settingsTheme) {
      skipNextPersist.current = true;
      setTheme(settingsTheme);
    }
  }, [hydrated, settingsTheme, setTheme]);

  useEffect(() => {
    if (!hydrated || !theme) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    if (theme === "light" || theme === "dark" || theme === "system") {
      if (settingsTheme !== theme) {
        updateSettings({ theme: theme as ThemePreference });
      }
    }
  }, [theme, hydrated, settingsTheme, updateSettings]);

  return null;
}
