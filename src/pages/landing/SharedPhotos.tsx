import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Download,
  Grid3X3,
  Maximize,
  AlertCircle,
  Loader2,
  RotateCcw,
  Move,
  ImageIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Photo } from "../dashboard/client/types";

// Generate sample photos matching PhotoGallery structure (20 photos per folder)
const generateSamplePhotos = (): Photo[] => {
  const photos: Photo[] = [];

  // Folder 1: Wedding Day (20 photos)
  for (let i = 1; i <= 20; i++) {
    photos.push({
      id: `folder-1-photo-${i}`,
      url: `https://picsum.photos/seed/folder-1 ${i}/400/300`,
      fullUrl: `https://picsum.photos/seed/folder-1 ${i}/1200/900`,
      folderId: "folder-1",
      isFavorite: i % 5 === 0,
      isSelected: false,
      title: `Wedding Photo ${i}`,
    });
  }

  // Folder 2: Wedding Night (20 photos)
  for (let i = 1; i <= 20; i++) {
    photos.push({
      id: `folder-2-photo-${i}`,
      url: `https://picsum.photos/seed/folder-2 ${i}/400/300`,
      fullUrl: `https://picsum.photos/seed/folder-2 ${i}/1200/900`,
      folderId: "folder-2",
      isFavorite: i % 5 === 0,
      isSelected: false,
      title: `Night Photo ${i}`,
    });
  }

  // Folder 3: Photoshooting (20 photos)
  for (let i = 1; i <= 20; i++) {
    photos.push({
      id: `folder-3-photo-${i}`,
      url: `https://picsum.photos/seed/folder-3 ${i}/400/300`,
      fullUrl: `https://picsum.photos/seed/folder-3 ${i}/1200/900`,
      folderId: "folder-3",
      isFavorite: i % 5 === 0,
      isSelected: false,
      title: `Photoshoot ${i}`,
    });
  }

  return photos;
};

const samplePhotos: Photo[] = generateSamplePhotos();

const VIEWPORT_BUFFER = 2;

interface PositionedPhoto extends Photo {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
  originalId: string;
  gridRow: number;
  gridCol: number;
}

const getVisibleGridCells = (panX: number, panY: number, spacing: number) => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const startCol = Math.floor(
    (-panX - viewportWidth * VIEWPORT_BUFFER) / spacing,
  );
  const endCol = Math.floor(
    (-panX + viewportWidth * (1 + VIEWPORT_BUFFER)) / spacing,
  );
  const startRow = Math.floor(
    (-panY - viewportHeight * VIEWPORT_BUFFER) / spacing,
  );
  const endRow = Math.floor(
    (-panY + viewportHeight * (1 + VIEWPORT_BUFFER)) / spacing,
  );

  return { startCol, endCol, startRow, endRow };
};

