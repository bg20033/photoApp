import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import type { Client } from "./types";

interface DeleteClientModalProps {
  isOpen: boolean;
  client: Client | null;
  onClose: () => void;
  onConfirm: () => void;
}

async function apiDeleteClient(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/user/clients/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete client");
  } catch {
    // ignore in fallback
  }
}

export default function DeleteClientModal({
  isOpen,
  client,
  onClose,
  onConfirm,
}: DeleteClientModalProps) {
  const [deleting, setDeleting] = useState<boolean>(false);

  async function handleDelete() {
    if (!client) return;
    setDeleting(true);
    try {
      await apiDeleteClient(client.id);
      onConfirm();
    } catch (err) {
      console.error(err);
      alert("Failed to delete client.");
    } finally {
      setDeleting(false);
    }
  }

  function handleClose() {
    if (!deleting) {
      onClose();
    }
  }

  if (!isOpen || !client) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete client"
      disabled={deleting}
    >
      <p className="mb-4 text-sm text-muted-foreground">
        Are you sure you want to delete <strong>{client.name}</strong>? This
        action cannot be undone.
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={handleClose}
          className="rounded-md border px-3 py-2 text-sm"
          disabled={deleting}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="rounded-md bg-destructive px-3 py-2 text-sm text-white"
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
