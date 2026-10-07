"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function BrandLogo({
  size = "md",
  href = "/",
  markOnly = false,
}: {
  size?: "sm" | "md" | "lg";
  href?: string;
  markOnly?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const heights = { sm: 28, md: 36, lg: 44 };
  const h = heights[size];
  const dark = mounted && resolvedTheme === "dark";

  const mark = (
    <Image src="/doyra-mark.svg" alt="Doyrai" width={h} height={h} priority />
  );

  const full = (
    <Image
      src={dark ? "/doyra-logo-dark.svg" : "/doyra-logo.svg"}
      alt="Doyrai"
      width={Math.round(h * 4.15)}
      height={h}
      priority
    />
  );

  return (
    <Link
      href={href}
      className="inline-flex items-center focus-ring rounded-xl"
      aria-label="Doyrai home"
    >
      {markOnly ? mark : full}
    </Link>
  );
}

/** Wordmark-style brand used in DayFlow mobile headers. */
export function BrandWordmark({
  subtitle,
}: {
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <Image
        src="/doyra-mark.svg"
        alt=""
        width={32}
        height={32}
        className="flex-shrink-0"
        priority
      />
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-bold tracking-tight text-on-surface leading-none text-[1.125rem]">
            Doyrai
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
        </div>
        {subtitle ? (
          <span className="text-[0.6875rem] font-medium text-on-surface-variant truncate leading-tight tracking-wide">
            {subtitle}
          </span>
        ) : null}
      </div>
    </div>
  );
}
