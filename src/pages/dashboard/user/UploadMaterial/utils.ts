import { type StorageData } from "./types";

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getStatusBadge(status: StorageData["status"]) {
  switch (status) {
    case "active":
      return { variant: "success", label: "Active" };
    case "expiring-soon":
      return { variant: "outline", label: "Expiring Soon" };
    case "expired":
      return { variant: "destructive", label: "Expired" };
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(7);
}
