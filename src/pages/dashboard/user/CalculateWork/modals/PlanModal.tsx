import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { type PricingPlan, type Service } from "../types";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Omit<PricingPlan, "id">) => void;
  plan?: PricingPlan | null;
  availableServices: Service[];
}

export function PlanModal({
  isOpen,
  onClose,
  onSave,
  plan,
  availableServices,
}: PlanModalProps) {
  const [name, setName] = useState(plan?.name || "");
  const [basePrice, setBasePrice] = useState(plan?.basePrice ?? 0);
  const [includedTeamSize, setIncludedTeamSize] = useState(
    plan?.includedTeamSize ?? 1,
  );
  const [description, setDescription] = useState(plan?.description || "");
  const [includedServices, setIncludedServices] = useState<string[]>(
    plan?.includedServices || [],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      basePrice,
      includedTeamSize,
      description,
      includedServices,
    });
    onClose();
  };

  const toggleService = (serviceName: string) => {
    setIncludedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName],
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={plan ? "Edit Plan" : "Create Plan"}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-h-[60vh] overflow-y-auto"
      >
        <div className="space-y-2">
          <Label htmlFor="planName">Plan Name</Label>
          <Input
            id="planName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Premium Wedding"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="basePrice">Base Price (€)</Label>
            <Input
              id="basePrice"
              type="number"
              min="0"
              value={basePrice}
              onChange={(e) => setBasePrice(parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teamSize">Included Team Size</Label>
            <Input
              id="teamSize"
              type="number"
              min="1"
              value={includedTeamSize}
              onChange={(e) => setIncludedTeamSize(parseInt(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="planDescription">Description</Label>
          <textarea
            id="planDescription"
            className="w-full p-2 border rounded-md text-sm"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Included Services</Label>
          <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
            {availableServices.map((service) => (
              <label
                key={service.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={includedServices.includes(service.name)}
                  onChange={() => toggleService(service.name)}
                />
                <span className="text-sm">{service.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{plan ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
}