// Generate photo on-the-fly based on grid position
const generatePhotoAtGridPosition = (
  row: number,
  col: number,
  basePhotos: Photo[],
  spacing: number,
): PositionedPhoto => {
  // Use row/col as seed for deterministic generation
  const seed = Math.abs(row * 10000 + col);
  const pseudoRandom = (offset = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  // Pick photo from base set using deterministic random
  const photoIndex = Math.floor(pseudoRandom() * basePhotos.length);
  const basePhoto = basePhotos[photoIndex];

  return {
    ...basePhoto,
    id: `grid-${row}-${col}-${basePhoto.id}`,
    originalId: basePhoto.id,
    x: col * spacing + pseudoRandom(1) * 40,
    y: row * spacing + pseudoRandom(2) * 40,
    rotation: (pseudoRandom(3) - 0.5) * 20,
    scale: 0.85 + pseudoRandom(4) * 0.15,
    zIndex: Math.floor(pseudoRandom(5) * 100),
    gridRow: row,
    gridCol: col,
  };
};

type LoadingState = "loading" | "error" | "success";
type ViewMode = "grid" | "infinite";

export default function SharedPhotos() {
  const [searchParams] = useSearchParams();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamic values based on screen size
  const photoSpacing = isMobile ? 250 : 340;
  const photoCardWidth = isMobile ? 200 : 240;

  // Dynamic infinite gallery state
  const [visiblePhotos, setVisiblePhotos] = useState<PositionedPhoto[]>([]);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });

  // Spring physics - smoother config
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const springX = useSpring(panX, { stiffness: 150, damping: 20, mass: 0.5 });
  const springY = useSpring(panY, { stiffness: 150, damping: 20, mass: 0.5 });

  const infiniteContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const photoIds = searchParams.get("ids");
  const token = searchParams.get("token");

  // Base photos for the infinite gallery (useMemo to prevent regeneration)
  const basePhotos = useMemo(() => {
    return photos.length > 0 ? photos : samplePhotos;
  }, [photos]);

  // Update visible photos when pan position changes
  useEffect(() => {
    const { startCol, endCol, startRow, endRow } = getVisibleGridCells(
      panPosition.x,
      panPosition.y,
      photoSpacing,
    );

    const newVisiblePhotos: PositionedPhoto[] = [];
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        newVisiblePhotos.push(
          generatePhotoAtGridPosition(row, col, basePhotos, photoSpacing),
        );
      }
    }

    setVisiblePhotos(newVisiblePhotos);
  }, [panPosition, basePhotos, photoSpacing]);

  // Sync pan position with spring values - only when not dragging
  useEffect(() => {
    if (!isDragging) {
      panX.set(panPosition.x);
      panY.set(panPosition.y);
    }
  }, [panPosition, panX, panY, isDragging]);

  // Fetch photos
  useEffect(() => {
    const validateAndFetchPhotos = async () => {
      try {
        setLoadingState("loading");
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (!token) {
          setErrorMessage("Access token is missing. Please check your link.");
          setLoadingState("error");
          return;
        }

        if (!photoIds) {
          setErrorMessage("No photos specified in the link.");
          setLoadingState("error");
          return;
        }

        const ids = photoIds.split(",").filter((id) => id.trim());

        if (ids.length === 0) {
          setErrorMessage("Invalid photo IDs in the link.");
          setLoadingState("error");
          return;
        }

        const foundPhotos = ids
          .map((id) => samplePhotos.find((p) => p.id === id))
          .filter((p): p is Photo => p !== undefined);

        if (foundPhotos.length === 0) {
          setErrorMessage(
            "No photos found. The link may be expired or invalid.",
          );
          setLoadingState("error");
          return;
        }

        setPhotos(foundPhotos);
        setLoadingState("success");
      } catch (error) {
        setErrorMessage("An error occurred while loading the photos.");
        setLoadingState("error");
      }
    };

    validateAndFetchPhotos();
  }, [photoIds, token]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsSpacePressed(true);
      }
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      }
      if ((e.key === "r" || e.key === "R") && viewMode === "infinite") {
        resetView();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [viewMode]);

  // Simplified pan handler - truly infinite, no wrapping needed

  // Pan handlers - optimized
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (viewMode !== "infinite") return;
      const target = e.target as HTMLElement;
      const isCanvasClick =
        target === canvasRef.current || target.closest('[data-canvas="true"]');

      if (isSpacePressed || isCanvasClick) {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({
          x: e.clientX - panPosition.x,
          y: e.clientY - panPosition.y,
        });
      }
    },
    [viewMode, isSpacePressed, panPosition],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || viewMode !== "infinite") return;
      e.preventDefault();

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Direct set for performance during drag
      panX.set(newX);
      panY.set(newY);
      setPanPosition({ x: newX, y: newY });
    },
    [isDragging, dragStart, viewMode, panX, panY],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (viewMode !== "infinite") return;

      if (e.touches.length === 1) {
        setDragStart({
          x: e.touches[0].clientX - panPosition.x,
          y: e.touches[0].clientY - panPosition.y,
        });
        setIsDragging(true);
      }
    },
    [viewMode, panPosition],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (viewMode !== "infinite") return;
      e.preventDefault();

      if (e.touches.length === 1 && isDragging) {
        const newX = e.touches[0].clientX - dragStart.x;
        const newY = e.touches[0].clientY - dragStart.y;

        panX.set(newX);
        panY.set(newY);
        setPanPosition({ x: newX, y: newY });
      }
    },
    [viewMode, isDragging, dragStart, panX, panY],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetView = useCallback(() => {
    const centerPos = { x: 0, y: 0 };
    setPanPosition(centerPos);
    panX.set(centerPos.x);
    panY.set(centerPos.y);
  }, [panX, panY]);

  // Initialize center position when entering infinite mode
  useEffect(() => {
    if (viewMode === "infinite" && !isViewTransitioning) {
      const centerPos = { x: 0, y: 0 };
      setPanPosition(centerPos);
      panX.set(centerPos.x);
      panY.set(centerPos.y);
    }
  }, [viewMode, panX, panY, isViewTransitioning]);

  // View mode change handler with transition lock
  const handleViewModeChange = (value: string) => {
    setIsViewTransitioning(true);
    setViewMode(value as ViewMode);
    // Small delay to prevent animation conflicts
    setTimeout(() => setIsViewTransitioning(false), 300);
  };

  // Download handlers
  const downloadPhoto = useCallback(async (photo: Photo) => {
    setIsDownloading(photo.id);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const link = document.createElement("a");
    link.href = photo.fullUrl || photo.url;
    link.download = `photo-${photo.id}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsDownloading(null), 1000);
  }, []);

  const downloadAll = useCallback(() => {
    photos.forEach((photo, index) => {
      setTimeout(() => downloadPhoto(photo), index * 300);
    });
  }, [photos, downloadPhoto]);

  // Loading state
  if (loadingState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-muted/30 to-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading photos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (loadingState === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-muted/30 to-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Unable to load photos</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {errorMessage}
              </p>
            </div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">Shared Photos</h1>
              <Badge variant="outline" className="text-xs">
                {photos.length} photo{photos.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Tabs value={viewMode} onValueChange={handleViewModeChange}>
                <TabsList className="h-9">
                  <TabsTrigger value="grid" className="text-xs">
                    <Grid3X3 className="mr-1.5 h-3.5 w-3.5" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="infinite" className="text-xs">
                    <Maximize className="mr-1.5 h-3.5 w-3.5" />
                    Infinite Gallery
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm" onClick={downloadAll}>
                <Download className="mr-1.5 h-4 w-4" />
                Download All
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 relative">
        {viewMode === "grid" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.03, 0.5),
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  transition: { duration: 0.2 },
                }}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted shadow-sm hover:shadow-xl transition-shadow"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.title || `Photo ${photo.id}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200">
                  <button
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadPhoto(photo);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        {viewMode === "infinite" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            ref={infiniteContainerRef}
            className="fixed inset-0 z-40 overflow-hidden bg-gray-50 touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              cursor: isDragging
                ? "grabbing"
                : isSpacePressed
                  ? "grab"
                  : "default",
              willChange: "transform",
            }}
          >
            <div className="absolute left-4 top-4 z-50 flex flex-col gap-2 pointer-events-none">
              <div className="rounded-lg bg-white/90 p-2 backdrop-blur-sm shadow-lg border">
                <p className="text-xs text-gray-700 font-medium">
                  <Move className="mr-1 inline h-3 w-3" />
                  {isSpacePressed
                    ? "Click & Drag to pan"
                    : "Hold Space + Drag to pan"}
                </p>
              </div>
              <div className="rounded-lg bg-white/80 p-1.5 backdrop-blur-sm shadow border">
                <p className="text-[10px] text-gray-500">
                  {visiblePhotos.length} photos visible
                </p>
              </div>
            </div>
            <div className="absolute left-4 bottom-4 z-50">
              <Button
                variant="secondary"
                className="bg-white/90 text-gray-700 hover:bg-white shadow-lg border"
                onClick={() => handleViewModeChange("grid")}
              >
                <Grid3X3 className="mr-2 h-4 w-4" />
                Back to Grid View
              </Button>
            </div>
            <div className="absolute right-4 top-4 z-50">
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 bg-white/90 text-gray-700 hover:bg-white shadow-lg border"
                onClick={resetView}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Transform layer - truly infinite */}
            <motion.div
              ref={canvasRef}
              data-canvas="true"
              className="absolute"
              style={{
                x: springX,
                y: springY,
                willChange: "transform",
              }}
            >
              {/* Only render visible photos - Dynamic Virtual Rendering */}
              {visiblePhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  className="absolute"
                  style={{
                    left: photo.x,
                    top: photo.y,
                    rotate: photo.rotation,
                    zIndex: photo.zIndex,
                    width: photoCardWidth,
                    contain: "layout style paint",
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: photo.scale }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  whileHover={{
                    scale: photo.scale * 1.05,
                    zIndex: 10000,
                    transition: { duration: 0.2 },
                  }}
                >
                  {/* Polaroid card styling */}
                  <div
                    className="bg-white p-2 pb-3 border border-gray-300 rounded-xl duration-300 cursor-pointer overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDragging) {
                        const basePhoto = photos.find(
                          (p) => p.id === photo.originalId,
                        );
                        setSelectedPhoto(basePhoto || photo);
                      }
                    }}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title || `Photo ${photo.id}`}
                      className="w-full h-auto rounded-md select-none pointer-events-none border border-gray-300"
                      draggable={false}
                      loading="lazy"
                    />
                    <div className="p-2 pt-3 text-center">
                      <h4 className="text-sm font-medium">{photo.title}</h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Empty State */}
        {photos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No photos found</h3>
            <p className="text-sm text-muted-foreground">
              The shared link doesn't contain any valid photos
            </p>
          </div>
        )}
      </main>

      {/* Full Size Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.fullUrl || selectedPhoto.url}
                alt={selectedPhoto.title || `Photo ${selectedPhoto.id}`}
                className="rounded-lg shadow-2xl max-w-full max-h-[85vh] object-contain"
              />

              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-4 -top-4 text-white hover:bg-white/20 bg-black/50 rounded-full h-10 w-10"
                onClick={() => setSelectedPhoto(null)}
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Download button and title */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between rounded-b-lg bg-linear-to-t from-black/80 to-transparent p-4">
                <p className="text-white text-sm font-medium">
                  {selectedPhoto.title || `Photo ${selectedPhoto.id}`}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadPhoto(selectedPhoto);
                  }}
                  disabled={isDownloading === selectedPhoto.id}
                >
                  {isDownloading === selectedPhoto.id ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-1.5 h-4 w-4" />
                      Download
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer info - hidden in infinite mode */}
      {viewMode === "grid" && (
        <footer className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-muted-foreground">
          <p>These photos were shared with you securely.</p>
          <p className="mt-1">
            If you have any issues viewing the photos, please contact the
            sender.
          </p>
        </footer>
      )}
    </div>
  );
}
