import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserMultipleIcon,
  File02Icon,
  Add01Icon,
  PencilEdit01Icon,
  Delete01Icon,
  DollarCircleIcon,
  StarIcon,
  ClockIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ============================================
// TYPES
// ============================================

export interface Plan {
  id: string;
  name: string;
  workersRequired: number;
  requiredRoleIds: string[];
  estimatedCost: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
}

// ============================================
// SAMPLE DATA
// ============================================

const SAMPLE_PLANS: Plan[] = [
  {
    id: "1",
    name: "Wedding Basic",
    workersRequired: 2,
    requiredRoleIds: ["1", "4"],
    estimatedCost: 1500,
  },
  {
    id: "2",
    name: "Wedding Premium",
    workersRequired: 4,
    requiredRoleIds: ["1", "2", "3", "4"],
    estimatedCost: 3500,
  },
  {
    id: "3",
    name: "Corporate Event",
    workersRequired: 3,
    requiredRoleIds: ["1", "2", "5"],
    estimatedCost: 2500,
  },
  {
    id: "4",
    name: "Portrait Session",
    workersRequired: 1,
    requiredRoleIds: ["1"],
    estimatedCost: 500,
  },
  {
    id: "5",
    name: "Full Production",
    workersRequired: 6,
    requiredRoleIds: ["1", "2", "3", "4", "5", "6"],
    estimatedCost: 5000,
  },
];

const SAMPLE_SERVICES: Service[] = [
  {
    id: "1",
    name: "Photo Shooting",
    description: "Professional photo shooting session",
    duration: 60,
    price: 200,
    category: "Photography",
  },
  {
    id: "2",
    name: "Video Recording",
    description: "High-quality video recording service",
    duration: 120,
    price: 500,
    category: "Videography",
  },
  {
    id: "3",
    name: "Photo Editing",
    description: "Professional photo editing and retouching",
    duration: 30,
    price: 50,
    category: "Post-Production",
  },
  {
    id: "4",
    name: "Album Design",
    description: "Custom photo album design service",
    duration: 240,
    price: 300,
    category: "Design",
  },
  {
    id: "5",
    name: "Drone Photography",
    description: "Aerial photography and videography",
    duration: 45,
    price: 250,
    category: "Photography",
  },
];

// ============================================
// PLAN MANAGEMENT COMPONENT
// ============================================

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Omit<Plan, "id">) => void;
  plan?: Plan | null;
}

