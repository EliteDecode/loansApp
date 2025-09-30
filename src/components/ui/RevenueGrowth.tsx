"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Box } from "@mui/material";
import money1 from "@/assets/icons/chart-up.svg"; // adjust path

// 7 days data
const data = [
  { day: "Mon", totalRevenue: 50, interestEarned: 15 },
  { day: "Tue", totalRevenue: 65, interestEarned: 30 },
  { day: "Wed", totalRevenue: 20, interestEarned: 25 },
  { day: "Thu", totalRevenue: 80, interestEarned: 60 },
  { day: "Fri", totalRevenue: 35, interestEarned: 20 },
  { day: "Sat", totalRevenue: 60, interestEarned: 50 },
  { day: "Sun", totalRevenue: 40, interestEarned: 35 },
];

export default function RevenueGrowth() {
  return (
    <div className="lg:w-1/2 w-full bg-white p-4 rounded-2xl shadow h-full">
      {/* Header */}
      <div className="flex items-center gap-4 h-16 border-b border-gray-200 w-full">
        <img src={money1} alt="Repayment" className="h-8 w-8" />
        <h1 className="text-[20px] leading-[120%] tracking-[-2%] font-medium text-gray-600">
          Revenue Growth Over Time
        </h1>
      </div>

      {/* Chart */}
      <Box sx={{ width: "100%", height: 420, mt: 2 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="day" />
            <YAxis
              tickFormatter={(val) => `${val}M`} // show values as M
            />
            <Tooltip formatter={(value: number) => [`${value}M`, ""]} />
            <Legend
              iconType="circle"
              verticalAlign="top"
              align="right"
              wrapperStyle={{
                paddingBottom: "10px",
                paddingRight: "20px",
                fontSize: "14px",
                color: "#374151", // Tailwind gray-700
              }}
            />

            {/* Lines */}
            <Line
              type="linear"
              dataKey="totalRevenue"
              stroke="#1E3A8A" // blue
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Total Revenue"
            />
            <Line
              type="linear"
              dataKey="interestEarned"
              stroke="#16A34A" // green
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Interest Earned"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Footer note */}
      <p className="mt-6 text-[16px] leading-[145%] text-gray-700 text-center">
        Last 7 days performance trend
      </p>
    </div>
  );
}
