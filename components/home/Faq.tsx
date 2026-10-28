"use client";

import { ChevronDown } from "lucide-react";
import { HOME_FAQ } from "@/lib/home-faq";
import { Reveal, RevealItem } from "./Reveal";

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-20 px-5 pb-20 pt-4 md:px-6 lg:pb-28">
      <Reveal className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <RevealItem className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">FAQ</p>
          <h2 className="mt-3 font-heading text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-5xl">
            Short answers.
          </h2>
          <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-on-surface-variant">
            If something is missing here, the Settings page inside the app has
            the export, delete and theme options.
          </p>
        </RevealItem>

        <RevealItem as="div" className="min-w-0 divide-y divide-outline-variant rounded-3xl border border-outline-variant bg-surface-container-lowest">
          {HOME_FAQ.map((item) => (
            <details key={item.q} className="group px-5 py-4 open:bg-surface-container-low/40 first:rounded-t-3xl last:rounded-b-3xl">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-on-surface focus-ring rounded-xl [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown className="h-5 w-5 shrink-0 text-on-surface-variant transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-on-surface-variant">{item.a}</p>
            </details>
          ))}
        </RevealItem>
      </Reveal>
    </section>
  );
}