function PlanModal({ isOpen, onClose, onSave, plan }: PlanModalProps) {
  const [name, setName] = useState(plan?.name || "");
  const [workersRequired, setWorkersRequired] = useState(
    plan?.workersRequired || 1,
  );
  const [requiredRoleIds, setRequiredRoleIds] = useState<string[]>(
    plan?.requiredRoleIds || [],
  );
  const [estimatedCost, setEstimatedCost] = useState(plan?.estimatedCost || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      workersRequired,
      requiredRoleIds,
      estimatedCost,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    if (!plan) {
      setName("");
      setWorkersRequired(1);
      setRequiredRoleIds([]);
      setEstimatedCost(0);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={plan ? "Edit Plan" : "Create New Plan"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="planName">Plan Name</Label>
          <Input
            id="planName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter plan name"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workersRequired">Workers Required</Label>
            <Input
              id="workersRequired"
              type="number"
              min={1}
              value={workersRequired}
              onChange={(e) =>
                setWorkersRequired(parseInt(e.target.value) || 1)
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
            <Input
              id="estimatedCost"
              type="number"
              min={0}
              step={0.01}
              value={estimatedCost}
              onChange={(e) =>
                setEstimatedCost(parseFloat(e.target.value) || 0)
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Note</Label>
          <p className="text-sm text-muted-foreground">
            Role assignments can be managed in the Roles & Workers section.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">{plan ? "Update Plan" : "Create Plan"}</Button>
        </div>
      </form>
    </Modal>
  );
}

// ============================================
// SERVICE MANAGEMENT COMPONENT
// ============================================

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Omit<Service, "id">) => void;
  service?: Service | null;
}

function ServiceModal({ isOpen, onClose, onSave, service }: ServiceModalProps) {
  const [name, setName] = useState(service?.name || "");
  const [description, setDescription] = useState(service?.description || "");
  const [duration, setDuration] = useState(service?.duration || 60);
  const [price, setPrice] = useState(service?.price || 0);
  const [category, setCategory] = useState(service?.category || "Photography");

  const categories = [
    "Photography",
    "Videography",
    "Post-Production",
    "Design",
    "Other",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      duration,
      price,
      category,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    if (!service) {
      setName("");
      setDescription("");
      setDuration(60);
      setPrice(0);
      setCategory("Photography");
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={service ? "Edit Service" : "Create New Service"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="serviceName">Service Name</Label>
          <Input
            id="serviceName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter service name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceDescription">Description</Label>
          <textarea
            id="serviceDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter service description"
            className="w-full min-h-20 p-2 border rounded-md text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step={0.01}
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">
            {service ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function PlansAndServices() {
  // State
  const [plans, setPlans] = useState<Plan[]>(SAMPLE_PLANS);
  const [services, setServices] = useState<Service[]>(SAMPLE_SERVICES);

  // Modal states
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Edit states
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // ============================================
  // PLAN CRUD OPERATIONS
  // ============================================

  const handleCreatePlan = (planData: Omit<Plan, "id">) => {
    const newPlan: Plan = {
      ...planData,
      id: Date.now().toString(),
    };
    setPlans((prev) => [...prev, newPlan]);
  };

  const handleUpdatePlan = (planData: Omit<Plan, "id">) => {
    if (!editingPlan) return;
    setPlans((prev) =>
      prev.map((p) => (p.id === editingPlan.id ? { ...p, ...planData } : p)),
    );
    setEditingPlan(null);
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    }
  };

  const openEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setIsPlanModalOpen(true);
  };

  const closePlanModal = () => {
    setIsPlanModalOpen(false);
    setEditingPlan(null);
  };

  // ============================================
  // SERVICE CRUD OPERATIONS
  // ============================================

  const handleCreateService = (serviceData: Omit<Service, "id">) => {
    const newService: Service = {
      ...serviceData,
      id: Date.now().toString(),
    };
    setServices((prev) => [...prev, newService]);
  };

  const handleUpdateService = (serviceData: Omit<Service, "id">) => {
    if (!editingService) return;
    setServices((prev) =>
      prev.map((s) =>
        s.id === editingService.id ? { ...s, ...serviceData } : s,
      ),
    );
    setEditingService(null);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
    }
  };

  const openEditService = (service: Service) => {
    setEditingService(service);
    setIsServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setEditingService(null);
  };

  // ============================================
  // TABLE COLUMNS
  // ============================================

  const planColumns: ColumnDef<Plan>[] = [
    {
      accessorKey: "name",
      header: "Plan Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "workersRequired",
      header: "Workers Required",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={UserMultipleIcon}
            className="size-4 text-muted-foreground"
          />
          <span>{row.original.workersRequired}</span>
        </div>
      ),
    },
    {
      accessorKey: "estimatedCost",
      header: "Estimated Cost",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={DollarCircleIcon}
            className="size-4 text-green-600"
          />
          <span className="font-medium">
            ${row.original.estimatedCost.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => openEditPlan(row.original)}
            title="Edit"
          >
            <HugeiconsIcon icon={PencilEdit01Icon} className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleDeletePlan(row.original.id)}
            title="Delete"
            className="text-destructive hover:text-destructive"
          >
            <HugeiconsIcon icon={Delete01Icon} className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const serviceColumns: ColumnDef<Service>[] = [
    {
      accessorKey: "name",
      header: "Service Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground line-clamp-1">
          {row.original.description}
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.category}</Badge>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={ClockIcon}
            className="size-4 text-muted-foreground"
          />
          <span>{row.original.duration} min</span>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={DollarCircleIcon}
            className="size-4 text-green-600"
          />
          <span className="font-medium">
            ${row.original.price.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => openEditService(row.original)}
            title="Edit"
          >
            <HugeiconsIcon icon={PencilEdit01Icon} className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleDeleteService(row.original.id)}
            title="Delete"
            className="text-destructive hover:text-destructive"
          >
            <HugeiconsIcon icon={Delete01Icon} className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Plans & Services Management
          </h1>
          <p className="text-muted-foreground">
            Manage your service plans and individual services for your
            photography business
          </p>
        </div>
      </div>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <HugeiconsIcon icon={File02Icon} className="size-4" />
            Plans
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {plans.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <HugeiconsIcon icon={StarIcon} className="size-4" />
            Services
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {services.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* PLANS TAB */}
        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold">
                Plan Management
              </CardTitle>
              <Button
                onClick={() => setIsPlanModalOpen(true)}
                className="flex items-center gap-2"
              >
                <HugeiconsIcon icon={Add01Icon} className="size-4" />
                Create New Plan
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={planColumns}
                data={plans}
                searchable
                searchColumn="name"
                searchPlaceholder="Search plans..."
                pageSize={10}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* SERVICES TAB */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold">
                Service Management
              </CardTitle>
              <Button
                onClick={() => setIsServiceModalOpen(true)}
                className="flex items-center gap-2"
              >
                <HugeiconsIcon icon={Add01Icon} className="size-4" />
                Create New Service
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={serviceColumns}
                data={services}
                searchable
                searchColumn="name"
                searchPlaceholder="Search services..."
                pageSize={10}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MODALS */}
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={closePlanModal}
        onSave={editingPlan ? handleUpdatePlan : handleCreatePlan}
        plan={editingPlan}
      />

      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={closeServiceModal}
        onSave={editingService ? handleUpdateService : handleCreateService}
        service={editingService}
      />
    </div>
  );
}
