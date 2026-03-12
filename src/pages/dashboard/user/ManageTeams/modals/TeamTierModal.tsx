import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { type TeamTier } from "../../CalculateWork/types";

interface TeamTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tier: Omit<TeamTier, "id">) => void;
  tier?: TeamTier | null;
}

export function TeamTierModal({
  isOpen,
  onClose,
  onSave,
  tier,
}: TeamTierModalProps) {
  const [teamSize, setTeamSize] = useState(tier?.teamSize ?? 1);
  const [price, setPrice] = useState(tier?.price ?? 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ teamSize, price });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tier ? "Edit Team Tier" : "Add Team Tier"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tierTeamSize">Team Size</Label>
          <Input
            id="tierTeamSize"
            type="number"
            min="1"
            value={teamSize}
            onChange={(e) => setTeamSize(parseInt(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tierPrice">Price (€)</Label>
          <Input
            id="tierPrice"
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{tier ? "Update" : "Add"}</Button>
        </div>
      </form>
    </Modal>
  );
}
