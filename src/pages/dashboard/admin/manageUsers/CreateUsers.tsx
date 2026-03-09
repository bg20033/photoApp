import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import type { User, FormState } from "./types";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
}

async function apiCreateUser(payload: Partial<User>): Promise<User> {
  try {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return (await res.json()) as User;
  } catch {
    // Fallback create locally
    const uid = (prefix = "") =>
      `${prefix}${Math.random().toString(36).slice(2, 9)}`;
    return {
      id: uid("u_"),
      name: payload.name || "Unnamed",
      email: payload.email || "no-reply@example.com",
      role: payload.role || "user",
      createdAt: new Date().toISOString(),
    };
  }
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onSave,
}: CreateUserModalProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    role: "user",
  });
  const [saving, setSaving] = useState<boolean>(false);

  async function handleSave() {
    // Basic validation
    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and email are required.");
      return;
    }
    setSaving(true);
    try {
      const created = await apiCreateUser(form);
      onSave(created);
      // Reset form
      setForm({ name: "", email: "", role: "user" });
    } catch (err) {
      console.error(err);
      alert("An error occurred while creating the user.");
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (!saving) {
      setForm({ name: "", email: "", role: "user" });
      onClose();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create user"
      disabled={saving}
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            className="w-full rounded-md border px-3 py-2"
            type="email"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="rounded-md border px-3 py-2 text-sm"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-primary px-3 py-2 text-sm text-white"
            disabled={saving}
          >
            {saving ? "Creating..." : "Create user"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
