"use client";

import Link from "next/link";
import { Download, Globe, Smartphone } from "lucide-react";
import { buttonClassName } from "@/components/ui/Button";
import { Reveal, RevealItem } from "./Reveal";

export function Install() {
  return (
    <section id="install" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 md:px-6 lg:py-24">
      <Reveal>
        <RevealItem as="p" className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
          Install
        </RevealItem>
        <RevealItem
          as="h2"
          className="mt-3 max-w-xl font-heading text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-5xl"
        >
          On your phone, or in a tab.
        </RevealItem>
        <RevealItem as="p" className="mt-4 max-w-xl text-[16px] leading-relaxed text-on-surface-variant">
          Same account, same data in both. Use whichever is closer.
        </RevealItem>
      </Reveal>

      <Reveal className="mt-10 grid gap-4 md:grid-cols-2">
        <RevealItem className="flex flex-col rounded-3xl border border-outline-variant bg-surface-container-lowest p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--lime)] text-[#0d0d0d]">
            <Smartphone className="h-5 w-5" />
          </span>
          <h3 className="mt-5 font-heading text-2xl font-extrabold leading-tight text-on-surface">
            Android app
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-on-surface-variant">
            A direct APK, about 4.6 MB, for Android 7 and newer. This is the one
            that can send reminders. It is not on the Play Store yet, so Android
            will ask you to allow installs from your browser the first time.
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-on-surface-variant">File</dt>
            <dd className="font-semibold text-on-surface">Ritualoop.apk</dd>
            <dt className="text-on-surface-variant">Size</dt>
            <dd className="font-semibold text-on-surface">4.6 MB</dd>
            <dt className="text-on-surface-variant">Needs</dt>
            <dd className="font-semibold text-on-surface">Android 7.0+</dd>
          </dl>
          <a
            href="/doyrai.apk"
            download="Ritualoop.apk"
            className={buttonClassName("primary", "lg", "mt-6 w-full sm:w-auto sm:self-start")}
          >
            <Download className="h-4 w-4" />
            Download the APK
          </a>
        </RevealItem>

        <RevealItem className="flex flex-col rounded-3xl border border-outline-variant bg-surface-container-lowest p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-fixed text-primary">
            <Globe className="h-5 w-5" />
          </span>
          <h3 className="mt-5 font-heading text-2xl font-extrabold leading-tight text-on-surface">
            In the browser
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-on-surface-variant">
            Open it on a laptop and you get a sidebar, keyboard shortcuts
            (N for a new task, / to search) and the same cards. It also works
            offline once it has loaded, and syncs when you are back.
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-on-surface-variant">Sign in</dt>
            <dd className="font-semibold text-on-surface">Google or email</dd>
            <dt className="text-on-surface-variant">Data</dt>
            <dd className="font-semibold text-on-surface">Your own account</dd>
            <dt className="text-on-surface-variant">Backup</dt>
            <dd className="font-semibold text-on-surface">Export as JSON</dd>
          </dl>
          <Link href="/signup" className={buttonClassName("secondary", "lg", "mt-6 w-full sm:w-auto sm:self-start")}>
            Open in the browser
          </Link>
        </RevealItem>
      </Reveal>
    </section>
  );
}
