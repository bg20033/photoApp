import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { type PricingPeriod } from "../types";

interface PricingPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (period: Omit<PricingPeriod, "id">) => void;
  period?: PricingPeriod | null;
  existingPeriods?: PricingPeriod[];
}

export function PricingPeriodModal({
  isOpen,
  onClose,
  onSave,
  period,
  existingPeriods = [],
}: PricingPeriodModalProps) {
  const [name, setName] = useState(period?.name || "");
  const [startDate, setStartDate] = useState(period?.startDate || "");
  const [endDate, setEndDate] = useState(period?.endDate || "");
  const [peakDate, setPeakDate] = useState(period?.peakDate || "");
  const [minMultiplier, setMinMultiplier] = useState(
    period?.minMultiplier ?? 1.0,
  );
  const [maxMultiplier, setMaxMultiplier] = useState(
    period?.maxMultiplier ?? 1.5,
  );
  const [curveWidth, setCurveWidth] = useState(period?.curveWidth ?? 20);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate max allowed curve width based on date range
  const getMaxCurveWidth = () => {
    if (!startDate || !endDate) return 60;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) return 60;
    return Math.max(
      5,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );
  };

  // Get the earliest allowed date (day after the last existing period ends)
  const getEarliestAllowedDate = (): string => {
    if (existingPeriods.length === 0) return "";
    let latestEnd = new Date(0);
    for (const p of existingPeriods) {
      if (period && p.id === period.id) continue;
      const pEnd = new Date(p.endDate);
      if (pEnd > latestEnd) latestEnd = pEnd;
    }
    if (latestEnd.getTime() === 0) return "";
    const nextDay = new Date(latestEnd.getTime() + 86400000);
    return nextDay.toISOString().split("T")[0];
  };

  // Get all blocked dates as an array for reference
  const getBlockedPeriodsInfo = (): string => {
    if (existingPeriods.length === 0) return "";
    const blocked = existingPeriods
      .filter((p) => !period || p.id !== period.id)
      .map((p) => `${p.name} (${p.startDate} to ${p.endDate})`)
      .join(", ");
    return blocked;
  };

  // Auto-adjust curveWidth if it exceeds the new date range
  useEffect(() => {
    const maxAllowed = getMaxCurveWidth();
    if (curveWidth > maxAllowed) {
      setCurveWidth(maxAllowed);
    }
    // Clear peakDate if it's outside the valid range
    if (startDate && endDate && peakDate) {
      const peak = new Date(peakDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (peak < start || peak > end) {
        setPeakDate("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  // Validate dates on change for real-time feedback
  useEffect(() => {
    validateDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, peakDate, curveWidth]);

  const validateDates = () => {
    const newErrors: Record<string, string> = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        newErrors.dateRange = "Start date must be before end date";
      } else {
        const dateRangeDays = Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (curveWidth > dateRangeDays) {
          newErrors.curveWidth = `Curve width cannot exceed ${dateRangeDays} days (the date range)`;
        }

        for (const existingPeriod of existingPeriods) {
          if (period && existingPeriod.id === period.id) continue;

          const existingStart = new Date(existingPeriod.startDate);
          const existingEnd = new Date(existingPeriod.endDate);

          if (start <= existingEnd && end >= existingStart) {
            newErrors.dateRange = `Dates overlap with existing period "${existingPeriod.name}" (${existingPeriod.startDate} to ${existingPeriod.endDate})`;
            break;
          }
        }
      }
    }

    if (peakDate && startDate && endDate) {
      const peak = new Date(peakDate);
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (peak < start || peak > end) {
        newErrors.peakDate = "Peak date must be within the period range";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDates()) return;

    onSave({
      name,
      startDate,
      endDate,
      peakDate,
      minMultiplier,
      maxMultiplier,
      curveWidth,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={period ? "Edit Pricing Period" : "Add Pricing Period"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="periodName">Period Name</Label>
          <Input
            id="periodName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Summer Peak Season"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              lang="en-GB"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
              min={getEarliestAllowedDate() || undefined}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              lang="en-GB"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || getEarliestAllowedDate() || undefined}
              required
            />
          </div>
        </div>

        {getBlockedPeriodsInfo() && (
          <p className="text-xs text-muted-foreground">
            Already occupied: {getBlockedPeriodsInfo()}
          </p>
        )}

        {errors.dateRange && (
          <p className="text-sm text-destructive">{errors.dateRange}</p>
        )}

        <div className="space-y-2">
          <Label htmlFor="peakDate">Peak Date (Highest Price)</Label>
          <Input
            id="peakDate"
            type="date"
            lang="en-GB"
            value={peakDate}
            onChange={(e) => setPeakDate(e.target.value)}
            min={startDate || undefined}
            max={endDate || undefined}
            required
          />
          <p className="text-xs text-muted-foreground">
            The date with maximum pricing multiplier
          </p>
          {errors.peakDate && (
            <p className="text-sm text-destructive">{errors.peakDate}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minMultiplier">Base Multiplier</Label>
            <Input
              id="minMultiplier"
              type="number"
              step="0.05"
              min="0.5"
              max="2"
              value={minMultiplier}
              onChange={(e) => setMinMultiplier(parseFloat(e.target.value))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum price (away from peak)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxMultiplier">Peak Multiplier</Label>
            <Input
              id="maxMultiplier"
              type="number"
              step="0.05"
              min="1"
              max="3"
              value={maxMultiplier}
              onChange={(e) => setMaxMultiplier(parseFloat(e.target.value))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Maximum price (at peak)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="curveWidth">Curve Width (days): {curveWidth}</Label>
          <Input
            id="curveWidth"
            type="range"
            min="5"
            max={getMaxCurveWidth()}
            value={curveWidth}
            onChange={(e) => setCurveWidth(parseInt(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Lower = sharper peak, Higher = gradual slope (max:{" "}
            {getMaxCurveWidth()} days)
          </p>
          {errors.curveWidth && (
            <p className="text-sm text-destructive">{errors.curveWidth}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{period ? "Update" : "Add"}</Button>
        </div>
      </form>
    </Modal>
  );
}
