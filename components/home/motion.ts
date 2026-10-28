import type { Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** One block easing up into place. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

/** Parent that staggers its fadeUp children. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/** Shared whileInView settings so every section reveals the same way. */
export const viewport = { once: true, margin: "-80px 0px" } as const;

/** Small lift on hover for cards. */
export const hoverLift = { y: -3, transition: { duration: 0.2, ease } };
