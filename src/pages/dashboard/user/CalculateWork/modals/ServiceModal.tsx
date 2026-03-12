import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { type Service } from "../types";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Omit<Service, "id">) => void;
  service?: Service | null;
}

export function ServiceModal({
  isOpen,
  onClose,
  onSave,
  service,
}: ServiceModalProps) {
  const [name, setName] = useState(service?.name || "");
  const [price, setPrice] = useState(service?.price ?? 0);
  const [description, setDescription] = useState(service?.description || "");
  const [category, setCategory] = useState(service?.category || "Photo");

  const categories = ["Photo", "Video", "Team", "Time", "Product", "Other"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, price, description, category });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={service ? "Edit Service" : "Add Service"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="serviceName">Service Name</Label>
          <Input
            id="serviceName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="servicePrice">Price (€)</Label>
            <Input
              id="servicePrice"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="w-full p-2 border rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceDescription">Description</Label>
          <textarea
            id="serviceDescription"
            className="w-full p-2 border rounded-md text-sm"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{service ? "Update" : "Add"}</Button>
        </div>
      </form>
    </Modal>
  );
}
