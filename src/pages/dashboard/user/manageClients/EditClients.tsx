import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import type { Client, FormState } from "./types";

interface EditClientModalProps {
  isOpen: boolean;
  client: Client | null;
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

async function apiUpdateClient(
  id: string,
  payload: Partial<Client>,
): Promise<Client> {
  try {
    const res = await fetch(`/api/user/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update client");
    return (await res.json()) as Client;
  } catch {
    return {
      id,
      name: payload.name || "Updated Client",
      email: payload.email || "updated@example.com",
      company: payload.company || "",
      password: payload.password || "",
      phone: payload.phone || "",
      createdAt: new Date().toISOString(),
    };
  }
}

export default function EditClientModal({
  isOpen,
  client,
  onClose,
  onSave,
}: EditClientModalProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name,
        email: client.email,
        password: client.password || "",
        phone: client.phone || "",
      });
    }
  }, [client]);

  async function handleSave() {
    if (!client) return;
    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and email are required.");
      return;
    }
    setSaving(true);
    try {
      const updated = await apiUpdateClient(client.id, form);
      onSave(updated);
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating the client.");
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (!saving) {
      onClose();
    }
  }

  function handleGeneratePassword() {
    setForm((s) => ({ ...s, password: generatePassword() }));
  }

  if (!isOpen || !client) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit client"
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
          <label className="mb-1 block text-sm">Password</label>
          <div className="flex gap-2">
            <input
              value={form.password}
              onChange={(e) =>
                setForm((s) => ({ ...s, password: e.target.value }))
              }
              className="w-full rounded-md border px-3 py-2"
              type="password"
              placeholder="Enter new password or generate"
            />
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100"
              title="Generate new password"
            >
              ↻
            </button>
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
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
