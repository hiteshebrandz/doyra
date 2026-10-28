import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";

const LINKS = [
  { href: "/login", label: "Sign in" },
  { href: "/admin", label: "Admin" },
  { href: "/signup", label: "Create account" },
  { href: "/doyrai.apk", label: "Download APK", download: "Ritualoop.apk" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-outline-variant/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <BrandLogo size="sm" href="/" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-on-surface-variant">
            Tasks, habits and gym in one app. Plan it. Do it. Repeat.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {LINKS.map((l) =>
            l.download ? (
              <a key={l.href} href={l.href} download={l.download} className="text-on-surface-variant hover:text-on-surface focus-ring rounded">
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href} className="text-on-surface-variant hover:text-on-surface focus-ring rounded">
                {l.label}
              </Link>
            ),
          )}
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-[max(1.5rem,var(--safe-bottom))] md:px-6">
        <p className="text-xs text-on-surface-variant">
          © {new Date().getFullYear()} Ritualoop. Made for people who like to see the week they just had.
        </p>
      </div>
    </footer>
  );
}
