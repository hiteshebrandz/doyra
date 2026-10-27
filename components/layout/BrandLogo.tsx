"use client";

import Image from "next/image";
import Link from "next/link";

const heights = { sm: 28, md: 36, lg: 44 } as const;

function LogoWord({ size }: { size: number }) {
  return (
    <span
      className="font-heading font-extrabold leading-none tracking-tight"
      style={{ fontSize: Math.round(size * 0.62) }}
    >
      <span className="text-on-surface">Ritual</span>
      <span className="text-[var(--logo-loop)]">loop</span>
    </span>
  );
}

export function BrandLogo({
  size = "md",
  href = "/",
  markOnly = false,
}: {
  size?: "sm" | "md" | "lg";
  href?: string;
  markOnly?: boolean;
}) {
  const h = heights[size];

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 focus-ring rounded-xl"
      aria-label="Ritualoop home"
    >
      <Image
        src="/ritualoop-mark.png"
        alt=""
        width={h}
        height={h}
        className="flex-shrink-0"
        priority
      />
      {markOnly ? null : <LogoWord size={h} />}
    </Link>
  );
}

/** Wordmark-style brand used in mobile headers. */
export function BrandWordmark({
  subtitle,
}: {
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <Image
        src="/ritualoop-mark.png"
        alt=""
        width={32}
        height={32}
        className="flex-shrink-0"
        priority
      />
      <div className="flex flex-col min-w-0">
        <LogoWord size={30} />
        {subtitle ? (
          <span className="text-[0.6875rem] font-medium text-on-surface-variant truncate leading-tight tracking-wide">
            {subtitle}
          </span>
        ) : null}
      </div>
    </div>
  );
}
