import { HugeiconsIcon } from "@hugeicons/react";
import {
  CalendarIcon,
  Add01Icon,
  PencilEdit01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingCurveChart } from "./charts/PricingCurveChart";
import { type PricingPeriod } from "./types";
import { formatDateRange, formatDateShort } from "./utils";

interface PricingPeriodsCardProps {
  periods: PricingPeriod[];
  onAdd: () => void;
  onEdit: (period: PricingPeriod) => void;
  onDelete: (id: string) => void;
}

export function PricingPeriodsCard({
  periods,
  onAdd,
  onEdit,
  onDelete,
}: PricingPeriodsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={CalendarIcon} className="size-5" />
          Date-Based Pricing
        </CardTitle>
        <Button size="sm" onClick={onAdd}>
          <HugeiconsIcon icon={Add01Icon} className="size-4 mr-1" /> Add Period
        </Button>
      </CardHeader>
      <CardContent>
        {/* Bell Curve Visualization */}
        <div className="p-4 bg-muted/30 rounded-t-lg border">
          <h4 className="text-sm font-medium mb-3">Pricing Curve Overview</h4>
          <PricingCurveChart periods={periods} />
        </div>

        <div className="border border-t-0 rounded-b-md">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 text-sm font-medium">Name</th>
                <th className="text-left p-3 text-sm font-medium">Period</th>
                <th className="text-left p-3 text-sm font-medium">Peak Date</th>
                <th className="text-left p-3 text-sm font-medium">Range</th>
                <th className="text-right p-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => (
                <tr
                  key={period.id}
                  className="hover:bg-muted/30 border-b last:border-0"
                >
                  <td className="p-2 py-1 font-medium">{period.name}</td>
                  <td className="p-2 py-1 text-sm">
                    {formatDateRange(period.startDate, period.endDate)}
                  </td>
                  <td className="p-2 py-1 text-sm">
                    {formatDateShort(period.peakDate)}
                  </td>
                  <td className="p-2 py-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{period.minMultiplier}x</Badge>
                      <span className="text-xs text-muted-foreground">→</span>
                      <Badge variant="default">{period.maxMultiplier}x</Badge>
                    </div>
                  </td>
                  <td className="p-2 py-1 text-right">
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      onClick={() => onEdit(period)}
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
                      onClick={() => onDelete(period.id)}
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
