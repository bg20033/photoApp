import { type Client } from "./types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ClientDetailsProps {
  client: Client;
  onToggleStatus?: (client: Client) => void;
}

export default function ClientDetails({
  client,
  onToggleStatus,
}: ClientDetailsProps) {
  const isActive = client.status === true;
  return (
    <div className="bg-background rounded-lg border p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div className="space-y-4">
          <h4 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
            Client Details
          </h4>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-2 border-b border-dashed">
              <span className="text-muted-foreground">Client ID</span>
              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                {client.id}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-2 border-b border-dashed">
              <span className="text-muted-foreground">Full Name</span>
              <span className="font-medium">{client.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-2 border-b border-dashed">
              <span className="text-muted-foreground">Email</span>
              <span className="break-all">{client.email}</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
            Info
          </h4>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-2 border-b border-dashed">
              <span className="text-muted-foreground">Status</span>
              <div className="flex items-center gap-2">
                <Badge variant={isActive ? "success" : "destructive"}>
                  {isActive ? "Active" : "Inactive"}
                </Badge>
                {onToggleStatus && (
                  <Button
                    variant={isActive ? "outline" : "outline"}
                    size="sm"
                    onClick={() => onToggleStatus(client)}
                    className="h-7 text-xs"
                  >
                    {isActive ? "Deactivate" : "Activate"}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-2 border-b border-dashed">
              <span className="text-muted-foreground">Phone</span>
              <span>{client.phone || "-"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-2 border-b border-dashed">
              <span className="text-muted-foreground">Created</span>
              <span>
                {client.createdAt ? formatDate(client.createdAt) : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
