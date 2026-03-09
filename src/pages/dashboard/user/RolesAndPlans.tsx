import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Camera01Icon,
  WrenchIcon,
  TruckIcon,
  ClipboardIcon,
  StarIcon,
  FavouriteIcon,
  ShieldUserIcon,
  ZapIcon,
  Award01Icon,
  Add01Icon,
  PencilEdit01Icon,
  Delete01Icon,
  UserMultipleIcon,
  File02Icon,
  Settings01Icon,
  DollarCircleIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { DataTable } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ============================================
// TYPES
// ============================================

export type IconType =
  | "User"
  | "Camera"
  | "Wrench"
  | "Truck"
  | "Clipboard"
  | "Star"
  | "Heart"
  | "Shield"
  | "Zap"
  | "Award";

export interface Role {
  id: string;
  name: string;
  icon: IconType;
}

export interface Worker {
  id: string;
  name: string;
  roleIds: string[];
}

export interface Plan {
  id: string;
  name: string;
  workersRequired: number;
  requiredRoleIds: string[];
  estimatedCost: number;
}

// ============================================
// ICON CONFIGURATION
// ============================================

const ICON_OPTIONS: {
  value: IconType;
  label: string;
  icon: typeof UserIcon;
}[] = [
  { value: "User", label: "User", icon: UserIcon },
  { value: "Camera", label: "Camera", icon: Camera01Icon },
  { value: "Wrench", label: "Wrench", icon: WrenchIcon },
  { value: "Truck", label: "Truck", icon: TruckIcon },
  { value: "Clipboard", label: "Clipboard", icon: ClipboardIcon },
  { value: "Star", label: "Star", icon: StarIcon },
  { value: "Heart", label: "Heart", icon: FavouriteIcon },
  { value: "Shield", label: "Shield", icon: ShieldUserIcon },
  { value: "Zap", label: "Zap", icon: ZapIcon },
  { value: "Award", label: "Award", icon: Award01Icon },
];

const getIconComponent = (iconType: IconType) => {
  const iconOption = ICON_OPTIONS.find((opt) => opt.value === iconType);
  return iconOption?.icon || UserIcon;
};

// ============================================
// SAMPLE DATA
// ============================================

const SAMPLE_ROLES: Role[] = [
  { id: "1", name: "Photographer", icon: "Camera" },
  { id: "2", name: "Videographer", icon: "Camera" },
  { id: "3", name: "Editor", icon: "Clipboard" },
  { id: "4", name: "Assistant", icon: "User" },
  { id: "5", name: "Driver", icon: "Truck" },
  { id: "6", name: "Technician", icon: "Wrench" },
];

const SAMPLE_WORKERS: Worker[] = [
  { id: "1", name: "John Smith", roleIds: ["1", "2"] },
  { id: "2", name: "Sarah Johnson", roleIds: ["3"] },
  { id: "3", name: "Mike Brown", roleIds: ["4", "5"] },
  { id: "4", name: "Emily Davis", roleIds: ["1", "3"] },
  { id: "5", name: "Chris Wilson", roleIds: ["6", "2"] },
];

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

// ============================================
// ROLE MANAGEMENT COMPONENT
// ============================================

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Omit<Role, "id">) => void;
  role?: Role | null;
}

function RoleModal({ isOpen, onClose, onSave, role }: RoleModalProps) {
  const [name, setName] = useState(role?.name || "");
  const [selectedIcon, setSelectedIcon] = useState<IconType>(
    role?.icon || "User",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), icon: selectedIcon });
    setName("");
    setSelectedIcon("User");
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

// ============================================
// WORKER MANAGEMENT COMPONENT
// ============================================

interface WorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (worker: Omit<Worker, "id">) => void;
  worker?: Worker | null;
  roles: Role[];
}

