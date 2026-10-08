"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" disabled>
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      aria-label={`Theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
      className="text-on-surface-variant"
    >
      <Icon className="h-5 w-5" />
      {!compact ? (
        <span className="capitalize hidden lg:inline text-sm">{theme}</span>
      ) : null}
    </Button>
  );
}
