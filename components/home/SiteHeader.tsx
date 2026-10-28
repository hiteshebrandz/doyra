"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { buttonClassName } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#install", label: "Install" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-200",
        scrolled
          ? "border-outline-variant bg-surface/90 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
      style={{ paddingTop: "var(--safe-top, 0px)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-6">
        <BrandLogo size="sm" href="/" />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Page sections">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface focus-ring"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle compact />
          <Link
            href="/login"
            className={buttonClassName("ghost", "sm", "hidden sm:inline-flex")}
          >
            Sign in
          </Link>
          <Link href="/signup" className={buttonClassName("primary", "sm")}>
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
