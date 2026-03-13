import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { User } from "./types";
import { uid } from "./types";
import CreateUserModal from "./CreateUsers";
import EditUserModal from "./EditUsers";
import DeleteUserModal from "./DeleteUsers";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function UserDetails({ user }: { user: User }) {
  return (
    <div className="bg-background rounded-lg border p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
        <div className="space-y-6">
          <h4 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
            User Details
          </h4>
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-3 border-b border-dashed">
              <span className="text-muted-foreground">User ID</span>
              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                {user.id}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-3 border-b border-dashed">
              <span className="text-muted-foreground">Full Name</span>
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-3 border-b border-dashed">
              <span className="text-muted-foreground">Email</span>
              <span className="break-all">{user.email}</span>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
            Account Info
          </h4>
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-3 border-b border-dashed">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium capitalize">{user.role}</span>
            </div>
            {user.createdAt && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-3 border-b border-dashed">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDate(user.createdAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

async function apiFetchUsers(): Promise<User[]> {
  try {
    const res = await fetch("/api/admin/users");
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    return data as User[];
  } catch (_err) {
    return [
      {
        id: uid("u_"),
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
      {
        id: uid("u_"),
        name: "Bob Smith",
        email: "bob@example.com",
        role: "user",
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

export default function AdminManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      setLoading(true);
      const data = await apiFetchUsers();
      if (isMounted) {
        setUsers(data);
        setLoading(false);
      }
    };
    loadUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium truncate">{row.original.name}</span>
            <span className="text-sm text-muted-foreground truncate">
              {row.original.email}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground capitalize">
            {row.getValue("role")}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right sm:text-left">Actions</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end sm:justify-start gap-1">
            <button
              className="p-2 hover:bg-accent rounded-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setEditingUser(row.original);
              }}
            >
              <Edit size={14} />
            </button>
            <button
              className="p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setDeletingUser(row.original);
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-400 mx-auto">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-semibold">Manage Users</h1>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={18} /> New user
        </Button>
      </header>
      <DataTable
        columns={columns}
        data={users}
        getRowId={(row: User) => row.id}
        enableExpanding
        expandedRowId={expandedRow}
        onExpandedChange={setExpandedRow}
        renderSubComponent={({ row }) => <UserDetails user={row} />}
        searchable
        searchColumn="name"
      />
      <CreateUserModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={(u) => {
          setUsers([u, ...users]);
          setCreateModalOpen(false);
        }}
      />
      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={(u) => {
          setUsers(users.map((prev) => (prev.id === u.id ? u : prev)));
          setEditingUser(null);
        }}
      />
      <DeleteUserModal
        isOpen={!!deletingUser}
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={() => {
          setUsers(users.filter((u) => u.id !== deletingUser?.id));
          setDeletingUser(null);
        }}
      />
    </div>
  );
}
