import { useState } from "react";
import { Film, Images, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoGallery } from "./VideoGallery";
import { PhotoGallery } from "./PhotoGallery";
import type { ClientUser } from "./types";

const mockClient: ClientUser = {
  id: "client-001",
  name: "Sarah & Michael",
  email: "sarah.michael@example.com",
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token",
};

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("videos");

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {mockClient.name}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Access your wedding videos and photos in one place
            </p>
          </div>

          {/* Client Info Card */}
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-medium">{mockClient.name}</p>
              <p className="text-muted-foreground">{mockClient.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="videos" className="gap-2">
            <Film className="h-4 w-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="photos" className="gap-2">
            <Images className="h-4 w-4" />
            Photos
          </TabsTrigger>
        </TabsList>

        {/* Videos Tab */}
        <TabsContent
          value="videos"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <VideoGallery />
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent
          value="photos"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <PhotoGallery />
        </TabsContent>
      </Tabs>
    </div>
  );
}
