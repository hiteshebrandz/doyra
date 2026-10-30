"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Bell, LogOut, MapPin, Users } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { isAdminEmail, sendBroadcast, watchBroadcasts, type Broadcast } from "@/lib/broadcasts";
import type { StoredUserLocation } from "@/lib/user-locations";
import { cn } from "@/lib/utils";

type Menu = "notices" | "users";

function firestoreMessage(error: unknown, fallback: string): string {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code: string }).code)
      : "";
  if (code === "permission-denied") return fallback;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function when(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const { user, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("Admin@gmail.com");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [menu, setMenu] = useState<Menu>("notices");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sent, setSent] = useState("");
  const [recent, setRecent] = useState<Broadcast[]>([]);
  const [people, setPeople] = useState<StoredUserLocation[]>([]);
  const [peopleError, setPeopleError] = useState("");

  const isAdmin = isAdminEmail(user?.email);

  useEffect(() => {
    if (!isAdmin) return;
    return watchBroadcasts(setRecent, () => undefined);
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin || !user) return;
    let active = true;
    void user.getIdToken().then(async (token) => {
      const response = await fetch("/api/locations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!active) return;
      if (!response.ok) {
        setPeopleError("The location list could not be opened.");
        return;
      }
      const data = (await response.json()) as { users?: StoredUserLocation[] };
      setPeople(Array.isArray(data.users) ? data.users : []);
      setPeopleError("");
    });
    return () => {
      active = false;
    };
  }, [isAdmin, user]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError("");
    if (!isAdminEmail(email)) {
      setAuthError("That account cannot send notices.");
      return;
    }
    setSigningIn(true);
    try {
      await signIn(email.trim(), password);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setSigningIn(false);
    }
  };

  const onSend = async (event: FormEvent) => {
    event.preventDefault();
    setSendError("");
    setSent("");
    setSending(true);
    try {
      await sendBroadcast(title, body);
      setTitle("");
      setBody("");
      setSent("Sent. Open phones buzz now. A closed phone buzzes the next time the app opens.");
    } catch (error) {
      setSendError(firestoreMessage(error, "That notice was not sent."));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-surface" role="status">
        <p className="text-sm text-on-surface-variant">Loading Ritualoop…</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-surface px-4 py-[max(2.5rem,var(--safe-top))]">
        <div className="mb-8">
          <BrandLogo size="lg" href="/" />
        </div>
        <div className="glass-panel w-full max-w-md rounded-3xl p-6 md:p-8">
          {!user ? (
            <div>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-on-surface">Admin</h1>
              <p className="mt-1 text-sm text-on-surface-variant">Sign in to send notices and see who opened the app.</p>
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                {authError ? (
                  <p className="text-sm text-error" role="alert">
                    {authError}
                  </p>
                ) : null}
                <Button type="submit" className="w-full" loading={signingIn}>
                  Sign in
                </Button>
              </form>
            </div>
          ) : (
            <div>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-on-surface">Not an admin</h1>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {user.email} cannot open this desk. Sign in with the admin account.
              </p>
              <Button type="button" variant="secondary" className="mt-6 w-full" onClick={() => void signOut()}>
                Sign out
              </Button>
            </div>
          )}
        </div>
        <p className="mt-6 text-sm text-on-surface-variant">
          <Link href="/" className="focus-ring rounded font-semibold text-primary">
            Back to Ritualoop
          </Link>
        </p>
      </div>
    );
  }

  const menus: { id: Menu; label: string; count: number; icon: typeof Bell }[] = [
    { id: "notices", label: "Notifications", count: recent.length, icon: Bell },
    { id: "users", label: "User details", count: people.length, icon: Users },
  ];

  return (
    <div className="min-h-[100dvh] bg-surface">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[260px] flex-col border-r border-outline-variant/70 bg-surface-container-lowest px-4 py-5 md:flex">
        <BrandLogo size="sm" href="/" />
        <p className="mt-4 px-2 text-xs font-bold tracking-[0.16em] text-on-surface-variant uppercase">Admin</p>
        <nav className="mt-4 flex flex-1 flex-col gap-1" aria-label="Admin">
          {menus.map((item) => (
            <MenuButton key={item.id} item={item} active={menu === item.id} onSelect={setMenu} />
          ))}
        </nav>
        <div className="flex items-center justify-between gap-2 border-t border-outline-variant/70 pt-4">
          <ThemeToggle compact />
          <button
            type="button"
            onClick={() => void signOut()}
            className="focus-ring inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="md:pl-[260px]">
        <header className="sticky top-0 z-10 border-b border-outline-variant/70 bg-surface/90 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <BrandLogo size="sm" href="/" />
            <div className="flex items-center gap-1">
              <ThemeToggle compact />
              <button
                type="button"
                onClick={() => void signOut()}
                className="focus-ring rounded-full p-2 text-on-surface-variant"
                aria-label="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
          <nav className="mt-3 grid grid-cols-2 gap-2" aria-label="Admin">
            {menus.map((item) => (
              <MenuButton key={item.id} item={item} active={menu === item.id} onSelect={setMenu} />
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-10">
          {menu === "notices" ? (
            <section>
              <p className="text-xs font-bold tracking-[0.16em] text-on-surface-variant uppercase">Notifications</p>
              <h1 className="mt-1 font-heading text-4xl font-extrabold tracking-tight text-on-surface">Send a notice</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-on-surface-variant">
                Every phone buzzes and vibrates until the person taps it.
              </p>
              <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <form onSubmit={onSend} className="glass-panel space-y-4 rounded-3xl p-5 md:p-6">
                  <div>
                    <Label htmlFor="notice-title">Title</Label>
                    <Input
                      id="notice-title"
                      required
                      maxLength={80}
                      value={title}
                      placeholder="e.g. Gym is closed tomorrow"
                      onChange={(event) => setTitle(event.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notice-body">Message</Label>
                    <Textarea
                      id="notice-body"
                      required
                      maxLength={240}
                      value={body}
                      placeholder="What should people see on the notice?"
                      onChange={(event) => setBody(event.target.value)}
                    />
                  </div>
                  {sendError ? (
                    <p className="text-sm text-error" role="alert">
                      {sendError}
                    </p>
                  ) : null}
                  {sent ? (
                    <p className="text-sm text-on-surface" role="status">
                      {sent}
                    </p>
                  ) : null}
                  <Button type="submit" loading={sending}>
                    Send to every phone
                  </Button>
                </form>
                <div className="rounded-3xl bg-surface-container-lowest p-5 md:p-6">
                  <h2 className="font-heading text-2xl font-extrabold text-on-surface">Sent</h2>
                  {recent.length ? (
                    <ul className="mt-4 space-y-3">
                      {recent.map((item) => (
                        <li key={item.id} className="rounded-2xl bg-surface-container-low px-4 py-3">
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-semibold text-on-surface">{item.title}</p>
                            <time className="shrink-0 text-xs text-on-surface-variant">{when(item.createdAt)}</time>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{item.body}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-on-surface-variant">Nothing sent yet.</p>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <section>
              <p className="text-xs font-bold tracking-[0.16em] text-on-surface-variant uppercase">User details</p>
              <h1 className="mt-1 font-heading text-4xl font-extrabold tracking-tight text-on-surface">
                {people.length} {people.length === 1 ? "person" : "people"}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-on-surface-variant">
                Saved when someone opens the Android app and allows location.
              </p>
              {peopleError ? (
                <p className="mt-4 text-sm text-error" role="alert">
                  {peopleError}
                </p>
              ) : null}
              {people.length ? (
                <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                  {people.map((person) => (
                    <li key={person.id} className="rounded-3xl bg-surface-container-lowest p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime text-lg font-extrabold text-[#0d0d0d]">
                          {person.username.slice(0, 1).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-heading text-2xl font-extrabold leading-none text-on-surface">
                            {person.username}
                          </p>
                          {person.email ? (
                            <p className="mt-1 truncate text-sm text-on-surface-variant">{person.email}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="mt-5 flex items-start gap-2 text-sm text-on-surface">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <p className="tabular">
                            {person.latitude.toFixed(5)}, {person.longitude.toFixed(5)}
                          </p>
                          <a
                            className="focus-ring mt-1 inline-block rounded font-semibold text-primary"
                            href={`https://www.google.com/maps?q=${person.latitude},${person.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open map
                          </a>
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-on-surface-variant">Opened {when(person.updatedAt)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-8 text-sm text-on-surface-variant">No one has shared a location yet.</p>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function MenuButton({
  item,
  active,
  onSelect,
}: {
  item: { id: Menu; label: string; count: number; icon: typeof Bell };
  active: boolean;
  onSelect: (id: Menu) => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={() => onSelect(item.id)}
      className={cn(
        "focus-ring flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-bold transition",
        active
          ? "bg-lime text-[#0d0d0d]"
          : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{item.label}</span>
      <span className={cn("tabular text-xs", active ? "text-[#0d0d0d]/70" : "text-on-surface-variant")}>
        {item.count}
      </span>
    </button>
  );
}
