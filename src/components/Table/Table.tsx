import React, { useState } from "react";
import type { TableProps } from "./Table.types";

type TableWithSelectProps = TableProps & {
  selectable?: boolean; // ✅ optional
  onSelectionChange?: (selectedRows: any[]) => void;
};

export default function Table({
  columns,
  data,
  selectable = false,
  onSelectionChange,
}: TableWithSelectProps) {
  const [selected, setSelected] = useState<any[]>([]);

  const toggleRow = (row: any) => {
    const isSelected = selected.some((r) => r.id === row.id);
    const updated = isSelected
      ? selected.filter((r) => r.id !== row.id)
      : [...selected, row];

    setSelected(updated);
    onSelectionChange?.(updated);
  };

  const toggleAll = () => {
    if (selected.length === data.length) {
      setSelected([]);
      onSelectionChange?.([]);
    } else {
      setSelected(data);
      onSelectionChange?.(data);
    }
  };

  return (
    <div className="overflow-x-auto relative">
      <table className="w-full min-w-[1000px] border border-gray-200 rounded-lg overflow-hidden">
        {/* Head */}
        <thead className="bg-gray-100 text-left uppercase">
          <tr>
            {selectable && (
              <th className="px-4 py-4">
                <input
                  type="checkbox"
                  checked={selected.length === data.length && data.length > 0}
                  onChange={toggleAll}
                  className="border-[1.5px] border-gray-300 w-6 h-6 rounded accent-primary"
                />
              </th>
            )}
            {columns?.map((col, idx) => (
              <th
                key={idx}
                className={`px-4 py-4 text-[16px] leading-[145%] font-medium text-gray-700 ${
                  col.fixed === "right" ? "sticky right-0 bg-gray-100 " : ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {data?.length > 0 ? (
            data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-100 transition-colors">
                {selectable && (
                  <td className="px-4 py-[16.5px] border-b border-gray-200">
                    <input
                      type="checkbox"
                      checked={selected.some((r) => r.id === row.id)}
                      onChange={() => toggleRow(row)}
                      className="border-[1.5px] border-gray-300 w-6 h-6 rounded accent-primary"
                    />
                  </td>
                )}
                {columns.map((col, idx) => (
                  <td
                    key={idx}
                    className={`px-4 py-[16.5px] text-[16px] leading-[145%] text-gray-500 border-b border-gray-200 ${
                      col.fixed === "right"
                        ? "sticky right-10 flex items-end justify-end"
                        : ""
                    }`}
                  >
                    {col.render
                      ? col.render(row[col.accessor], row)
                      : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns?.length + (selectable ? 1 : 0)}
                className="text-center py-6 text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
