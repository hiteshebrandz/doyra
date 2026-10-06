"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Desktop keyboard shortcuts: N new task, / search focus, G then T/H/D navigate. */
export function KeyboardShortcuts({
  onNewTask,
  onSearch,
}: {
  onNewTask?: () => void;
  onSearch?: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    let gPending = false;
    let gTimer: ReturnType<typeof setTimeout> | null = null;

    const isTyping = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    };

    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (gPending) {
        gPending = false;
        if (gTimer) clearTimeout(gTimer);
        const k = e.key.toLowerCase();
        if (k === "t") {
          e.preventDefault();
          router.push("/tasks");
        } else if (k === "h") {
          e.preventDefault();
          router.push("/habits");
        } else if (k === "d") {
          e.preventDefault();
          router.push("/dashboard");
        } else if (k === "s") {
          e.preventDefault();
          router.push("/settings");
        }
        return;
      }

      if (e.key.toLowerCase() === "g") {
        gPending = true;
        gTimer = setTimeout(() => {
          gPending = false;
        }, 800);
        return;
      }

      if (e.key.toLowerCase() === "n" && onNewTask) {
        e.preventDefault();
        onNewTask();
      }
      if (e.key === "/" && onSearch) {
        e.preventDefault();
        onSearch();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (gTimer) clearTimeout(gTimer);
    };
  }, [router, onNewTask, onSearch]);

  return null;
}
