"use client";

import {
    ResponsiveContainer,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Area,
    Tooltip,
} from "recharts";
import React from "react";

type ChartData = {
    name: string;
    thisWeek: number;
    lastWeek: number;
};

const lineData: ChartData[] = [
    { name: "Jan", thisWeek: 10, lastWeek: 8 },
    { name: "Feb", thisWeek: 30, lastWeek: 20 },
    { name: "Mar", thisWeek: 80, lastWeek: 45 },
    { name: "Apr", thisWeek: 25, lastWeek: 20 },
    { name: "May", thisWeek: 10, lastWeek: 10 },
    { name: "Jun", thisWeek: 50, lastWeek: 40 },
    { name: "Jul", thisWeek: 60, lastWeek: 70 },
    { name: "Aug", thisWeek: 20, lastWeek: 25 },
    { name: "Sep", thisWeek: 40, lastWeek: 35 },
    { name: "Oct", thisWeek: 90, lastWeek: 80 },
    { name: "Nov", thisWeek: 75, lastWeek: 90 },
    { name: "Dec", thisWeek: 50, lastWeek: 40 },
];

// نوع مخصص للـ Tooltip
type CustomTooltipProps = {
    active?: boolean;
    label?: string;
    payload?: { name: string; value: number }[];
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
}) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-[var(--bg-background)] p-4 rounded-xl shadow-lg border border-gray-200 text-sm">
            <p className="font-bold text-[var(--color-accent2)] mb-2">{label}</p>
            {payload.map((entry) => (
                <div
                    key={`${entry.name}-${label}`}
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
};

export default function SchoolPerformanceChart() {
    return (
        <div className="bg-[var(--bg-background)] rounded-lg p-5 col-span-2">
            <div className="flex justify-between mb-5 max-md:flex-col max-md:gap-y-2">
                <h2 className="font-bold text-lg text-[var(--color-accent2)]">
                    School Performance
                </h2>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex flex-col items-center gap-1 text-[var(--color-accent1)]">
                        <span>● This Week</span>
                        <span className="text-[var(--color-accent2)] ml-1 font-bold">
                            1.245
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-[var(--color-accent1)]">
                        <span>● Last Week</span>
                        <span className="text-[var(--color-accent2)] ml-1 font-bold">
                            1.356
                        </span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                    data={lineData}
                    margin={{ top: 0, right: 0, left: -10, bottom: 10 }}
                >
                    <CartesianGrid
                        vertical={true}
                        horizontal={false}
                        stroke="#e5e7eb"
                        strokeDasharray=""
                    />
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
                        dot={(props) => {
                            const { cx, cy, payload } = props as { cx?: number; cy?: number; payload?: ChartData };
                            if (payload?.name === "Mar") {
                                return (
                                    <circle
                                        key={`dot-thisWeek-${payload.name}`} // المفتاح الفريد
                                        cx={cx}
                                        cy={cy}
                                        r={6}
                                        fill="white"
                                        stroke="#facc15"
                                        strokeWidth={5}
                                    />
                                );
                            }
                            return <g key={`empty-${payload?.name}`} />; // حتى العناصر الفاضية ليها key
                        }}
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
        </div>
    );
}