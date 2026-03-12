import { HugeiconsIcon } from "@hugeicons/react";
import { MapPinIcon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type TravelRule } from "./types";

interface TravelRulesCardProps {
  travelRule: TravelRule;
  setTravelRule: React.Dispatch<React.SetStateAction<TravelRule>>;
}

export function TravelRulesCard({
  travelRule,
  setTravelRule,
}: TravelRulesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={MapPinIcon} className="size-5" />
          Travel Pricing Rules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fuelCost">Fuel Cost per KM (€)</Label>
            <Input
              id="fuelCost"
              type="number"
              step="0.01"
              min="0"
              value={travelRule.fuelCostPerKm}
              onChange={(e) =>
                setTravelRule((prev) => ({
                  ...prev,
                  fuelCostPerKm: parseFloat(e.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domesticMult">Domestic Multiplier</Label>
            <Input
              id="domesticMult"
              type="number"
              step="0.1"
              min="0"
              value={travelRule.domesticMultiplier}
              onChange={(e) =>
                setTravelRule((prev) => ({
                  ...prev,
                  domesticMultiplier: parseFloat(e.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="intlMult">International Multiplier</Label>
            <Input
              id="intlMult"
              type="number"
              step="0.1"
              min="0"
              value={travelRule.internationalMultiplier}
              onChange={(e) =>
                setTravelRule((prev) => ({
                  ...prev,
                  internationalMultiplier: parseFloat(e.target.value),
                }))
              }
            />
          </div>
        </div>
        <div className="mt-4 p-3 bg-muted border rounded-md text-sm">
          <p className="font-medium">Logic:</p>
          <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
            <li>Same city → No travel cost</li>
            <li>
              Different city (same country) → Distance × Fuel cost × Domestic
              multiplier
            </li>
            <li>Outside country → Travel cost × International multiplier</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
