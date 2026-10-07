"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-on-surface">
        Reset password
      </h1>
      <p className="mt-1 text-sm text-on-surface-variant">
        We&apos;ll email you a link to reset your password.
      </p>

      {done ? (
        <div className="mt-6 rounded-xl bg-tertiary-fixed/30 p-4 text-sm text-tertiary">
          Check your inbox for a reset link.{" "}
          <Link href="/login" className="font-semibold underline">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
          {error ? (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" loading={loading}>
            Send reset link
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-on-surface-variant">
        <Link href="/login" className="font-semibold text-primary focus-ring rounded">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
