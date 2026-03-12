import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { type Role, type IconType } from "../../CalculateWork/types";
import { ICON_OPTIONS } from "../cards/Roles";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Omit<Role, "id">) => void;
  role?: Role | null;
}

export function RoleModal({ isOpen, onClose, onSave, role }: RoleModalProps) {
  const [name, setName] = useState(role?.name || "");
  const [selectedIcon, setSelectedIcon] = useState<IconType>(
    role?.icon || "User",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), icon: selectedIcon });
    onClose();
  };

  const handleClose = () => {
    if (!role) {
      setName("");
      setSelectedIcon("User");
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={role ? "Edit Role" : "Create New Role"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="roleName">Role Name</Label>
          <Input
            id="roleName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter role name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Select Icon</Label>
          <div className="grid grid-cols-5 gap-2">
            {ICON_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedIcon(option.value)}
                  className={`flex flex-col items-center justify-center gap-1 p-3 rounded-md border transition-all ${
                    selectedIcon === option.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted"
                  }`}
                >
                  <HugeiconsIcon icon={Icon} className="size-5" />
                  <span className="text-[10px]">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">{role ? "Update Role" : "Create Role"}</Button>
        </div>
      </form>
    </Modal>
  );
}