function WorkerModal({
  isOpen,
  onClose,
  onSave,
  worker,
  roles,
}: WorkerModalProps) {
  const [name, setName] = useState(worker?.name || "");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    worker?.roleIds || [],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), roleIds: selectedRoles });
    setName("");
    setSelectedRoles([]);
    onClose();
  };

  const handleClose = () => {
    if (!worker) {
      setName("");
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

// ============================================
// PLAN MANAGEMENT COMPONENT
// ============================================

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Omit<Plan, "id">) => void;
  plan?: Plan | null;
  roles: Role[];
}

function PlanModal({ isOpen, onClose, onSave, plan, roles }: PlanModalProps) {
  const [name, setName] = useState(plan?.name || "");
  const [workersRequired, setWorkersRequired] = useState(
    plan?.workersRequired || 1,
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    plan?.requiredRoleIds || [],
  );
  const [estimatedCost, setEstimatedCost] = useState(plan?.estimatedCost || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      workersRequired,
      requiredRoleIds: selectedRoles,
      estimatedCost,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    if (!plan) {
      setName("");
      setWorkersRequired(1);
      setSelectedRoles([]);
      setEstimatedCost(0);
    }
  };

  const handleClose = () => {
    resetForm();
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
          <Label>Required Skills/Roles</Label>
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
              required
            </p>
          )}
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
// MAIN COMPONENT
// ============================================

