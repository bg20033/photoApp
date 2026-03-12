import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserMultipleIcon,
  Add01Icon,
  PencilEdit01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type TeamTier } from "./types.ts";

interface TeamTiersCardProps {
  tiers: TeamTier[];
  onAdd: () => void;
  onEdit: (tier: TeamTier) => void;
  onDelete: (id: string) => void;
}

export function TeamTiersCard({
  tiers,
  onAdd,
  onEdit,
  onDelete,
}: TeamTiersCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={UserMultipleIcon} className="size-5" />
          Team Pricing Tiers
        </CardTitle>
        <Button size="sm" onClick={onAdd}>
          <HugeiconsIcon icon={Add01Icon} className="size-4 mr-1" /> Add Tier
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 text-sm font-medium">Team Size</th>
                <th className="text-left p-3 text-sm font-medium">Price</th>
                <th className="text-right p-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => (
                <tr key={tier.id} className="border-b last:border-b-0">
                  <td className="p-2 py-1">
                    {tier.teamSize} {tier.teamSize === 1 ? "person" : "people"}
                  </td>
                  <td className="p-2 py-1">€{tier.price}</td>
                  <td className="p-2 py-1 text-right">
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      onClick={() => onEdit(tier)}
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
                      onClick={() => onDelete(tier.id)}
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
