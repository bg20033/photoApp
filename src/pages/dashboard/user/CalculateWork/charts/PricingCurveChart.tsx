import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import { generateBellCurveData, type PricingPeriod } from "@/lib/pricing";

interface PricingCurveChartProps {
  periods: PricingPeriod[];
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

export function PricingCurveChart({ periods }: PricingCurveChartProps) {
  if (periods.length === 0) {
    return (
      <div className="h-44 flex items-center justify-center text-muted-foreground text-sm">
        No pricing periods configured
      </div>
    );
  }

  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => value?.substring(5) || ""}
          />
          <YAxis
            domain={[0.5, 3]}
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => `${value}x`}
          />
          <Tooltip
            formatter={(value: number | undefined) => [
              `${value?.toFixed(2) ?? "-"}x`,
              "Multiplier",
            ]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          {periods.map((period, idx) => (
            <Area
              key={period.id}
              type="monotone"
              dataKey="multiplier"
              name={period.name}
              data={generateBellCurveData(period)}
              stroke={COLORS[idx % COLORS.length]}
              fill={COLORS[idx % COLORS.length]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
