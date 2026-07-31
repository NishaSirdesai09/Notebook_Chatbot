"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/marketing/AuthShell";
import { GuestGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/lib/types";

export default function SignUpPage() {
  const router = useRouter();
  const toast = useToast();
  const { setUser } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "Student" as Role,
    terms: false,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your full name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    if (!form.terms) e.terms = "You must accept the terms to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await api.auth.signup({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setUser(user);
      toast.success("Account created!");
      router.push("/onboarding");
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 409
          ? "An account with this email already exists."
          : "Please try again.";
      toast.error("Sign up failed", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <GuestGuard>
      <AuthShell>
        <h1 className="text-2xl font-bold text-ink-900">Create your account</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          Start chatting with your cases, slides, and professor reference PDFs.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <Field label="Full name" error={errors.name}>
            <Input
              autoComplete="name"
              placeholder="Jordan Lee"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <Input
              type="email"
              autoComplete="email"
              placeholder="you@university.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Password" error={errors.password}>
              <Input
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </Field>
            <Field label="Confirm" error={errors.confirm}>
              <Input
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
            </Field>
          </div>
          <Field label="I am a…">
            <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
              <option value="Student">Student</option>
              <option value="Professor">Professor</option>
            </Select>
          </Field>

          <label className="flex items-start gap-2.5 text-sm text-ink-600">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
            />
            <span>I agree to the terms of service and privacy policy.</span>
          </label>
          {errors.terms && <p className="-mt-2 text-xs text-red-600">{errors.terms}</p>}

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-brand-700 hover:underline">
            Sign in
          </Link>
        </p>
      </AuthShell>
    </GuestGuard>
  );
}
