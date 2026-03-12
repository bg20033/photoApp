import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  SettingsIcon,
  PackageIcon,
  LinkIcon,
} from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface EquipmentCategory {
  id: string;
  name: string;
  isCustom?: boolean;
}

export interface Part {
  id: string;
  name: string;
  description?: string;
  compatibleEquipmentIds: string[];
}

export interface Equipment {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  parts: Part[];
}

// ============================================
// DEFAULT CATEGORIES
// ============================================

const DEFAULT_CATEGORIES: EquipmentCategory[] = [
  { id: "1", name: "Lighting" },
  { id: "2", name: "PCs" },
  { id: "3", name: "Radios" },
  { id: "4", name: "Cameras" },
  { id: "5", name: "Audio" },
  { id: "6", name: "Other" },
];

// Sample data
const SAMPLE_EQUIPMENT: Equipment[] = [
  {
    id: "1",
    name: "Aputure 300d II",
    categoryId: "1",
    description: "LED Light Kit",
    parts: [
      {
        id: "p1",
        name: "Light Head",
        description: "Main LED unit",
        compatibleEquipmentIds: [],
      },
      {
        id: "p2",
        name: "Power Cable",
        description: "AC power cord",
        compatibleEquipmentIds: ["2"],
      },
      {
        id: "p3",
        name: "Light Stand",
        description: "Adjustable stand",
        compatibleEquipmentIds: ["1", "3"],
      },
      {
        id: "p4",
        name: "Softbox",
        description: "Diffusion box",
        compatibleEquipmentIds: [],
      },
    ],
  },
  {
    id: "2",
    name: "MacBook Pro 16",
    categoryId: "2",
    description: "Video editing workstation",
    parts: [
      {
        id: "p5",
        name: "Charger",
        description: "96W USB-C",
        compatibleEquipmentIds: [],
      },
      {
        id: "p6",
        name: "Thunderbolt Cable",
        description: "1m cable",
        compatibleEquipmentIds: [],
      },
    ],
  },
  {
    id: "3",
    name: "Godox VL150",
    categoryId: "1",
    description: "LED Video Light",
    parts: [],
  },
];

// ============================================
// COMPONENT
// ============================================

