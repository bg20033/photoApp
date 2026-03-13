export interface StorageData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  totalGB: number;
  usedGB: number;
  remainingGB: number;
  expirationDate: string;
  status: "active" | "expired" | "expiring-soon";
}

export interface Folder {
  id: string;
  name: string;
  files: UploadedFile[];
  createdAt: string;
  expiration?: number; // in days
  type?: "photo" | "video";
}

export interface UploadedFile {
  id: string;
  name: string;
  type: "video" | "image";
  size: number;
  label?: string;
  url?: string;
  uploadedAt: string;
}

export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export interface FileDetailsModalProps {
  file: UploadedFile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: UploadedFile) => void;
}
export interface User {
  id: string;
  name: string;
  email: string;
}