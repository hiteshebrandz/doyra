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
    <Image
      src="/doyra-mark.svg"
      alt="Doyra"
      width={h}
      height={h}
      priority
    />
  );

  const full = (
    <Image
      src={dark ? "/doyra-logo-dark.svg" : "/doyra-logo.svg"}
      alt="Doyra"
      width={Math.round(h * 3.75)}
      height={h}
      priority
    />
  );

  return (
    <Link
      href={href}
      className="inline-flex items-center focus-ring rounded-xl"
      aria-label="Doyra home"
    >
      {markOnly ? mark : full}
    </Link>
  );
}
