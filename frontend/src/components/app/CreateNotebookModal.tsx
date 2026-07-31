"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea, Select } from "@/components/ui/primitives";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api/endpoints";
import type { Notebook } from "@/lib/types";

import { BUSINESS_SUBJECTS } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";

export function CreateNotebookModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (n: Notebook) => void;
}) {
  const toast = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    course: "",
    description: "",
    subject: "Finance",
    visibility: "Private" as "Private" | "Shared with class",
  });

  async function onCreate() {
    if (!form.title.trim()) {
      toast.error("Notebook name is required");
      return;
    }
    setLoading(true);
    try {
      const nb = await api.notebooks.create({ ...form, userId: user?.id });
      toast.success("Notebook created", "You can now upload materials.");
      onCreated?.(nb);
      onClose();
      setForm({ title: "", course: "", description: "", subject: "Finance", visibility: "Private" });
    } catch {
      toast.error("Could not create notebook");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create a new notebook"
      description="A notebook is a dedicated space for one course or subject."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onCreate} loading={loading}>
            <Icon.Plus className="h-4 w-4" /> Create Notebook
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Notebook name">
          <Input
            placeholder="e.g. Corporate Finance"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>
        <Field label="Course name" hint="The course code or title this notebook belongs to.">
          <Input
            placeholder="e.g. FIN 401"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          />
        </Field>
        <Field label="Description">
          <Textarea
            rows={3}
            placeholder="What will you study in this notebook?"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Subject category">
            <Select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
              {BUSINESS_SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Visibility">
            <Select
              value={form.visibility}
              onChange={(e) => setForm({ ...form, visibility: e.target.value as typeof form.visibility })}
            >
              <option value="Private">Private</option>
              <option value="Shared with class">Shared with class</option>
            </Select>
          </Field>
        </div>
      </div>
    </Modal>
  );
}
