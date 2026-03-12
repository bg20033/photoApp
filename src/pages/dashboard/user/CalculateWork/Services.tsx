import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  PencilEdit01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Service } from "./types";

interface ServicesCardProps {
  services: Service[];
  onAdd: () => void;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

export function ServicesCard({
  services,
  onAdd,
  onEdit,
  onDelete,
}: ServicesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={Add01Icon} className="size-5" />
          Standalone Services
        </CardTitle>
        <Button size="sm" onClick={onAdd}>
          <HugeiconsIcon icon={Add01Icon} className="size-4 mr-1" /> Add Service
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 text-sm font-medium">Name</th>
                <th className="text-left p-3 text-sm font-medium">Category</th>
                <th className="text-left p-3 text-sm font-medium">Price</th>
                <th className="text-left p-3 text-sm font-medium hidden md:table-cell">
                  Description
                </th>
                <th className="text-right p-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b last:border-b-0">
                  <td className="p-2 py-1 font-medium">{service.name}</td>
                  <td className="p-2 py-1">
                    <Badge variant="secondary">{service.category}</Badge>
                  </td>
                  <td className="p-2 py-1">€{service.price}</td>
                  <td className="p-2 py-1 text-sm text-muted-foreground hidden md:table-cell">
                    {service.description}
                  </td>
                  <td className="p-2 py-1 text-right">
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      onClick={() => onEdit(service)}
                    >
                      <HugeiconsIcon
                        icon={PencilEdit01Icon}
                        className="size-4"
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      className="text-destructive"
                      onClick={() => onDelete(service.id)}
                    >
                      <HugeiconsIcon icon={Delete01Icon} className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
