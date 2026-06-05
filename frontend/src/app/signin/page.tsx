"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/marketing/AuthShell";
import { Button } from "@/components/ui/Button";
import { Field, Input, Divider } from "@/components/ui/primitives";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api/endpoints";

export default function SignInPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({ email: "", password: "", remember: true });
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
      await api.auth.login({ email: form.email, password: form.password });
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch {
      toast.error("Sign in failed", "Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="text-2xl font-bold text-ink-900">Welcome back</h1>
      <p className="mt-1.5 text-sm text-ink-500">Sign in to continue studying with your materials.</p>

      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="btn btn-secondary btn-md mt-6 w-full"
      >
        <Icon.Google /> Continue with Google
      </button>

      <div className="my-6">
        <Divider>or sign in with email</Divider>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field label="Email" error={errors.email}>
          <Input
            type="email"
            placeholder="you@university.edu"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Password" error={errors.password}>
          <Input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </Field>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
            />
            Remember me
          </label>
          <Link href="#" className="text-sm font-medium text-brand-700 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-brand-700 hover:underline">
          Sign Up
        </Link>
      </p>
    </AuthShell>
  );
}
