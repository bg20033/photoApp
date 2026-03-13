import { useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Upload, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  type StorageData,
  type User,
  type UploadedFile,
  type Folder,
} from "./types";
import { fetchStorageData, fetchUsers } from "./api";
import { getStatusBadge } from "./utils";
import UploadModal from "./UploadModal";
import { EditModal } from "./EditModal";

export default function UploadMaterialPage() {
  const [storageData, setStorageData] = useState<StorageData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFolders, setEditFolders] = useState<Folder[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<StorageData | null>(
    null,
  );

  const totalUsed = storageData.reduce((sum, s) => sum + s.usedGB, 0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [storage, usersData] = await Promise.all([
          fetchStorageData(),
          fetchUsers(),
        ]);
        setStorageData(storage);
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleEdit = (storage: StorageData) => {
    setSelectedStorage(storage);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (updatedStorage: StorageData) => {
    setStorageData((prev) =>
      prev.map((s) => (s.id === updatedStorage.id ? updatedStorage : s)),
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this storage allocation?")) {
      setStorageData((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleUpload = (
    files: UploadedFile[],
    folderId: string | null,
    userId: string,
  ) => {
    // Here you would typically send the files to your backend
    console.log("Uploading files:", { files, folderId, userId });
    // You might want to update the storage data or show a success message
  };

  const columns: ColumnDef<StorageData>[] = [
    {
      accessorKey: "userName",
      header: "User",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.userName}</p>
          <p className="text-sm text-muted-foreground">
            {row.original.userEmail}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "totalGB",
      header: "Total Storage",
      cell: ({ row }) => <span>{row.original.totalGB} GB</span>,
    },
    {
      accessorKey: "usedGB",
      header: "Used",
      cell: ({ row }) => (
        <div className="w-32">
          <div className="flex justify-between text-sm mb-1">
            <span>{row.original.usedGB} GB</span>
            <span className="text-muted-foreground">
              {Math.round((row.original.usedGB / row.original.totalGB) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{
                width: `${(row.original.usedGB / row.original.totalGB) * 100}%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      accessorKey: "remainingGB",
      header: "Remaining",
      cell: ({ row }) => <span>{row.original.remainingGB} GB</span>,
    },
    {
      accessorKey: "expirationDate",
      header: "Expires",
      cell: ({ row }) => (
        <span>
          {new Date(row.original.expirationDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = getStatusBadge(row.original.status);
        return <Badge variant={status.variant as any}>{status.label}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Upload Material</h1>
          <p className="text-muted-foreground">
            Manage client storage and upload materials
          </p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Materials
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Storage Overview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total Uploaded: {totalUsed} GB
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Loading storage data...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={storageData}
              searchable
              searchColumn="userName"
              searchPlaceholder="Search users..."
              pageSize={10}
            />
          )}
        </CardContent>
      </Card>

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        users={users}
        onUpload={handleUpload}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        folders={editFolders}
        onFoldersChange={setEditFolders}
        users={users}
        selectedUser={selectedStorage}
      />
    </div>
  );
}
