"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/marketing/AuthShell";
import { GuestGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const toast = useToast();
  const { setUser } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Please enter your password.";
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      const user = await api.auth.login({ email: form.email, password: form.password });
      setUser(user);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 401
          ? "Invalid email or password."
          : "Check your credentials and try again.";
      toast.error("Sign in failed", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <GuestGuard>
      <AuthShell>
        <h1 className="text-2xl font-bold text-ink-900">Sign in</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          Access your notebooks and chat with your course materials.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <Field label="Email" error={errors.email}>
            <Input
              type="email"
              autoComplete="email"
              placeholder="you@university.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Password" error={errors.password}>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-brand-700 hover:underline">
            Create one
          </Link>
        </p>
      </AuthShell>
    </GuestGuard>
  );
}
