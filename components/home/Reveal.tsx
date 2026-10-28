"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, stagger, viewport } from "./motion";

/**
 * Wraps a section so it fades up when scrolled into view. Children marked
 * with <RevealItem> stagger in after it. Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "ul" | "li";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Tag
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "p" | "h1" | "h2" | "h3";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Tag className={className} variants={fadeUp}>
      {children}
    </Tag>
  );
}
