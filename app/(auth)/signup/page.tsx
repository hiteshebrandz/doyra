"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useAppStore } from "@/store/app-store";

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(email.trim(), password, name);
      if (name.trim()) {
        setTimeout(() => updateSettings({ displayName: name.trim() }), 800);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-on-surface">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-on-surface-variant">
        Start planning habits and tasks with Doyrai.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? (
          <p className="text-sm text-error" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" loading={loading}>
          Sign up
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-on-surface-variant">
        <span className="h-px flex-1 bg-outline-variant/50" />
        or
        <span className="h-px flex-1 bg-outline-variant/50" />
      </div>

      <GoogleButton onClick={() => void onGoogle()} loading={googleLoading} />

      <p className="mt-6 text-center text-sm text-on-surface-variant">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary focus-ring rounded">
          Sign in
        </Link>
      </p>
    </div>
  );
}
