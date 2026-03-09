import { useState, useCallback } from "react";
import { Play, Share2, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoPlayer } from "./VideoPlayer";
import {
  copyLinkToClipboard,
  showSimpleToast,
} from "./managePhotos/generateLink";
import type { Video, ClientUser } from "./types";

// Sample videos data
const sampleVideos: Video[] = [
  {
    id: "vid-1",
    title: "Wedding Highlights",
    thumbnail:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=450&fit=crop",
    duration: "5:30",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "vid-2",
    title: "Ceremony Full",
    thumbnail:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=450&fit=crop",
    duration: "45:00",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    createdAt: "2026-01-15T12:00:00Z",
  },
  {
    id: "vid-3",
    title: "Reception Party",
    thumbnail:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=450&fit=crop",
    duration: "20:15",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    createdAt: "2026-01-15T18:00:00Z",
  },
  {
    id: "vid-4",
    title: "Photoshoot Behind Scenes",
    thumbnail:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=450&fit=crop",
    duration: "8:45",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    createdAt: "2026-01-14T09:00:00Z",
  },
];

// Mock client user
const mockClient: ClientUser = {
  id: "client-1",
  name: "John & Jane",
  email: "couple@example.com",
  accessToken: "mock-access-token-12345",
};

export function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const handlePlayVideo = useCallback((video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  }, []);

  const handleClosePlayer = useCallback(() => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  }, []);

  const handleShare = useCallback((video: Video) => {
    copyLinkToClipboard(video, mockClient.accessToken, showSimpleToast);
  }, []);

  const handleDownload = useCallback((video: Video) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = video.videoUrl;
    link.download = `${video.title.replace(/\s+/g, "_")}.mp4`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSimpleToast("Download started!", "success");
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Video Gallery</h2>
          <p className="text-sm text-muted-foreground">
            {sampleVideos.length} videos available
          </p>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sampleVideos.map((video) => (
          <Card
            key={video.id}
            className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-muted">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-14 w-14 rounded-full bg-white/90 hover:bg-white"
                  onClick={() => handlePlayVideo(video)}
                >
                  <Play className="h-6 w-6 fill-current text-foreground" />
                </Button>
              </div>

              {/* Duration badge */}
              <Badge
                variant="secondary"
                className="absolute bottom-2 right-2 bg-black/70 text-white hover:bg-black/70"
              >
                {video.duration}
              </Badge>
            </div>

            {/* Content */}
            <CardContent className="p-4">
              <h3 className="mb-3 line-clamp-1 font-medium">{video.title}</h3>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handlePlayVideo(video)}
                >
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleShare(video)}
                >
                  <Share2 className="mr-1.5 h-3.5 w-3.5" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDownload(video)}
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Video Player Modal */}
      <VideoPlayer
        video={selectedVideo}
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
      />
    </div>
  );
}
