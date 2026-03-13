import { useState, useCallback } from "react";
import { Upload, FolderPlus, Video, Image, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Select as UserSelect,
  SelectContent as UserSelectContent,
  SelectItem as UserSelectItem,
  SelectTrigger as UserSelectTrigger,
  SelectValue as UserSelectValue,
} from "@/components/ui/select";
import { type Folder, type UploadedFile, type User } from "./types";
import { formatFileSize, generateId } from "./utils";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  selectedUserId?: string;
  onUpload: (
    files: UploadedFile[],
    folderId: string | null,
    userId: string,
  ) => void;
}

export default function UploadModal({
  isOpen,
  onClose,
  users,
  selectedUserId,
  onUpload,
}: UploadModalProps) {
  const [currentTab, setCurrentTab] = useState("photos");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedExpiration, setSelectedExpiration] = useState<string>("30");
  const [videoLabel, setVideoLabel] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>(
    selectedUserId || "",
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const newFiles: UploadedFile[] = files.map((file) => ({
        id: generateId(),
        name: file.name,
        type: file.type.startsWith("video/") ? "video" : "image",
        size: file.size,
        uploadedAt: new Date().toISOString(),
        ...(currentTab === "videos" && videoLabel ? { label: videoLabel } : {}),
      }));

      if (newFiles.length > 0) {
        onUpload(newFiles, currentFolder?.id || null, selectedUser);
      }

      if (currentTab === "videos") {
        setVideoLabel("");
      }
    },
    [currentFolder, currentTab, videoLabel, onUpload, selectedUser],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles: UploadedFile[] = files.map((file) => ({
        id: generateId(),
        name: file.name,
        type: file.type.startsWith("video/") ? "video" : "image",
        size: file.size,
        uploadedAt: new Date().toISOString(),
        ...(currentTab === "videos" && videoLabel ? { label: videoLabel } : {}),
      }));

      if (newFiles.length > 0) {
        onUpload(newFiles, currentFolder?.id || null, selectedUser);
      }

      if (currentTab === "videos") {
        setVideoLabel("");
      }
    }
  };

  const createFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: generateId(),
        name: newFolderName.trim(),
        files: [],
        createdAt: new Date().toISOString(),
        expiration:
          currentTab === "videos" ? undefined : parseInt(selectedExpiration),
        type: currentTab === "videos" ? "video" : "photo",
      };
      setFolders((prev) => [...prev, newFolder]);
      setNewFolderName("");
      if (currentTab !== "videos") setSelectedExpiration("30");
    }
  };

  const deleteFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    if (currentFolder?.id === folderId) {
      setCurrentFolder(null);
    }
  };

  const startEditingFolder = (folder: Folder) => {
    setEditingFolder(folder);
  };

  const saveFolderName = () => {
    if (editingFolder) {
      setFolders((prev) =>
        prev.map((f) =>
          f.id === editingFolder.id ? { ...f, name: editingFolder.name } : f,
        ),
      );
      setEditingFolder(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Materials">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Select User</Label>
          <UserSelect value={selectedUser} onValueChange={setSelectedUser}>
            <UserSelectTrigger>
              <UserSelectValue placeholder="Select a user" />
            </UserSelectTrigger>
            <UserSelectContent>
              {users.map((user) => (
                <UserSelectItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </UserSelectItem>
              ))}
            </UserSelectContent>
          </UserSelect>
        </div>

        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Video project name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={createFolder}>
                  <Video className="h-4 w-4 mr-1" />
                  Create Video Project
                </Button>
              </div>

              {currentFolder && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentFolder(null)}
                >
                  Back to Projects
                </Button>
              )}

              {currentFolder ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-muted-foreground/25"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
                    Drag and drop videos here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse
                  </p>
                  <Input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    id="video-upload"
                    onChange={handleFileInput}
                  />
                  <Label
                    htmlFor="video-upload"
                    className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    Browse Videos
                  </Label>
                </div>
              ) : null}

              <div className="max-h-64 overflow-y-auto">
                {currentFolder ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentFolder.files.map((file) => (
                      <div
                        key={file.id}
                        className="border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2">
                          {file.type === "video" ? (
                            <Video className="h-8 w-8 text-muted-foreground" />
                          ) : (
                            <Image className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                        {file.label && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {file.label}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {folders
                      .filter((f) => f.type === "video" || f.name === "Videos")
                      .map((folder) => (
                        <div key={folder.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div
                              className="flex items-center gap-2 cursor-pointer flex-1"
                              onClick={() => setCurrentFolder(folder)}
                            >
                              <Video className="h-5 w-5" />
                              {editingFolder?.id === folder.id ? (
                                <Input
                                  value={editingFolder.name}
                                  onChange={(e) =>
                                    setEditingFolder({
                                      ...editingFolder,
                                      name: e.target.value,
                                    })
                                  }
                                  onBlur={saveFolderName}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveFolderName();
                                    if (e.key === "Escape")
                                      setEditingFolder(null);
                                  }}
                                  className="flex-1"
                                  autoFocus
                                />
                              ) : (
                                <span className="font-medium">
                                  {folder.name}
                                </span>
                              )}
                              <Badge variant="secondary">
                                {folder.files.length}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditingFolder(folder);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteFolder(folder.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    {folders.filter(
                      (f) => f.type === "video" || f.name === "Videos",
                    ).length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No video projects yet. Create a project to get started.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="New folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={createFolder}>
                  <FolderPlus className="h-4 w-4 mr-1" />
                  Create Folder
                </Button>
              </div>

              {currentFolder && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentFolder(null)}
                >
                  Back to Folders
                </Button>
              )}

              {currentFolder ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-muted-foreground/25"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
                    Drag and drop photos here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                    onChange={handleFileInput}
                  />
                  <Label
                    htmlFor="photo-upload"
                    className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    Browse Photos
                  </Label>
                </div>
              ) : null}

              <div className="max-h-64 overflow-y-auto">
                {currentFolder ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentFolder.files.map((file) => (
                      <div
                        key={file.id}
                        className="border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2">
                          {file.type === "video" ? (
                            <Video className="h-8 w-8 text-muted-foreground" />
                          ) : (
                            <Image className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                        {file.label && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {file.label}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {folders
                      .filter(
                        (f) =>
                          f.type === "photo" ||
                          (!f.type && f.name !== "Videos"),
                      )
                      .map((folder) => (
                        <div key={folder.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div
                              className="flex items-center gap-2 cursor-pointer flex-1"
                              onClick={() => setCurrentFolder(folder)}
                            >
                              <FolderPlus className="h-5 w-5" />
                              {editingFolder?.id === folder.id ? (
                                <Input
                                  value={editingFolder.name}
                                  onChange={(e) =>
                                    setEditingFolder({
                                      ...editingFolder,
                                      name: e.target.value,
                                    })
                                  }
                                  onBlur={saveFolderName}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveFolderName();
                                    if (e.key === "Escape")
                                      setEditingFolder(null);
                                  }}
                                  className="flex-1"
                                  autoFocus
                                />
                              ) : (
                                <span className="font-medium">
                                  {folder.name}
                                </span>
                              )}
                              <Badge variant="secondary">
                                {folder.files.length}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditingFolder(folder);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteFolder(folder.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    {folders.filter(
                      (f) =>
                        f.type === "photo" || (!f.type && f.name !== "Videos"),
                    ).length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No photo folders yet. Create a folder to get started.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Select
            value={selectedExpiration}
            onValueChange={setSelectedExpiration}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">1 week</SelectItem>
              <SelectItem value="14">2 weeks</SelectItem>
              <SelectItem value="30">1 month</SelectItem>
              <SelectItem value="180">6 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </Modal>
  );
}
