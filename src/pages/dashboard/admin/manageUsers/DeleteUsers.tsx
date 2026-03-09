import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import type { User } from "./types";

interface DeleteUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

async function apiDeleteUser(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete user");
  } catch {
    // ignore in fallback
  }
}

export default function DeleteUserModal({
  isOpen,
  user,
  onClose,
  onConfirm,
}: DeleteUserModalProps) {
  const [deleting, setDeleting] = useState<boolean>(false);

  async function handleDelete() {
    if (!user) return;
    setDeleting(true);
    try {
      await apiDeleteUser(user.id);
      onConfirm();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    } finally {
      setDeleting(false);
    }
  }

  function handleClose() {
    if (!deleting) {
      onClose();
    }
  }

  if (!isOpen || !user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete user"
      disabled={deleting}
    >
      <p className="mb-4 text-sm text-muted-foreground">
        Are you sure you want to delete <strong>{user.name}</strong>? This
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
