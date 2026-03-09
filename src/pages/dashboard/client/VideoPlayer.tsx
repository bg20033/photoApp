import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Video } from "./types";

interface VideoPlayerProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPlayer({ video, isOpen, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Autoplay when opened
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked, user can click play
      });
    }
  }, [isOpen]);

  if (!isOpen || !video) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Video container */}
      <div
        className="relative w-full max-w-6xl px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">{video.title}</h2>
          <p className="text-sm text-white/70">Duration: {video.duration}</p>
        </div>

        {/* Video player */}
        <div className="relative aspect-video overflow-hidden rounded-lg bg-black shadow-2xl">
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.thumbnail}
            controls
            className="h-full w-full"
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