export default function RolesAndPlans() {
  // State
  const [roles, setRoles] = useState<Role[]>(SAMPLE_ROLES);
  const [workers, setWorkers] = useState<Worker[]>(SAMPLE_WORKERS);
  const [plans, setPlans] = useState<Plan[]>(SAMPLE_PLANS);

  // Modal states
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // Edit states
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // ============================================
  // ROLE CRUD OPERATIONS
  // ============================================

  const handleCreateRole = (roleData: Omit<Role, "id">) => {
    const newRole: Role = {
      ...roleData,
      id: Date.now().toString(),
    };
    setRoles((prev) => [...prev, newRole]);
  };

  const handleUpdateRole = (roleData: Omit<Role, "id">) => {
    if (!editingRole) return;
    setRoles((prev) =>
      prev.map((r) => (r.id === editingRole.id ? { ...r, ...roleData } : r)),
    );
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this role? This will also remove it from workers and plans.",
      )
    ) {
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
      // Remove role from workers
      setWorkers((prev) =>
        prev.map((w) => ({
          ...w,
          roleIds: w.roleIds.filter((id) => id !== roleId),
        })),
      );
      // Remove role from plans
      setPlans((prev) =>
        prev.map((p) => ({
          ...p,
          requiredRoleIds: p.requiredRoleIds.filter((id) => id !== roleId),
        })),
      );
    }
  };

  const openEditRole = (role: Role) => {
    setEditingRole(role);
    setIsRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    setIsRoleModalOpen(false);
    setEditingRole(null);
  };

  // ============================================
  // WORKER CRUD OPERATIONS
  // ============================================

  const handleCreateWorker = (workerData: Omit<Worker, "id">) => {
    const newWorker: Worker = {
      ...workerData,
      id: Date.now().toString(),
    };
    setWorkers((prev) => [...prev, newWorker]);
  };

  const handleUpdateWorker = (workerData: Omit<Worker, "id">) => {
    if (!editingWorker) return;
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === editingWorker.id ? { ...w, ...workerData } : w,
      ),
    );
    setEditingWorker(null);
  };

  const handleDeleteWorker = (workerId: string) => {
    if (confirm("Are you sure you want to delete this worker?")) {
      setWorkers((prev) => prev.filter((w) => w.id !== workerId));
    }
  };

  const openEditWorker = (worker: Worker) => {
    setEditingWorker(worker);
    setIsWorkerModalOpen(true);
  };

  const closeWorkerModal = () => {
    setIsWorkerModalOpen(false);
    setEditingWorker(null);
  };

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
  // TABLE COLUMNS
  // ============================================

  const roleColumns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "Role Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => {
        const Icon = getIconComponent(row.original.icon);
        return (
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Icon} className="size-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              {row.original.icon}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => openEditRole(row.original)}
            title="Edit"
          >
            <HugeiconsIcon icon={PencilEdit01Icon} className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleDeleteRole(row.original.id)}
            title="Delete"
            className="text-destructive hover:text-destructive"
          >
            <HugeiconsIcon icon={Delete01Icon} className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const workerColumns: ColumnDef<Worker>[] = [
    {
      accessorKey: "name",
      header: "Worker Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "roleIds",
      header: "Assigned Roles",
      cell: ({ row }) => {
        const workerRoles = roles.filter((r) =>
          row.original.roleIds.includes(r.id),
        );
        if (workerRoles.length === 0) {
          return (
            <span className="text-sm text-muted-foreground">
              No roles assigned
            </span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1">
            {workerRoles.map((role) => {
              const Icon = getIconComponent(role.icon);
              return (
                <Badge
                  key={role.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <HugeiconsIcon icon={Icon} className="size-3" />
                  {role.name}
                </Badge>
              );
            })}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => openEditWorker(row.original)}
            title="Edit"
          >
            <HugeiconsIcon icon={PencilEdit01Icon} className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => handleDeleteWorker(row.original.id)}
            title="Delete"
            className="text-destructive hover:text-destructive"
          >
            <HugeiconsIcon icon={Delete01Icon} className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

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
      accessorKey: "requiredRoleIds",
      header: "Required Skills",
      cell: ({ row }) => {
        const planRoles = roles.filter((r) =>
          row.original.requiredRoleIds.includes(r.id),
        );
        if (planRoles.length === 0) {
          return (
            <span className="text-sm text-muted-foreground">
              No skills specified
            </span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {planRoles.map((role) => {
              const Icon = getIconComponent(role.icon);
              return (
                <Badge
                  key={role.id}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <HugeiconsIcon icon={Icon} className="size-3" />
                  {role.name}
                </Badge>
              );
            })}
          </div>
        );
      },
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

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Workforce & Planning Management
          </h1>
          <p className="text-muted-foreground">
            Manage roles, workers, and service plans for your photography
            business
          </p>
        </div>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <HugeiconsIcon icon={Settings01Icon} className="size-4" />
            Roles
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {roles.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="workers" className="flex items-center gap-2">
            <HugeiconsIcon icon={UserMultipleIcon} className="size-4" />
            Workers
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {workers.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <HugeiconsIcon icon={File02Icon} className="size-4" />
            Plans
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
              {plans.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* ROLES TAB */}
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold">
                Role Management
              </CardTitle>
              <Button
                onClick={() => setIsRoleModalOpen(true)}
                className="flex items-center gap-2"
              >
                <HugeiconsIcon icon={Add01Icon} className="size-4" />
                Create New Role
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={roleColumns}
                data={roles}
                searchable
                searchColumn="name"
                searchPlaceholder="Search roles..."
                pageSize={10}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* WORKERS TAB */}
        <TabsContent value="workers" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold">
                Worker Management
              </CardTitle>
              <Button
                onClick={() => setIsWorkerModalOpen(true)}
                className="flex items-center gap-2"
              >
                <HugeiconsIcon icon={Add01Icon} className="size-4" />
                Create New Worker
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={workerColumns}
                data={workers}
                searchable
                searchColumn="name"
                searchPlaceholder="Search workers..."
                pageSize={10}
              />
            </CardContent>
          </Card>
        </TabsContent>

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
      </Tabs>

      {/* MODALS */}
      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={closeRoleModal}
        onSave={editingRole ? handleUpdateRole : handleCreateRole}
        role={editingRole}
      />

      <WorkerModal
        isOpen={isWorkerModalOpen}
        onClose={closeWorkerModal}
        onSave={editingWorker ? handleUpdateWorker : handleCreateWorker}
        worker={editingWorker}
        roles={roles}
      />

      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={closePlanModal}
        onSave={editingPlan ? handleUpdatePlan : handleCreatePlan}
        plan={editingPlan}
        roles={roles}
      />
    </div>
  );
}
