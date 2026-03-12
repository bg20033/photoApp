import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { Client } from "./types";
import { uid } from "./types";
import CreateClientModal from "./CreateClients";
import EditClientModal from "./EditClients";
import DeleteClientModal from "./DeleteClients";
import { formatDate } from "@/lib/utils";

async function apiFetchClients(): Promise<Client[]> {
  try {
    const res = await fetch("/api/user/clients");
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    return data as Client[];
  } catch {
    return [
      {
        id: uid("c_"),
        name: "Acme Corporation",
        email: "contact@acme.com",
        company: "Acme Corp",
        phone: "+1 555-0123",
        createdAt: new Date().toISOString(),
      },
      {
        id: uid("c_"),
        name: "Global Industries",
        email: "info@globalind.com",
        company: "Global Industries Ltd",
        phone: "+1 555-0456",
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

export default function UserManageClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

 useEffect(() => {
   let isMounted = true;

   async function loadClients() {
     setLoading(true);
     try {
       const data = await apiFetchClients();
       if (isMounted) {
         setClients(data);
       }
     } catch (error) {
       console.error("Failed to load clients", error);
     } finally {
       if (isMounted) setLoading(false);
     }
   }

   loadClients();

   return () => {
     isMounted = false; 
   };
 }, []);

  
  function handleCreateSave(created: Client) {
    setClients((prev) => [created, ...prev]);
    setCreateModalOpen(false);
  }

  function handleEditSave(updated: Client) {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditingClient(null);
  }

  function handleDeleteConfirm() {
    if (deletingClient) {
      setClients((prev) => prev.filter((c) => c.id !== deletingClient.id));
      setDeletingClient(null);
    }
  }

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: "Client",
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium truncate">{client.name}</span>
            <span className="text-sm text-muted-foreground truncate">
              {client.email}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex items-center justify-end sm:justify-start gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setEditingClient(client);
              }}
            >
              <Edit size={14} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/5 px-2.5 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setDeletingClient(client);
              }}
            >
              <Trash2 size={14} />
            </motion.button>
          </div>
        );
      },
    },
  ];

  const renderClientDetails = ({ row: client }: { row: Client }) => (
    <div className="bg-background rounded-lg border p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div className="space-y-4">
          <h4 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
            Client Details
          </h4>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-2 border-b border-dashed">
              <span className="text-muted-foreground">Client ID</span>
              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                {client.id}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-2 border-b border-dashed">
              <span className="text-muted-foreground">Full Name</span>
              <span className="font-medium">{client.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-2 border-b border-dashed">
              <span className="text-muted-foreground">Email</span>
              <span className="break-all">{client.email}</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
            Company Info
          </h4>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-2 border-b border-dashed">
              <span className="text-muted-foreground">Company</span>
              <span className="font-medium">{client.company}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-2 border-b border-dashed">
              <span className="text-muted-foreground">Phone</span>
              <span>{client.phone || "-"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-2 border-b border-dashed">
              <span className="text-muted-foreground">Created</span>
              <span>
                {client.createdAt
                  ? formatDate(client.createdAt)
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-400 mx-auto flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-400 mx-auto">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Manage Clients</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground font-medium hover:opacity-90 whitespace-nowrap"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus size={18} />
          New client
        </motion.button>
      </header>

      <DataTable
        columns={columns}
        data={clients ?? []} 
        getRowId={(row) => row.id}
        enableExpanding
        expandedRowId={expandedRow}
        onExpandedChange={setExpandedRow}
        renderSubComponent={renderClientDetails}
        searchable
        searchColumn="name"
        searchPlaceholder="Search clients..."
        pageSize={10}
      />

      <CreateClientModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateSave}
      />

      <EditClientModal
        isOpen={!!editingClient}
        client={editingClient}
        onClose={() => setEditingClient(null)}
        onSave={handleEditSave}
      />

      <DeleteClientModal
        isOpen={!!deletingClient}
        client={deletingClient}
        onClose={() => setDeletingClient(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

