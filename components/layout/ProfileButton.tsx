"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";
import { ResponsiveDialog } from "@/components/ui/Sheet";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/app-store";

function providerLabel(id: string): string {
  if (id === "google.com") return "Google";
  if (id === "password") return "Email and password";
  if (id === "phone") return "Phone";
  return id;
}

function formatWhen(value: string | undefined | null): string {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ProfileButton() {
  const { user, signOut } = useAuth();
  const settings = useAppStore((s) => s.settings);
  const [open, setOpen] = useState(false);

  const name =
    settings.displayName || user?.displayName || user?.email?.split("@")[0] || "Your profile";
  const providers = user?.providerData.map((item) => providerLabel(item.providerId)) ?? [];
  const memberSince = user?.metadata.creationTime || settings.createdAt;

  const rows = [
    { label: "Name", value: name },
    { label: "Email", value: user?.email || "Not available" },
    { label: "Signed in with", value: providers.length ? providers.join(", ") : "Not available" },
    { label: "Email verified", value: user?.emailVerified ? "Yes" : "No" },
    { label: "Member since", value: formatWhen(memberSince) },
    { label: "Week starts", value: settings.weekStart === 0 ? "Sunday" : "Monday" },
    {
      label: "Theme",
      value: settings.theme === "system" ? "System" : settings.theme === "dark" ? "Dark" : "Light",
    },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary focus-ring"
        aria-label="Open profile"
      >
        {user?.photoURL ? (
          // Google profile photos are on a host Next Image is not configured for.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
        ) : (
          <User className="h-[18px] w-[18px] text-on-primary" />
        )}
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <ResponsiveDialog open onClose={() => setOpen(false)} title="Profile">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary">
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
            ) : (
              <User className="h-7 w-7 text-on-primary" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-heading text-2xl font-extrabold leading-none text-on-surface">
              {name}
            </p>
            <p className="mt-1 truncate text-sm text-on-surface-variant">{user?.email}</p>
          </div>
        </div>

        <dl className="mt-4 divide-y divide-outline-variant/40 rounded-2xl border border-outline-variant/40">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4 px-3 py-3">
              <dt className="text-sm text-on-surface-variant">{row.label}</dt>
              <dd className="min-w-0 break-words text-right text-sm font-semibold text-on-surface">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex flex-col gap-2">
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-outline-variant text-[15px] font-bold text-on-surface focus-ring"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl text-[15px] font-bold text-on-surface-variant focus-ring"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
            </ResponsiveDialog>,
            document.body,
          )
        : null}
    </>
  );
}
