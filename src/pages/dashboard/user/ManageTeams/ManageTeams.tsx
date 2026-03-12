import { TeamTiersCard } from "./cards/TeamTiers";
import { RolesCard } from "./cards/Roles";
import { WorkersCard } from "./cards/Workers";
import { DEFAULT_TEAM_TIERS, type TeamTier } from "@/lib/pricing";
import { useState } from "react";
import {
  DEFAULT_ROLES,
  DEFAULT_WORKERS,
  type Role,
  type Worker,
} from "../CalculateWork/types";
import { RoleModal } from "./modals";
import { TeamTierModal } from "./modals";
import { WorkerModal } from "./modals";

// Helper functions for CRUD operations
function createItem<T extends { id: string }>(
  setItems: React.Dispatch<React.SetStateAction<T[]>>,
  item: Omit<T, "id">,
) {
  const newItem = { ...item, id: Date.now().toString() } as T;
  setItems((prev) => [...prev, newItem]);
}

function updateItem<T extends { id: string }>(
  setItems: React.Dispatch<React.SetStateAction<T[]>>,
  id: string,
  updates: Partial<T>,
) {
  setItems((prev) =>
    prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
  );
}

function deleteItem<T extends { id: string }>(
  setItems: React.Dispatch<React.SetStateAction<T[]>>,
  id: string,
  _type: string,
) {
  if (confirm("Are you sure you want to delete this item?")) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }
}

export default function ManageTeams() {
  const [teamTiers, setTeamTiers] = useState<TeamTier[]>(DEFAULT_TEAM_TIERS);
  const [workers, setWorkers] = useState<Worker[]>(DEFAULT_WORKERS);
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);

  // Modal states
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);

  // Editing states
  const [editingTier, setEditingTier] = useState<TeamTier | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  // Tier handlers
  const handleSaveTier = (tierData: Omit<TeamTier, "id">) => {
    if (editingTier) {
      updateItem(setTeamTiers, editingTier.id, tierData);
    } else {
      createItem(setTeamTiers, tierData);
    }
    setEditingTier(null);
    setIsTierModalOpen(false);
  };

  const handleDeleteTier = (id: string) => {
    deleteItem(setTeamTiers, id, "tier");
  };

  const openAddTier = () => {
    setEditingTier(null);
    setIsTierModalOpen(true);
  };

  const openEditTier = (tier: TeamTier) => {
    setEditingTier(tier);
    setIsTierModalOpen(true);
  };

  // Role handlers
  const handleSaveRole = (roleData: Omit<Role, "id">) => {
    if (editingRole) {
      updateItem(setRoles, editingRole.id, roleData);
    } else {
      createItem(setRoles, roleData);
    }
    setEditingRole(null);
    setIsRoleModalOpen(false);
  };

  const handleDeleteRole = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this role? This will also remove it from workers.",
      )
    ) {
      setRoles((prev) => prev.filter((r) => r.id !== id));
      setWorkers((prev) =>
        prev.map((w) => ({
          ...w,
          roleIds: w.roleIds.filter((roleId) => roleId !== id),
        })),
      );
    }
  };

  const openAddRole = () => {
    setEditingRole(null);
    setIsRoleModalOpen(true);
  };

  const openEditRole = (role: Role) => {
    setEditingRole(role);
    setIsRoleModalOpen(true);
  };

  // Worker handlers
  const handleSaveWorker = (workerData: Omit<Worker, "id">) => {
    if (editingWorker) {
      updateItem(setWorkers, editingWorker.id, workerData);
    } else {
      createItem(setWorkers, workerData);
    }
    setEditingWorker(null);
    setIsWorkerModalOpen(false);
  };

  const handleDeleteWorker = (id: string) => {
    deleteItem(setWorkers, id, "worker");
  };

  const openAddWorker = () => {
    setEditingWorker(null);
    setIsWorkerModalOpen(true);
  };

  const openEditWorker = (worker: Worker) => {
    setEditingWorker(worker);
    setIsWorkerModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Teams</h1>
        <p className="text-muted-foreground">
          Manage team roles, workers, and pricing tiers
        </p>
      </div>

      <TeamTiersCard
        tiers={teamTiers}
        onAdd={openAddTier}
        onEdit={openEditTier}
        onDelete={handleDeleteTier}
      />

      <RolesCard
        roles={roles}
        onAdd={openAddRole}
        onEdit={openEditRole}
        onDelete={handleDeleteRole}
      />

      <WorkersCard
        workers={workers}
        roles={roles}
        onAdd={openAddWorker}
        onEdit={openEditWorker}
        onDelete={handleDeleteWorker}
      />

      <TeamTierModal
        isOpen={isTierModalOpen}
        onClose={() => {
          setIsTierModalOpen(false);
          setEditingTier(null);
        }}
        onSave={handleSaveTier}
        tier={editingTier}
      />

      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setEditingRole(null);
        }}
        onSave={handleSaveRole}
        role={editingRole}
      />

      <WorkerModal
        isOpen={isWorkerModalOpen}
        onClose={() => {
          setIsWorkerModalOpen(false);
          setEditingWorker(null);
        }}
        onSave={handleSaveWorker}
        worker={editingWorker}
        roles={roles}
      />
    </div>
  );
}
