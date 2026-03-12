import { HugeiconsIcon } from "@hugeicons/react";
import {
  PackageIcon,
  Add01Icon,
  PencilEdit01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type PricingPlan } from "./types";

interface PlansCardProps {
  plans: PricingPlan[];
  onAdd: () => void;
  onEdit: (plan: PricingPlan) => void;
  onDelete: (id: string) => void;
}

export function PlansCard({ plans, onAdd, onEdit, onDelete }: PlansCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={PackageIcon} className="size-5" />
          Plans (Packages)
        </CardTitle>
        <Button size="sm" onClick={onAdd}>
          <HugeiconsIcon icon={Add01Icon} className="size-4 mr-1" /> Add Plan
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge>€{plan.basePrice}</Badge>
                    <Badge variant="outline">
                      {plan.includedTeamSize} team
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {plan.includedServices.map((service, idx) => (
                      <Badge
                        key={`${plan.id}-svc-${idx}`}
                        variant="secondary"
                        className="text-xs"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    onClick={() => onEdit(plan)}
                  >
                    <HugeiconsIcon icon={PencilEdit01Icon} className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    className="text-destructive"
                    onClick={() => onDelete(plan.id)}
                  >
                    <HugeiconsIcon icon={Delete01Icon} className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
