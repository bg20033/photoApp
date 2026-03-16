import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  ChevronRight,
  Heart,
  Check,
  Download,
  X,
  ArrowLeft,
  ImageIcon,
  Maximize2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ZoomIn,
  ZoomOut,
  Minimize2,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Folder3DCard } from "@/components/ui/Folder3DCard";
import type { Photo, PhotoFolder } from "./types";

const sampleFolders: PhotoFolder[] = [
  {
    id: "folder-1",
    name: "Wedding Day",
    parentId: null,
    coverPhoto:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
    photoCount: 150,
  },
  {
    id: "folder-2",
    name: "Wedding Night",
    parentId: null,
    coverPhoto:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
    photoCount: 89,
  },
  {
    id: "folder-3",
    name: "Photoshooting",
    parentId: null,
    coverPhoto:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
    photoCount: 45,
  },
];

// Generate sample photos for each folder
const generateSamplePhotos = (folderId: string, count: number): Photo[] => {
  return Array.from({ length: Math.min(count, 20) }, (_, i) => ({
    id: `${folderId}-photo-${i + 1}`,
    url: `https://picsum.photos/seed/${folderId}${i}/400/300`,
    fullUrl: `https://picsum.photos/seed/${folderId}${i}/1200/900`,
    folderId,
    isFavorite: i % 5 === 0, // Every 5th photo is favorited
    isSelected: false,
    title: `Photo ${i + 1}`,
  }));
};

// Get all photos for a folder
const getPhotosForFolder = (folderId: string): Photo[] => {
  const folder = sampleFolders.find((f) => f.id === folderId);
  if (!folder) return [];
  return generateSamplePhotos(folderId, folder.photoCount);
};

