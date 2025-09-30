"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { PieLabelRenderProps } from "recharts"; // ✅ type-only import
import { Box, Stack } from "@mui/material";
import money1 from "@/assets/icons/money-1.svg"; // adjust path

const data = [
  { name: "Interest Earned", value: 60, color: "#4CAF50" }, // green
  { name: "Penalty Collected", value: 25, color: "#FF9800" }, // orange
  { name: "Late Fees", value: 10, color: "#F44336" }, // red
  { name: "Processing Fees", value: 5, color: "#2196F3" }, // blue
];

// ✅ Safe custom label
const renderLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  // Ensure all props are numbers
  if (
    cx == null ||
    cy == null ||
    midAngle == null ||
    innerRadius == null ||
    outerRadius == null ||
    percent == null
  )
    return null;

  const safeCx = Number(cx);
  const safeCy = Number(cy);
  const safeMidAngle = Number(midAngle);
  const safeInner = Number(innerRadius);
  const safeOuter = Number(outerRadius);
  const safePercent = Number(percent);

  const radius = safeInner + (safeOuter - safeInner) / 2;
  const x = safeCx + radius * Math.cos(-safeMidAngle * (Math.PI / 180));
  const y = safeCy + radius * Math.sin(-safeMidAngle * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fontWeight="bold"
    >
      {`${(safePercent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function RevenueBreakdownChart() {
  return (
    <div className="lg:w-1/2 w-full bg-white p-4 rounded-2xl shadow">
      {/* Header */}
      <div className="flex items-center gap-4 h-16 border-b border-gray-200 w-full">
        <img src={money1} alt="Loan Status" className="h-8 w-8" />
        <h1 className="text-[20px] leading-[120%] tracking-[-2%] font-medium text-gray-600">
          Revenue Breakdown
        </h1>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              stroke="none"
              labelLine={false}
              label={renderLabel}
              outerRadius={150}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
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
