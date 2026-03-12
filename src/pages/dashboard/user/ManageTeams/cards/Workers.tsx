import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserMultipleIcon,
  Add01Icon,
  PencilEdit01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Worker, type Role } from "../../CalculateWork/types";
import { getIconComponent } from "./Roles";

interface WorkersCardProps {
  workers: Worker[];
  roles: Role[];
  onAdd: () => void;
  onEdit: (worker: Worker) => void;
  onDelete: (id: string) => void;
}

export function WorkersCard({
  workers,
  roles,
  onAdd,
  onEdit,
  onDelete,
}: WorkersCardProps) {
  const getWorkerRoles = (roleIds: string[]) => {
    return roles.filter((r) => roleIds.includes(r.id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={UserMultipleIcon} className="size-5" />
          Team Workers
        </CardTitle>
        <Button size="sm" onClick={onAdd}>
          <HugeiconsIcon icon={Add01Icon} className="size-4 mr-1" /> Add Worker
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 text-sm font-medium">Name</th>
                <th className="text-left p-3 text-sm font-medium">Contact</th>
                <th className="text-left p-3 text-sm font-medium">Roles</th>
                <th className="text-right p-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => {
                const workerRoles = getWorkerRoles(worker.roleIds);
                return (
                  <tr
                    key={worker.id}
                    className="border-b last:border-b-0 hover:bg-muted/30"
                  >
                    <td className="p-3">
                      <div className="font-medium">{worker.name}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-muted-foreground">
                        {worker.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {worker.phone}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {workerRoles.map((role) => {
                          const Icon = getIconComponent(role.icon);
                          return (
                            <Badge
                              key={role.id}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <HugeiconsIcon icon={Icon} className="size-3" />
                              {role.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(worker)}
                      >
                        <HugeiconsIcon
                          icon={PencilEdit01Icon}
                          className="size-4"
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive"
                        onClick={() => onDelete(worker.id)}
                      >
                        <HugeiconsIcon icon={Delete01Icon} className="size-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {workers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No workers configured</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={onAdd}
            >
              Add your first worker
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
