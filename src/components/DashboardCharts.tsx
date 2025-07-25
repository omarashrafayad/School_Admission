"use client";
import React, { useState } from "react";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {
  XAxis, YAxis, ResponsiveContainer, BarChart, Bar, CartesianGrid
} from "recharts";
import SchoolPerformanceChart from "./Chart";

const barData = [
  { name: "Mon", thisWeek: 90, lastWeek: 80 },
  { name: "Tue", thisWeek: 40, lastWeek: 60 },
  { name: "Wed", thisWeek: 70, lastWeek: 50 },
  { name: "Thu", thisWeek: 30, lastWeek: 40 },
  { name: "Fri", thisWeek: 80, lastWeek: 70 },
  { name: "Sat", thisWeek: 60, lastWeek: 90 },
  { name: "Sun", thisWeek: 50, lastWeek: 65 },
];

const dayPickerStyles = {
  day: { width: "100px", color: "var(--color-accent2)" },
  month_grid: { color: "var(--color-accent1)" },
};

const BAR_RADIUS: [number, number, number, number] = [10, 10, 0, 0];

const BAR_SIZE = 13;

export default function DashboardCharts() {
  const [value, setValue] = useState(new Date());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-1 md:col-span-2">
        <SchoolPerformanceChart />
      </div>

      {/* Calendar */}
      <div className="col-span-1">
        <div className="bg-[var(--bg-background)] rounded-2xl p-5 min-h-[426px]">
          <h2 className="font-bold text-lg text-[var(--color-accent2)] mb-4">
            School Calendar
          </h2>
          <DayPicker
            aria-label="School Calendar Date Picker"
            mode="single"
            required
            selected={value || undefined}
            onSelect={setValue}
            className="text-[var(--color-accent2)] overflow-x-auto"
            styles={dayPickerStyles}
          />
        </div>
      </div>

      {/* Finance Chart */}
      <div className="col-span-1">
        <div className="bg-[var(--bg-background)] rounded-2xl p-5 sm:min-h-[430px]">
          <div className="flex justify-between mb-4">
            <h2 className="font-bold text-lg text-[var(--color-accent2)]">
              School Finance
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={345}>
            <BarChart data={barData}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#999", fontSize: 12, dy: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#999", fontSize: 12, dx: -15 }}
              />
              <Bar
                dataKey="lastWeek"
                fill="#f97316"
                radius={BAR_RADIUS}
                barSize={BAR_SIZE}
              />
              <Bar
                dataKey="thisWeek"
                fill="#facc15"
                radius={BAR_RADIUS}
                barSize={BAR_SIZE}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="sr-only">
            Finance chart comparing this week and last week across days Monday to Sunday.
          </p>
        </div>
      </div>
    </div>
  );
}
