"use client";

import * as React from "react";
import { PageContainer, PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, Input, Select, Toggle, Avatar, Badge } from "@/components/ui/primitives";
import { Icon, type IconName } from "@/components/icons";
import { useToast } from "@/components/ui/Toast";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const tabs: { id: string; label: string; icon: IconName }[] = [
  { id: "profile", label: "Profile", icon: "User" },
  { id: "password", label: "Password", icon: "Lock" },
  { id: "notifications", label: "Notifications", icon: "Bell" },
  { id: "canvas", label: "Connected Canvas", icon: "Canvas" },
  { id: "ai", label: "AI Preferences", icon: "Sparkles" },
];

const studyModes: { id: string; label: string; desc: string; icon: IconName }[] = [
  { id: "beginner", label: "Beginner Mode", desc: "Simple, plain-English explanations with extra context.", icon: "Lightning" },
  { id: "exam", label: "Exam Mode", desc: "Focused, concise answers optimized for revision.", icon: "Target" },
  { id: "technical", label: "Technical Mode", desc: "Detailed, precise answers with full terminology.", icon: "Layers" },
  { id: "quick", label: "Quick Revision Mode", desc: "Bullet-point takeaways for rapid review.", icon: "Lightning" },
];

export default function SettingsPage() {
  const toast = useToast();
  const [tab, setTab] = React.useState("profile");
  const [studyMode, setStudyMode] = React.useState("beginner");
  const [responseLength, setResponseLength] = React.useState("Balanced");
  const [notif, setNotif] = React.useState({ email: true, processing: true, quiz: true, weekly: false, product: false });
  const [profile, setProfile] = React.useState({ name: currentUser.name, email: currentUser.email, role: currentUser.role });

  return (
    <PageContainer>
      <PageHeader title="Settings" description="Manage your profile, preferences, and study experience." />

      <div className="mt-6 grid gap-6 lg:grid-cols-4">
        {/* Tabs */}
        <Card className="h-fit p-2 lg:col-span-1">
          {tabs.map((t) => {
            const IconCmp = Icon[t.icon];
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  tab === t.id ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-slate-50"
                )}
              >
                <IconCmp className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </Card>

        <div className="space-y-6 lg:col-span-3">
          {tab === "profile" && (
            <Card className="p-6">
              <h2 className="text-base font-semibold text-ink-900">Profile settings</h2>
              <div className="mt-5 flex items-center gap-4">
                <Avatar name={profile.name} size={64} />
                <div>
                  <Button variant="secondary" size="sm">Change photo</Button>
                  <p className="mt-1 text-xs text-ink-400">JPG or PNG, up to 2MB.</p>
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Full name</label>
                  <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </div>
                <div>
                  <label className="label">Role</label>
                  <Select value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value as typeof profile.role })}>
                    <option value="Student">Student</option>
                    <option value="Professor">Professor</option>
                    <option value="Admin">Admin</option>
                  </Select>
                </div>
                <div>
                  <label className="label">Institution</label>
                  <Input defaultValue="State University" />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button onClick={() => toast.success("Profile updated")}>Save changes</Button>
              </div>
            </Card>
          )}

          {tab === "password" && (
            <Card className="p-6">
              <h2 className="text-base font-semibold text-ink-900">Password settings</h2>
              <div className="mt-5 grid max-w-md gap-4">
                <div>
                  <label className="label">Current password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">New password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">Confirm new password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button onClick={() => toast.success("Password updated")}>Update password</Button>
              </div>
            </Card>
          )}

          {tab === "notifications" && (
            <Card className="p-6">
              <h2 className="text-base font-semibold text-ink-900">Notification settings</h2>
              <div className="mt-5 space-y-1">
                {[
                  { key: "email", label: "Email notifications", desc: "Receive important updates by email." },
                  { key: "processing", label: "Document processing", desc: "Notify me when uploads finish indexing." },
                  { key: "quiz", label: "Quiz results", desc: "Notify me when a quiz is graded." },
                  { key: "weekly", label: "Weekly study summary", desc: "A digest of your study activity." },
                  { key: "product", label: "Product updates", desc: "News about new features." },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between border-b border-slate-50 py-3 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-ink-900">{n.label}</p>
                      <p className="text-xs text-ink-400">{n.desc}</p>
                    </div>
                    <Toggle
                      checked={notif[n.key as keyof typeof notif]}
                      onChange={(v) => setNotif({ ...notif, [n.key]: v })}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "canvas" && (
            <Card className="p-6">
              <h2 className="text-base font-semibold text-ink-900">Connected Canvas account</h2>
              <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon.Canvas className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink-900">canvas.university.edu</p>
                    <p className="text-xs text-ink-400">Connected as maya.t@university.edu</p>
                  </div>
                </div>
                <Badge tone="green"><Icon.Check className="h-3.5 w-3.5" /> Active</Badge>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="secondary" onClick={() => toast.success("Canvas resynced")}><Icon.Refresh className="h-4 w-4" /> Resync</Button>
                <Button variant="secondary" onClick={() => toast.info("Canvas disconnected")}>Disconnect</Button>
              </div>
            </Card>
          )}

          {tab === "ai" && (
            <>
              <Card className="p-6">
                <h2 className="text-base font-semibold text-ink-900">AI response preference</h2>
                <p className="text-sm text-ink-500">Control how detailed the AI&apos;s answers are.</p>
                <div className="mt-4 flex gap-2">
                  {["Concise", "Balanced", "Detailed"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setResponseLength(r)}
                      className={cn(
                        "flex-1 rounded-xl border py-2.5 text-sm font-medium transition",
                        responseLength === r ? "border-brand-300 bg-brand-50 text-brand-700" : "border-slate-200 text-ink-600 hover:bg-slate-50"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-base font-semibold text-ink-900">Study mode preference</h2>
                <p className="text-sm text-ink-500">Choose how the assistant explains things to you.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {studyModes.map((m) => {
                    const IconCmp = Icon[m.icon];
                    const active = studyMode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setStudyMode(m.id)}
                        className={cn(
                          "flex items-start gap-3 rounded-xl border p-4 text-left transition",
                          active ? "border-brand-300 bg-brand-50/50" : "border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", active ? "bg-brand-600 text-white" : "bg-slate-100 text-ink-500")}>
                          <IconCmp className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-ink-900">{m.label}</p>
                          <p className="text-xs text-ink-400">{m.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5 flex justify-end">
                  <Button onClick={() => toast.success("AI preferences saved")}>Save preferences</Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