export function PhotoGallery() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<
    { id: string | null; name: string }[]
  >([{ id: null, name: "All Folders" }]);

  // Selection mode state
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Image viewer state
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [viewingPhotoIndex, setViewingPhotoIndex] = useState<number | null>(
    null,
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const scrollPositionRef = useRef(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Touch handling for swipe
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Navigate to a folder
  const navigateToFolder = useCallback((folder: PhotoFolder) => {
    setCurrentFolderId(folder.id);
    setPhotos(getPhotosForFolder(folder.id));
    setBreadcrumb([
      { id: null, name: "All Folders" },
      { id: folder.id, name: folder.name },
    ]);
    // Reset selection mode when navigating
    setIsSelectionMode(false);
  }, []);

  // Navigate back
  const navigateBack = useCallback(() => {
    setCurrentFolderId(null);
    setPhotos([]);
    setBreadcrumb([{ id: null, name: "All Folders" }]);
    // Reset selection mode
    setIsSelectionMode(false);
  }, []);

  // Toggle selection mode
  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode((prev) => {
      const newMode = !prev;
      if (!newMode) {
        // Clear selection when exiting selection mode
        clearSelection();
      }
      return newMode;
    });
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((photoId: string) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === photoId
          ? { ...photo, isFavorite: !photo.isFavorite }
          : photo,
      ),
    );
  }, []);

  // Toggle photo selection
  const toggleSelection = useCallback((photoId: string) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === photoId
          ? { ...photo, isSelected: !photo.isSelected }
          : photo,
      ),
    );
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setPhotos((prev) => prev.map((photo) => ({ ...photo, isSelected: false })));
  }, []);

  // Open image viewer
  const openImageViewer = useCallback((index: number) => {
    // Save scroll position
    scrollPositionRef.current = window.scrollY;
    setViewingPhotoIndex(index);
    setIsImageViewerOpen(true);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }, []);

  // Close image viewer
  const closeImageViewer = useCallback(() => {
    setIsImageViewerOpen(false);
    setViewingPhotoIndex(null);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    // Restore body scroll
    document.body.style.overflow = "";
    // Restore scroll position
    setTimeout(() => {
      window.scrollTo(0, scrollPositionRef.current);
    }, 0);
  }, []);

  // Navigate to previous/next image
  const navigateImage = useCallback(
    (direction: "prev" | "next") => {
      if (viewingPhotoIndex === null) return;

      let newIndex: number;
      if (direction === "prev") {
        newIndex =
          viewingPhotoIndex === 0 ? photos.length - 1 : viewingPhotoIndex - 1;
      } else {
        newIndex =
          viewingPhotoIndex === photos.length - 1 ? 0 : viewingPhotoIndex + 1;
      }

      setViewingPhotoIndex(newIndex);
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
    },
    [viewingPhotoIndex, photos.length],
  );

  // Handle zoom
  const handleZoom = useCallback((newZoom: number) => {
    setZoomLevel(newZoom);
    if (newZoom === 1) {
      setPanPosition({ x: 0, y: 0 });
    }
  }, []);

  // Zoom in/out helpers
  const zoomIn = useCallback(() => {
    const zoomLevels = [1, 1.5, 2];
    const currentIndex = zoomLevels.indexOf(zoomLevel);
    if (currentIndex < zoomLevels.length - 1) {
      handleZoom(zoomLevels[currentIndex + 1]);
    }
  }, [zoomLevel, handleZoom]);

  const zoomOut = useCallback(() => {
    const zoomLevels = [1, 1.5, 2];
    const currentIndex = zoomLevels.indexOf(zoomLevel);
    if (currentIndex > 0) {
      handleZoom(zoomLevels[currentIndex - 1]);
    }
  }, [zoomLevel, handleZoom]);

  // Handle pan start
  const handlePanStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (zoomLevel === 1) return;

      setIsPanning(true);
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      panStartRef.current = {
        x: clientX - panPosition.x,
        y: clientY - panPosition.y,
      };
    },
    [zoomLevel, panPosition],
  );

  // Handle pan move
  const handlePanMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isPanning || zoomLevel === 1) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const newX = clientX - panStartRef.current.x;
      const newY = clientY - panStartRef.current.y;

      // Simple bounds checking (can be enhanced)
      const maxPan = 200 * (zoomLevel - 1);
      const clampedX = Math.max(-maxPan, Math.min(maxPan, newX));
      const clampedY = Math.max(-maxPan, Math.min(maxPan, newY));

      setPanPosition({ x: clampedX, y: clampedY });
    },
    [isPanning, zoomLevel],
  );

  // Handle pan end
  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Handle touch start for swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  // Handle touch end for swipe
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current || zoomLevel > 1) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = touchStartRef.current.x - endX;
      const deltaY = touchStartRef.current.y - endY;

      // Check if horizontal swipe (ignore vertical swipes)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          navigateImage("next");
        } else {
          navigateImage("prev");
        }
      }

      touchStartRef.current = null;
    },
    [navigateImage, zoomLevel],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isImageViewerOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          navigateImage("prev");
          break;
        case "ArrowRight":
          e.preventDefault();
          navigateImage("next");
          break;
        case "Escape":
          e.preventDefault();
          closeImageViewer();
          break;
        case "+":
        case "=":
          e.preventDefault();
          zoomIn();
          break;
        case "-":
          e.preventDefault();
          zoomOut();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isImageViewerOpen, navigateImage, closeImageViewer, zoomIn, zoomOut]);

  // Download selected photos
  const downloadSelected = useCallback(() => {
    const selectedCount = selectedPhotos.length;
    if (selectedCount === 0) return;

    selectedPhotos.forEach((photo, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = photo.url;
        link.download = `photo-${photo.id}.jpg`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 200);
    });

    showToast(
      `Downloading ${selectedCount} photo${selectedCount !== 1 ? "s" : ""}...`,
      "success",
    );
  }, []);

  // Download all photos
  const downloadAll = useCallback(() => {
    photos.forEach((photo, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = photo.url;
        link.download = `photo-${photo.id}.jpg`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 100);
    });

    showToast(`Downloading all ${photos.length} photos...`, "success");
  }, [photos]);

  // Simple toast function
  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
      type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  };

  // Computed values
  const selectedPhotos = useMemo(
    () => photos.filter((p) => p.isSelected),
    [photos],
  );

  const favoritePhotos = useMemo(
    () => photos.filter((p) => p.isFavorite),
    [photos],
  );

  // Generate shareable link for selected photos
  const generatePhotoShareLink = useCallback(
    (photosToShare: Photo[]): string => {
      const baseUrl = window.location.origin;
      const photoIds = photosToShare.map((p) => p.id).join(",");
      // Using a mock access token - in real app, get from auth context
      const accessToken = "sample-token-123";
      return `${baseUrl}/share/photos?ids=${encodeURIComponent(photoIds)}&token=${encodeURIComponent(accessToken)}`;
    },
    [],
  );

  // Share selected photos
  const shareSelected = useCallback(async () => {
    const selectedCount = selectedPhotos.length;
    if (selectedCount === 0) return;

    try {
      const link = generatePhotoShareLink(selectedPhotos);
      await navigator.clipboard.writeText(link);
      showToast(
        `Link copied! Share ${selectedCount} photo${selectedCount !== 1 ? "s" : ""}`,
        "success",
      );
    } catch (error) {
      console.error("Failed to copy link:", error);
      showToast("Failed to copy link. Please try again.", "error");
    }
  }, [selectedPhotos, generatePhotoShareLink]);

  // Get current viewing photo
  const currentPhoto =
    viewingPhotoIndex !== null ? photos[viewingPhotoIndex] : null;

  // Folder grid view
  if (!currentFolderId) {
    return (
      <div className="space-y-6 ">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Photo Gallery</h2>
            <p className="text-sm text-muted-foreground">
              {sampleFolders.length} folders •{" "}
              {sampleFolders.reduce((acc, f) => acc + f.photoCount, 0)} total
              photos
            </p>
          </div>
        </div>

        {/* Folder Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 pt-12">
          {sampleFolders.map((folder) => (
            <Folder3DCard
              key={folder.id}
              name={folder.name}
              photoCount={folder.photoCount}
              coverPhoto={folder.coverPhoto}
              onClick={() => navigateToFolder(folder)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        {breadcrumb.map((item, index) => (
          <div key={item.id ?? "root"} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            {index === breadcrumb.length - 1 ? (
              <span className="font-medium">
                {item.name}
                {photos.length > 0 && (
                  <span className="ml-2 text-muted-foreground">
                    {photos.length} / {favoritePhotos.length} fav
                  </span>
                )}
              </span>
            ) : (
              <button
                onClick={navigateBack}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={navigateBack}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="flex gap-2">
          {!isSelectionMode ? (
            <>
              <Button variant="outline" size="sm" onClick={toggleSelectionMode}>
                Select
              </Button>
              <Button variant="outline" size="sm" onClick={downloadAll}>
                <Download className="mr-1.5 h-4 w-4" />
                Download All
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={toggleSelectionMode}>
                Cancel Selection
              </Button>
              <Button variant="outline" size="sm" onClick={downloadAll}>
                <Download className="mr-1.5 h-4 w-4" />
                Download All
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Bulk Actions Toolbar - only in selection mode when photos selected */}
      {isSelectionMode && selectedPhotos.length > 0 && (
        <>
          <div className="flex items-center justify-between rounded-lg bg-muted p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <Badge variant="default" className="h-6 px-2">
                <Check className="mr-1 h-3 w-3" />
                {selectedPhotos.length} selected
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="h-6 px-2 text-muted-foreground hover:text-foreground"
              >
                <X className="mr-1 h-3 w-3" />
                Clear
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleSelectionMode}>
                Cancel
              </Button>
              <Button variant="outline" size="sm" onClick={shareSelected}>
                <Link className="mr-1.5 h-4 w-4" />
                Share Selected
              </Button>
              <Button size="sm" onClick={downloadSelected}>
                <Download className="mr-1.5 h-4 w-4" />
                Download Selected
              </Button>
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted transition-all duration-200 ${
              photo.isSelected && isSelectionMode
                ? "ring-2 ring-primary ring-offset-2"
                : "hover:ring-2 hover:ring-primary/50 hover:ring-offset-2"
            }`}
            onClick={() => {
              if (isSelectionMode) {
                toggleSelection(photo.id);
              } else {
                openImageViewer(index);
              }
            }}
          >
            {/* Photo */}
            <img
              src={photo.url}
              alt={`Photo ${photo.id}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/30">
              {/* Selection Checkbox - only in selection mode */}
              {isSelectionMode && (
                <div
                  className={`absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all duration-200 ${
                    photo.isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-white/70 bg-black/30 text-transparent group-hover:border-white group-hover:bg-black/50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelection(photo.id);
                  }}
                >
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}

              {/* Expand button - only in view mode */}
              {!isSelectionMode && (
                <button
                  className="absolute left-2 top-2 rounded-full bg-black/30 p-1.5 text-white opacity-0 transition-all duration-200 hover:bg-black/50 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    openImageViewer(index);
                  }}
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              )}

              {/* Favorite Button */}
              <button
                className="absolute right-2 top-2 rounded-full bg-black/30 p-1.5 text-white opacity-0 transition-all duration-200 hover:bg-black/50 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(photo.id);
                }}
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    photo.isFavorite ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </button>
            </div>

            {/* Selected indicator (always visible when selected in selection mode) */}
            {isSelectionMode && photo.isSelected && (
              <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
            )}

            {/* Favorite indicator (always visible when favorited) */}
            {photo.isFavorite && (
              <div className="absolute bottom-2 right-2 rounded-full bg-red-500 p-1">
                <Heart className="h-3 w-3 fill-white text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {photos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No photos found</h3>
          <p className="text-sm text-muted-foreground">This folder is empty</p>
        </div>
      )}

      {/* Full Image Viewer Modal */}
      {isImageViewerOpen && currentPhoto && viewingPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-linear-to-b from-black/50 to-transparent">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomOut}
                disabled={zoomLevel === 1}
                className="text-white hover:bg-white/20"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-white text-sm min-w-12 text-center">
                {zoomLevel}x
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomIn}
                disabled={zoomLevel === 2}
                className="text-white hover:bg-white/20"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              {zoomLevel > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleZoom(1)}
                  className="text-white hover:bg-white/20"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Photo Counter */}
            <div className="text-white text-sm font-medium">
              {viewingPhotoIndex + 1} / {photos.length}
            </div>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={closeImageViewer}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Main Image Area */}
          <div
            ref={imageContainerRef}
            className="flex-1 relative flex items-center justify-center overflow-hidden"
            onMouseDown={handlePanStart}
            onMouseMove={handlePanMove}
            onMouseUp={handlePanEnd}
            onMouseLeave={handlePanEnd}
          >
            {/* Previous Button */}
            <button
              onClick={() => navigateImage("prev")}
              className="absolute left-4 z-10 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              disabled={zoomLevel > 1}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Image */}
            <img
              src={currentPhoto.fullUrl || currentPhoto.url}
              alt={currentPhoto.title || `Photo ${viewingPhotoIndex + 1}`}
              className="max-h-full max-w-full object-contain transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                cursor:
                  zoomLevel > 1 ? (isPanning ? "grabbing" : "grab") : "default",
              }}
              draggable={false}
            />

            {/* Next Button */}
            <button
              onClick={() => navigateImage("next")}
              className="absolute right-4 z-10 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              disabled={zoomLevel > 1}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>

            {/* Swipe hint for mobile */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs md:hidden">
              Swipe to navigate
            </div>
          </div>

          {/* Bottom Bar - Photo Info */}
          <div className="px-4 py-3 bg-linear-to-t from-black/50 to-transparent">
            <p className="text-white text-center text-sm">
              {currentPhoto.title || `Photo ${viewingPhotoIndex + 1}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
