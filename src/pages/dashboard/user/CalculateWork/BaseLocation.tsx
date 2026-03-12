import { HugeiconsIcon } from "@hugeicons/react";
import { MapPinIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Location } from "./types";

interface BaseLocationCardProps {
  locations: Location[];
}

export function BaseLocationCard({ locations }: BaseLocationCardProps) {
  const baseLocation = locations.find((l) => l.isBase);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={MapPinIcon} className="size-5" />
          Base Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        {baseLocation ? (
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">{baseLocation.name}</p>
              <p className="text-sm text-muted-foreground">
                {baseLocation.city}, {baseLocation.country}
              </p>
            </div>
            <Badge variant="secondary">Base</Badge>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No base location set</p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          This location is used internally for travel calculations and is not
          visible to clients.
        </p>
      </CardContent>
    </Card>
  );
}
