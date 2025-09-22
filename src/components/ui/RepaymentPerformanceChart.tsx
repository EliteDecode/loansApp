"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";
import money1 from "@/assets/icons/chart-up.svg"; // adjust path

// Example data
const data = [
  { day: "Mon", value: 40 },
  { day: "Tue", value: 20 },
  { day: "Wed", value: 100 },
  { day: "Thu", value: 50 },
  { day: "Fri", value: 70 },
  { day: "Sat", value: 15 },
  { day: "Sun", value: 10 },
];

export default function () {
  return (
    <div className="lg:w-1/2 w-full bg-white p-4 rounded-2xl shadow h-full">
      {/* Header */}
      <div className="flex items-center gap-4 h-16 border-b border-gray-200 w-full">
        <img src={money1} alt="Repayment" className="h-8 w-8" />
        <h1 className="text-[20px] leading-[120%] tracking-[-2%] font-medium text-gray-600">
          Repayment Performance
        </h1>
      </div>

      {/* Chart */}
      <Box sx={{ width: "100%", height: 420, mt: 2 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              formatter={(val: number) => [
                `${val}% on time payment`,
                "Performance",
              ]}
            />
            <Bar dataKey="value" fill="green" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Footer note */}
      <p className="mt-6 text-[16px] leading-[145%] text-gray-700 text-center">
        Last 7 days performance trend
      </p>
    </div>
  );
}
