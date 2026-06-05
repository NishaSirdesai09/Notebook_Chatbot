"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/marketing/AuthShell";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Divider } from "@/components/ui/primitives";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api/endpoints";
import type { Role } from "@/lib/types";

export default function SignUpPage() {
  const router = useRouter();
  const toast = useToast();
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
      await api.auth.signup({ name: form.name, email: form.email, password: form.password, role: form.role });
      toast.success("Account created!", "Let's get you set up.");
      router.push("/onboarding");
    } catch {
      toast.error("Sign up failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="text-2xl font-bold text-ink-900">Create your account</h1>
      <p className="mt-1.5 text-sm text-ink-500">Start learning from your own materials in minutes.</p>

      <button
        type="button"
        onClick={() => router.push("/onboarding")}
        className="btn btn-secondary btn-md mt-6 w-full"
      >
        <Icon.Google /> Continue with Google
      </button>

      <div className="my-6">
        <Divider>or sign up with email</Divider>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Field label="Full name" error={errors.name}>
          <Input
            placeholder="Maya Thompson"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <Input
            type="email"
            placeholder="you@university.edu"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Password" error={errors.password}>
            <Input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>
          <Field label="Confirm password" error={errors.confirm}>
            <Input
              type="password"
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
            <option value="Admin">Admin</option>
          </Select>
        </Field>

        <label className="flex items-start gap-2.5 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) => setForm({ ...form, terms: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
          />
          <span>
            I agree to the{" "}
            <Link href="#" className="font-medium text-brand-700 hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="#" className="font-medium text-brand-700 hover:underline">Privacy Policy</Link>.
          </span>
        </label>
        {errors.terms && <p className="-mt-2 text-xs text-red-600">{errors.terms}</p>}

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link href="/signin" className="font-semibold text-brand-700 hover:underline">
          Sign In
        </Link>
      </p>
    </AuthShell>
  );
}
