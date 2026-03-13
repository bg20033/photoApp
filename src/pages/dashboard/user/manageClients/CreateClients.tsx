import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import type { Client, FormState } from "./types";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
}

function generatePassword(length: number = 12): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

async function apiCreateClient(payload: Partial<Client>): Promise<Client> {
  try {
    const res = await fetch("/api/user/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create client");
    return (await res.json()) as Client;
  } catch {
    const uid = (prefix = "") =>
      `${prefix}${Math.random().toString(36).slice(2, 9)}`;
    return {
      id: uid("c_"),
      name: payload.name || "Unnamed Client",
      email: payload.email || "no-reply@example.com",
      company: payload.company || "",
      password: payload.password || "",
      phone: payload.phone || "",
      createdAt: new Date().toISOString(),
    };
  }
}

export default function CreateClientModal({
  isOpen,
  onClose,
  onSave,
}: CreateClientModalProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [autoGenerate, setAutoGenerate] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  function handleAutoGenerateToggle(checked: boolean) {
    setAutoGenerate(checked);
    if (checked) {
      setForm((s) => ({ ...s, password: generatePassword() }));
    } else {
      setForm((s) => ({ ...s, password: "" }));
    }
  }

  function handleGeneratePassword() {
    setForm((s) => ({ ...s, password: generatePassword() }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and email are required.");
      return;
    }
    if (!form.password.trim()) {
      alert("Password is required.");
      return;
    }
    setSaving(true);
    try {
      const created = await apiCreateClient(form);
      onSave(created);
      setForm({ name: "", email: "",  password: "", phone: "" });
    } catch (err) {
      console.error(err);
      alert("An error occurred while creating the client.");
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (!saving) {
      setForm({ name: "", email: "",  password: "", phone: "" });
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create client"
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
          <div className="mb-2 flex items-center gap-2">
            <input
              id="autoGeneratePassword"
              type="checkbox"
              checked={autoGenerate}
              onChange={(e) => handleAutoGenerateToggle(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="autoGeneratePassword" className="text-sm">
              Auto-generate password
            </label>
          </div>
          <div className="flex gap-2">
            <input
              value={form.password}
              onChange={(e) =>
                setForm((s) => ({ ...s, password: e.target.value }))
              }
              className="w-full rounded-md border px-3 py-2"
              type={autoGenerate ? "text" : "password"}
              placeholder={
                autoGenerate ? "Password will be generated" : "Enter password"
              }
              disabled={autoGenerate}
            />
            {autoGenerate && (
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100"
                title="Regenerate password"
              >
                ↻
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
            className="w-full rounded-md border px-3 py-2"
            type="tel"
          />
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
            {saving ? "Creating..." : "Create client"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