export default function EquipmentStorage() {
  // State
  const [categories, setCategories] =
    useState<EquipmentCategory[]>(DEFAULT_CATEGORIES);
  const [equipment, setEquipment] = useState<Equipment[]>(SAMPLE_EQUIPMENT);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filtered equipment based on category
  const filteredEquipment =
    selectedCategory === "all"
      ? equipment
      : equipment.filter((eq) => eq.categoryId === selectedCategory);

  // Modal states
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCompatibilityModalOpen, setIsCompatibilityModalOpen] =
    useState(false);

  // Editing states
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(
    null,
  );
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [selectedEquipmentForParts, setSelectedEquipmentForParts] =
    useState<Equipment | null>(null);
  const [selectedPartForCompatibility, setSelectedPartForCompatibility] =
    useState<Part | null>(null);

  // Form states
  const [equipmentForm, setEquipmentForm] = useState({
    name: "",
    categoryId: "",
    description: "",
  });
  const [partForm, setPartForm] = useState({ name: "", description: "" });
  const [categoryForm, setCategoryForm] = useState("");

  // ============================================
  // EQUIPMENT HANDLERS
  // ============================================

  const handleCreateEquipment = () => {
    setEditingEquipment(null);
    setEquipmentForm({
      name: "",
      categoryId: categories[0]?.id || "",
      description: "",
    });
    setIsEquipmentModalOpen(true);
  };

  const handleEditEquipment = (eq: Equipment) => {
    setEditingEquipment(eq);
    setEquipmentForm({
      name: eq.name,
      categoryId: eq.categoryId,
      description: eq.description || "",
    });
    setIsEquipmentModalOpen(true);
  };

  const handleSaveEquipment = () => {
    if (!equipmentForm.name.trim() || !equipmentForm.categoryId) return;

    if (editingEquipment) {
      setEquipment((prev) =>
        prev.map((eq) =>
          eq.id === editingEquipment.id
            ? {
                ...eq,
                name: equipmentForm.name,
                categoryId: equipmentForm.categoryId,
                description: equipmentForm.description,
              }
            : eq,
        ),
      );
    } else {
      const newEquipment: Equipment = {
        id: Date.now().toString(),
        name: equipmentForm.name,
        categoryId: equipmentForm.categoryId,
        description: equipmentForm.description,
        parts: [],
      };
      setEquipment((prev) => [...prev, newEquipment]);
    }
    setIsEquipmentModalOpen(false);
  };

  const handleDeleteEquipment = (id: string) => {
    if (confirm("Are you sure you want to delete this equipment?")) {
      setEquipment((prev) => prev.filter((eq) => eq.id !== id));
    }
  };

  // ============================================
  // CATEGORY HANDLERS
  // ============================================

  const handleCreateCategory = () => {
    if (!categoryForm.trim()) return;
    const newCategory: EquipmentCategory = {
      id: Date.now().toString(),
      name: categoryForm.trim(),
      isCustom: true,
    };
    setCategories((prev) => [...prev, newCategory]);
    setCategoryForm("");
    setIsCategoryModalOpen(false);
  };

  // ============================================
  // PART HANDLERS
  // ============================================

  const handleCreatePart = (eq: Equipment) => {
    setSelectedEquipmentForParts(eq);
    setEditingPart(null);
    setPartForm({ name: "", description: "" });
    setIsPartModalOpen(true);
  };

  const handleEditPart = (eq: Equipment, part: Part) => {
    setSelectedEquipmentForParts(eq);
    setEditingPart(part);
    setPartForm({ name: part.name, description: part.description || "" });
    setIsPartModalOpen(true);
  };

  const handleSavePart = () => {
    if (!partForm.name.trim() || !selectedEquipmentForParts) return;

    if (editingPart) {
      setEquipment((prev) =>
        prev.map((eq) =>
          eq.id === selectedEquipmentForParts.id
            ? {
                ...eq,
                parts: eq.parts.map((p) =>
                  p.id === editingPart.id
                    ? {
                        ...p,
                        name: partForm.name,
                        description: partForm.description,
                      }
                    : p,
                ),
              }
            : eq,
        ),
      );
    } else {
      const newPart: Part = {
        id: Date.now().toString(),
        name: partForm.name,
        description: partForm.description,
        compatibleEquipmentIds: [],
      };
      setEquipment((prev) =>
        prev.map((eq) =>
          eq.id === selectedEquipmentForParts.id
            ? { ...eq, parts: [...eq.parts, newPart] }
            : eq,
        ),
      );
    }
    setIsPartModalOpen(false);
  };

  const handleDeletePart = (eqId: string, partId: string) => {
    if (confirm("Are you sure you want to delete this part?")) {
      setEquipment((prev) =>
        prev.map((eq) =>
          eq.id === eqId
            ? { ...eq, parts: eq.parts.filter((p) => p.id !== partId) }
            : eq,
        ),
      );
    }
  };

  // ============================================
  // COMPATIBILITY HANDLERS
  // ============================================

  const handleOpenCompatibility = (eq: Equipment, part: Part) => {
    setSelectedEquipmentForParts(eq);
    setSelectedPartForCompatibility(part);
    setIsCompatibilityModalOpen(true);
  };

  const handleToggleCompatibility = (equipmentId: string) => {
    if (!selectedPartForCompatibility || !selectedEquipmentForParts) return;

    const currentIds = selectedPartForCompatibility.compatibleEquipmentIds;
    const newIds = currentIds.includes(equipmentId)
      ? currentIds.filter((id) => id !== equipmentId)
      : [...currentIds, equipmentId];

    // Update the part in equipment state
    setEquipment((prev) =>
      prev.map((eq) =>
        eq.id === selectedEquipmentForParts.id
          ? {
              ...eq,
              parts: eq.parts.map((p) =>
                p.id === selectedPartForCompatibility.id
                  ? { ...p, compatibleEquipmentIds: newIds }
                  : p,
              ),
            }
          : eq,
      ),
    );

    // Update the local state for the modal
    setSelectedPartForCompatibility((prev) =>
      prev ? { ...prev, compatibleEquipmentIds: newIds } : null,
    );
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  // Main view
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Equipment & Parts</h2>
          <p className="text-sm text-muted-foreground">
            Manage equipment, parts, and compatibility
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            <SettingsIcon className="size-4 mr-2" /> Categories
          </Button>
          <Button onClick={handleCreateEquipment}>
            <PlusIcon className="size-4 mr-2" /> Add Equipment
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCategory !== "all" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            Clear filter
          </Button>
        )}
      </div>

      {filteredEquipment.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <PackageIcon className="size-12 mx-auto mb-4 opacity-50" />
            <p>No equipment added yet</p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={handleCreateEquipment}
            >
              Add your first equipment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEquipment.map((eq) => (
            <Card
              key={eq.id}
              className="hover:shadow-md transition-shadow flex flex-col h-112.5"
            >
              <CardHeader className="pb-2 shrink-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base truncate pr-2">
                      {eq.name}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {getCategoryName(eq.categoryId)}
                    </Badge>
                    {eq.description && (
                      <Badge variant="secondary" className="mt-1 ms-1">
                        {eq.description}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Edit Equipment"
                      onClick={() => handleEditEquipment(eq)}
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive"
                      title="Delete Equipment"
                      onClick={() => handleDeleteEquipment(eq.id)}
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4 pb-0 pt-0 min-h-0">
                <div className="border rounded-md h-full flex flex-col">
                  <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/20 shrink-0">
                    <span className="text-sm font-medium">
                      Parts ({eq.parts.length})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-2"
                      onClick={() => handleCreatePart(eq)}
                    >
                      <PlusIcon className="size-3 mr-1" /> Add Part
                    </Button>
                  </div>
                  <div className="flex-1 p-3 overflow-y-auto min-h-0">
                    {eq.parts.length === 0 ? (
                      <div className="text-xs text-muted-foreground text-center pt-4 bg-muted/30 rounded-md">
                        No parts added.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {eq.parts.map((part) => (
                          <div
                            key={part.id}
                            className="flex flex-col gap-1 p-2 bg-muted/50 rounded-md border border-border/50"
                          >
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <span className="text-sm font-medium block truncate">
                                  {part.name}
                                </span>
                                {part.description && (
                                  <span className="text-xs text-muted-foreground line-clamp-2">
                                    {part.description}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-0.5 ml-2 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="h-6 w-6"
                                  title="Manage Compatibility"
                                  onClick={() =>
                                    handleOpenCompatibility(eq, part)
                                  }
                                >
                                  <LinkIcon className="size-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="h-6 w-6"
                                  title="Edit Part"
                                  onClick={() => handleEditPart(eq, part)}
                                >
                                  <PencilIcon className="size-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="h-6 w-6 text-destructive"
                                  title="Delete Part"
                                  onClick={() =>
                                    handleDeletePart(eq.id, part.id)
                                  }
                                >
                                  <TrashIcon className="size-3" />
                                </Button>
                              </div>
                            </div>
                            {part.compatibleEquipmentIds.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {part.compatibleEquipmentIds.map((id) => {
                                  const compEq = equipment.find(
                                    (e) => e.id === id,
                                  );
                                  return compEq ? (
                                    <Badge
                                      key={id}
                                      variant="outline"
                                      className="text-[10px] px-1 py-0 h-4 max-w-25 truncate"
                                    >
                                      {compEq.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Modal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
        title={editingEquipment ? "Edit Equipment" : "Add New Equipment"}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Equipment Name</Label>
            <Input
              value={equipmentForm.name}
              onChange={(e) =>
                setEquipmentForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter equipment name"
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={equipmentForm.categoryId}
              onValueChange={(value) =>
                setEquipmentForm((prev) => ({ ...prev, categoryId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              value={equipmentForm.description}
              onChange={(e) =>
                setEquipmentForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter description"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEquipmentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEquipment}>
              {editingEquipment ? "Update" : "Create"} Equipment
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Manage Categories"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Add New Category</Label>
            <div className="flex gap-2">
              <Input
                value={categoryForm}
                onChange={(e) => setCategoryForm(e.target.value)}
                placeholder="Enter category name"
              />
              <Button onClick={handleCreateCategory}>Add</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Existing Categories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={cat.isCustom ? "default" : "secondary"}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setIsCategoryModalOpen(false)}>Done</Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isPartModalOpen}
        onClose={() => setIsPartModalOpen(false)}
        title={editingPart ? "Edit Part" : "Add New Part"}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Part Name</Label>
            <Input
              value={partForm.name}
              onChange={(e) =>
                setPartForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter part name"
            />
          </div>
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              value={partForm.description}
              onChange={(e) =>
                setPartForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter description"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsPartModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePart}>
              {editingPart ? "Update" : "Create"} Part
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isCompatibilityModalOpen}
        onClose={() => setIsCompatibilityModalOpen(false)}
        title="Manage Compatibility"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select which equipment this part is compatible with:
          </p>
          <div className="border rounded-md max-h-64 overflow-y-auto space-y-2 p-2">
            {equipment
              .filter((eq) => eq.id !== selectedEquipmentForParts?.id)
              .map((eq) => (
                <label
                  key={eq.id}
                  className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted"
                >
                  <Input
                    type="checkbox"
                    checked={
                      selectedPartForCompatibility?.compatibleEquipmentIds.includes(
                        eq.id,
                      ) || false
                    }
                    onChange={() => handleToggleCompatibility(eq.id)}
                    className="rounded"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium block truncate">
                      {eq.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {getCategoryName(eq.categoryId)}
                    </span>
                  </div>
                </label>
              ))}
            {equipment.length <= 1 && (
              <p className="text-sm text-muted-foreground p-2">
                No other equipment available for compatibility.
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={() => setIsCompatibilityModalOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
