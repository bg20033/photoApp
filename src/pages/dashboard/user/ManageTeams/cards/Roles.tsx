import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Camera01Icon,
  WrenchIcon,
  TruckIcon,
  ClipboardIcon,
  StarIcon,
  FavouriteIcon,
  ShieldUserIcon,
  ZapIcon,
  Award01Icon,
  Add01Icon,
  PencilEdit01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Role, type IconType } from "./types.ts";

const ICON_OPTIONS: {
  value: IconType;
  label: string;
  icon: typeof UserIcon;
}[] = [
  { value: "User", label: "User", icon: UserIcon },
  { value: "Camera", label: "Camera", icon: Camera01Icon },
  { value: "Wrench", label: "Wrench", icon: WrenchIcon },
  { value: "Truck", label: "Truck", icon: TruckIcon },
  { value: "Clipboard", label: "Clipboard", icon: ClipboardIcon },
  { value: "Star", label: "Star", icon: StarIcon },
  { value: "Heart", label: "Heart", icon: FavouriteIcon },
  { value: "Shield", label: "Shield", icon: ShieldUserIcon },
  { value: "Zap", label: "Zap", icon: ZapIcon },
  { value: "Award", label: "Award", icon: Award01Icon },
];

const getIconComponent = (iconType: IconType) => {
  const iconOption = ICON_OPTIONS.find((opt) => opt.value === iconType);
  return iconOption?.icon || UserIcon;
};

interface RolesCardProps {
  roles: Role[];
  onAdd: () => void;
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
}

export function RolesCard({ roles, onAdd, onEdit, onDelete }: RolesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={UserIcon} className="size-5" />
          Team Roles
        </CardTitle>
        <Button size="sm" onClick={onAdd}>
          <HugeiconsIcon icon={Add01Icon} className="size-4 mr-1" /> Add Role
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {roles.map((role) => {
            const Icon = getIconComponent(role.icon);
            return (
              <div
                key={role.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Icon}
                    className="size-5 text-muted-foreground"
                  />
                  <span className="font-medium">{role.name}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(role)}
                  >
                    <HugeiconsIcon icon={PencilEdit01Icon} className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() => onDelete(role.id)}
                  >
                    <HugeiconsIcon icon={Delete01Icon} className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        {roles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No roles configured</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={onAdd}
            >
              Add your first role
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Re-export icon utilities for use in modals
export { ICON_OPTIONS, getIconComponent };
