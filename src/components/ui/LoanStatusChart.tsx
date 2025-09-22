"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Typography, Stack } from "@mui/material";
import money1 from "@/assets/icons/money-1.svg"; // adjust path

const data = [
  { name: "Approved", value: 60, color: "#4CAF50" }, // green
  { name: "Pending", value: 25, color: "#FF9800" }, // orange
  { name: "Overdue", value: 10, color: "#F44336" }, // red
  { name: "Rejected", value: 5, color: "#2196F3" }, // blue
];

export default function LoanStatusChart() {
  return (
    <div className="lg:w-1/2 w-full bg-white p-4 rounded-2xl shadow">
      {/* Header */}
      <div className="flex items-center gap-4 h-16 border-b border-gray-200 w-full">
        <img src={money1} alt="Loan Status" className="h-8 w-8" />
        <h1 className="text-[20px] leading-[120%] tracking-[-2%] font-medium text-gray-600">
          Loan Status Breakdown
        </h1>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full flex items-center justify-center">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={110}
            outerRadius={160}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Legend */}
      <Stack spacing={2} sx={{ mt: 2 }} px={4}>
        {Array.from({ length: Math.ceil(data.length / 2) }, (_, rowIdx) => (
          <Stack
            key={rowIdx}
            direction="row"
            spacing={4}
            alignItems="center"
            justifyContent="flex-start"
          >
            {data.slice(rowIdx * 2, rowIdx * 2 + 2).map((item, i) => (
              <Stack
                key={i}
                direction="row"
                spacing={1}
                alignItems="center"
                width={"100%"}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: item.color,
                    borderRadius: "3px",
                  }}
                />
                <p className="text-[16px] leading-[145%] text-gray-700">
                  {item.name} ({item.value}%)
                </p>
              </Stack>
            ))}
          </Stack>
        ))}
      </Stack>
    </div>
  );
}
