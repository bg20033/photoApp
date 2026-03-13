import { useState, useCallback } from "react";
import { Upload, FolderPlus, Video, Image, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Folder, type UploadedFile, type User } from "./types";
import { formatFileSize, generateId } from "./utils";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  onFoldersChange: (folders: Folder[]) => void;
  users: User[];
  selectedUser?: any;
}

export function EditModal({
  isOpen,
  onClose,
  folders: initialFolders,
  onFoldersChange,
}: EditModalProps) {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [currentTab, setCurrentTab] = useState("photos");

  const createFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: generateId(),
        name: newFolderName.trim(),
        files: [],
        createdAt: new Date().toISOString(),
        type: currentTab === "videos" ? "video" : "photo",
      };
      const updatedFolders = [...folders, newFolder];
      setFolders(updatedFolders);
      onFoldersChange(updatedFolders);
      setNewFolderName("");
    }
  };

  const deleteFolder = (folderId: string) => {
    const updatedFolders = folders.filter((f) => f.id !== folderId);
    setFolders(updatedFolders);
    onFoldersChange(updatedFolders);
    if (currentFolder?.id === folderId) {
      setCurrentFolder(null);
    }
  };

  const startEditingFolder = (folder: Folder) => {
    setEditingFolder(folder);
  };

  const saveFolderName = () => {
    if (editingFolder) {
      const updatedFolders = folders.map((f) =>
        f.id === editingFolder.id ? { ...f, name: editingFolder.name } : f,
      );
      setFolders(updatedFolders);
      onFoldersChange(updatedFolders);
      setEditingFolder(null);
    }
  };

  const deleteFile = (fileId: string) => {
    if (!currentFolder) return;
    const updatedFolder = {
      ...currentFolder,
      files: currentFolder.files.filter((f) => f.id !== fileId),
    };
    const updatedFolders = folders.map((f) =>
      f.id === currentFolder.id ? updatedFolder : f,
    );
    setFolders(updatedFolders);
    setCurrentFolder(updatedFolder);
    onFoldersChange(updatedFolders);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!currentFolder) return;

      const files = Array.from(e.dataTransfer.files);
      const newFiles: UploadedFile[] = files.map((file) => ({
        id: generateId(),
        name: file.name,
        type: file.type.startsWith("video/") ? "video" : "image",
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }));

      const updatedFolder = {
        ...currentFolder,
        files: [...currentFolder.files, ...newFiles],
      };
      const updatedFolders = folders.map((f) =>
        f.id === currentFolder.id ? updatedFolder : f,
      );
      setFolders(updatedFolders);
      setCurrentFolder(updatedFolder);
      onFoldersChange(updatedFolders);
    },
    [currentFolder, folders, onFoldersChange],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentFolder || !e.target.files) return;

    const files = Array.from(e.target.files);
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: generateId(),
      name: file.name,
      type: file.type.startsWith("video/") ? "video" : "image",
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }));

    const updatedFolder = {
      ...currentFolder,
      files: [...currentFolder.files, ...newFiles],
    };
    const updatedFolders = folders.map((f) =>
      f.id === currentFolder.id ? updatedFolder : f,
    );
    setFolders(updatedFolders);
    setCurrentFolder(updatedFolder);
    onFoldersChange(updatedFolders);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Uploaded Materials">
      <div className="space-y-4">
        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="New video project name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={createFolder}>
                  <Video className="h-4 w-4 mr-1" />
                  Create Project
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
                  className="border-2 border-dashed rounded-lg p-8 text-center transition-colors border-muted-foreground/25"
                  onDragOver={handleDragOver}
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
                    id="edit-video-upload"
                    onChange={handleFileInput}
                  />
                  <Label
                    htmlFor="edit-video-upload"
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
                        className="border rounded-lg p-3 relative group"
                      >
                        <button
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-destructive text-destructive-foreground rounded-full p-1"
                          onClick={() => deleteFile(file.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
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
                  className="border-2 border-dashed rounded-lg p-8 text-center transition-colors border-muted-foreground/25"
                  onDragOver={handleDragOver}
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
                    id="edit-photo-upload"
                    onChange={handleFileInput}
                  />
                  <Label
                    htmlFor="edit-photo-upload"
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
                        className="border rounded-lg p-3 relative group"
                      >
                        <button
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-destructive text-destructive-foreground rounded-full p-1"
                          onClick={() => deleteFile(file.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onFoldersChange(folders);
              onClose();
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
