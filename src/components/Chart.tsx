"use client";

import React, { useCallback } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  Tooltip,
} from "recharts";

type ChartData = {
  name: string;
  thisWeek: number;
  lastWeek: number;
};

const lineData: ChartData[] = [
  { name: "Jan", thisWeek: 10, lastWeek: 5 },
  { name: "Feb", thisWeek: 30, lastWeek: 20 },
  { name: "Mar", thisWeek: 80, lastWeek: 45 },
  { name: "Apr", thisWeek: 10, lastWeek: 5 },
  { name: "May", thisWeek: 0, lastWeek: 0 },
  { name: "Jun", thisWeek: 50, lastWeek: 40 },
  { name: "Jul", thisWeek: 60, lastWeek: 60 },
  { name: "Aug", thisWeek: 20, lastWeek: 25 },
  { name: "Sep", thisWeek: 40, lastWeek: 35 },
  { name: "Oct", thisWeek: 90, lastWeek: 80 },
  { name: "Nov", thisWeek: 70, lastWeek: 90 },
  { name: "Dec", thisWeek: 50, lastWeek: 40 },
];

type CustomTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: { name: string; value: number }[];
};

const CustomTooltip: React.FC<CustomTooltipProps> = React.memo(
  ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 text-sm">
        <p className="font-bold text-[var(--color-accent2)] mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div
            key={`${entry.name}-${index}`}
            className="flex justify-between gap-6 text-[var(--color-accent1)]"
          >
            <span className="tracking-wide">{entry.name}</span>
            <span className="font-bold tracking-wide text-[var(--color-accent2)]">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
);

export default function SchoolPerformanceChart() {
  const customDot = useCallback(
  (props: { cx?: number; cy?: number; payload?: ChartData, index?: number }) => {
    const { cx, cy, payload } = props;
    if (payload?.name === "Mar") {
      return (
        <circle
          key={`dot-${payload.name}`}
          cx={cx}
          cy={cy}
          r={6}
          fill="white"
          stroke="#facc15"
          strokeWidth={5}
        />
      );
    }
    return <g key={`dot-${payload?.name || 'empty'}`} />;
  },
  []
);


  return (
    <div className="bg-[var(--bg-background)] rounded-2xl p-5 col-span-2">
      <div className="flex justify-between mb-4 max-md:flex-col max-md:gap-y-2">
        <h2 className="font-bold text-lg text-[var(--color-accent2)]">
          School Performance
        </h2>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex flex-col items-center gap-1 text-[var(--color-accent1)]">
            ● This Week{" "}
            <span className="text-[var(--color-accent2)] ml-1 font-bold ">
              1.245
            </span>
          </span>
          <span className="flex flex-col items-center gap-1 text-[var(--color-accent1)]">
            ● Last Week{" "}
            <span className="text-[var(--color-accent2)] ml-1 font-bold ">
              1.356
            </span>
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={lineData}
          margin={{ top: 0, right: 0, left: 0, bottom: 30 }}
        >
          <CartesianGrid vertical horizontal={false} stroke="#e5e7eb" />
          <defs>
            <linearGradient id="colorThisWeek" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#facc15" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLastWeek" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#999", fontSize: 12, dy: 16 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#999", fontSize: 12, dx: -20 }}
          />
          <Tooltip content={<CustomTooltip />} />

          <Area
            type="natural"
            dataKey="thisWeek"
            stroke="#facc15"
            fillOpacity={1}
            fill="url(#colorThisWeek)"
            strokeWidth={4}
            dot={customDot}
          />

          <Area
            type="natural"
            dataKey="lastWeek"
            stroke="#f97316"
            fillOpacity={1}
            fill="url(#colorLastWeek)"
            strokeWidth={4}
          />
        </AreaChart>
      </ResponsiveContainer>

      <p className="sr-only">
        Line chart showing school performance comparison between this week and last week for each month from January to December.
      </p>
    </div>
  );
}
CustomTooltip.displayName = "CustomTooltip"; // ✅ أضف اسم للمكون

