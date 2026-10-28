"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { isAdminEmail, sendBroadcast, watchBroadcasts, type Broadcast } from "@/lib/broadcasts";

function firestoreMessage(error: unknown, fallback: string): string {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code: string }).code)
      : "";
  if (code === "permission-denied") return fallback;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function AdminPage() {
  const { user, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("Admin@gmail.com");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sent, setSent] = useState("");
  const [recent, setRecent] = useState<Broadcast[]>([]);

  const isAdmin = isAdminEmail(user?.email);

  useEffect(() => {
    if (!isAdmin) return;
    return watchBroadcasts(setRecent, () => undefined);
  }, [isAdmin]);

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
      setSent("Sent. Phones that have Ritualoop open will buzz now. A closed phone buzzes the next time the app opens.");
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

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-[max(2.5rem,var(--safe-top))] pb-[max(2.5rem,var(--safe-bottom))]">
      <div className="mb-8">
        <BrandLogo size="lg" href="/" />
      </div>
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 md:p-8">
        {!user ? (
          <div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-on-surface">
              Admin
            </h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              Sign in to send a notice to every phone.
            </p>
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
        ) : null}

        {user && !isAdmin ? (
          <div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-on-surface">
              Not an admin
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              {user.email} cannot send notices. Sign in with the admin account.
            </p>
            <Button type="button" variant="secondary" className="mt-6 w-full" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        ) : null}

        {user && isAdmin ? (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-heading text-3xl font-extrabold tracking-tight text-on-surface">
                  Send a notice
                </h1>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Every phone buzzes and vibrates until the person taps it.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void signOut()}
                className="focus-ring shrink-0 rounded-full px-2 py-1 text-sm font-semibold text-on-surface-variant"
              >
                Sign out
              </button>
            </div>
            <form onSubmit={onSend} className="mt-6 space-y-4">
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
              <Button type="submit" className="w-full" loading={sending}>
                Send to every phone
              </Button>
            </form>
            {recent.length ? (
              <ul className="mt-8 space-y-3">
                {recent.map((item) => (
                  <li key={item.id} className="rounded-2xl bg-surface-container-low px-4 py-3">
                    <p className="font-semibold text-on-surface">{item.title}</p>
                    <p className="mt-1 text-sm text-on-surface-variant">{item.body}</p>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
      <p className="mt-6 text-center text-sm text-on-surface-variant">
        <Link href="/" className="focus-ring rounded font-semibold text-primary">
          Back to Ritualoop
        </Link>
      </p>
    </div>
  );
}
