import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { type Worker, type Role } from "../../CalculateWork/types";
import { getIconComponent } from "../cards/Roles";

interface WorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (worker: Omit<Worker, "id">) => void;
  worker?: Worker | null;
  roles: Role[];
}

export function WorkerModal({
  isOpen,
  onClose,
  onSave,
  worker,
  roles,
}: WorkerModalProps) {
  const [name, setName] = useState(worker?.name || "");
  const [email, setEmail] = useState(worker?.email || "");
  const [phone, setPhone] = useState(worker?.phone || "");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    worker?.roleIds || [],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      roleIds: selectedRoles,
    });
    onClose();
  };

  const handleClose = () => {
    if (!worker) {
      setName("");
      setEmail("");
      setPhone("");
      setSelectedRoles([]);
    }
    onClose();
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={worker ? "Edit Worker" : "Create New Worker"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="workerName">Worker Name</Label>
          <Input
            id="workerName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter worker name"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workerEmail">Email</Label>
            <Input
              id="workerEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workerPhone">Phone</Label>
            <Input
              id="workerPhone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Assigned Roles</Label>
          <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
            {roles.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No roles available. Create roles first.
              </p>
            ) : (
              roles.map((role) => {
                const Icon = getIconComponent(role.icon);
                const isSelected = selectedRoles.includes(role.id);
                return (
                  <label
                    key={role.id}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRole(role.id)}
                      className="rounded border-gray-300"
                    />
                    <HugeiconsIcon
                      icon={Icon}
                      className="size-4 text-muted-foreground"
                    />
                    <span className="text-sm">{role.name}</span>
                  </label>
                );
              })
            )}
          </div>
          {selectedRoles.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {selectedRoles.length} role{selectedRoles.length !== 1 ? "s" : ""}{" "}
              selected
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">
            {worker ? "Update Worker" : "Create Worker"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
