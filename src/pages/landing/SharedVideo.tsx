import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Play, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Video } from "../dashboard/client/types";

// Sample videos data (same as in VideoGallery)
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

type LoadingState = "loading" | "error" | "success";

export default function SharedVideo() {
  const { videoId } = useParams<{ videoId: string }>();
  const [searchParams] = useSearchParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    // Simulate API call to validate token and fetch video
    const validateAndFetchVideo = async () => {
      try {
        setLoadingState("loading");

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check if token is provided (in real app, validate with backend)
        if (!token) {
          setErrorMessage("Access token is missing. Please check your link.");
          setLoadingState("error");
          return;
        }

        // Find the video
        const foundVideo = sampleVideos.find((v) => v.id === videoId);

        if (!foundVideo) {
          setErrorMessage(
            "Video not found. The link may be expired or invalid.",
          );
          setLoadingState("error");
          return;
        }

        // In real app, validate token against the video here
        setVideo(foundVideo);
        setLoadingState("success");
      } catch (error) {
        setErrorMessage("An error occurred while loading the video.");
        setLoadingState("error");
      }
    };

    validateAndFetchVideo();
  }, [videoId, token]);

  // Loading state
  if (loadingState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-muted/30 to-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading video...</p>
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
              <h2 className="text-lg font-semibold">Unable to load video</h2>
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

  // Success state - Video player
  return (
    <div className="min-h-screen bg-linear-to-br from-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Shared Video</h1>
            <Badge variant="outline">Read Only</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Video Title */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight">{video?.title}</h2>
          <p className="mt-1 text-muted-foreground">
            Duration: {video?.duration}
          </p>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-black shadow-2xl">
          {isPlaying ? (
            <video
              src={video?.videoUrl}
              poster={video?.thumbnail}
              controls
              autoPlay
              className="h-full w-full"
              playsInline
              onEnded={() => setIsPlaying(false)}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <>
              {/* Thumbnail with play button */}
              <img
                src={video?.thumbnail}
                alt={video?.title}
                className="h-full w-full object-cover"
              />

              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Button
                  size="lg"
                  className="h-20 w-20 rounded-full bg-white/90 p-0 text-foreground hover:scale-105 hover:bg-white"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play className="h-10 w-10 fill-current" />
                </Button>
              </div>

              {/* Duration badge */}
              <Badge
                variant="secondary"
                className="absolute bottom-4 right-4 bg-black/70 text-white hover:bg-black/70"
              >
                {video?.duration}
              </Badge>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>This video was shared with you securely.</p>
          <p className="mt-1">
            If you have any issues playing the video, please contact the sender.
          </p>
        </div>
      </main>
    </div>
  );
}
