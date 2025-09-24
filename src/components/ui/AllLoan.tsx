import React from "react";
import Table from "../Table/Table";

import addPrimary from "@/assets/icons/addPrimary.svg";
import rightArrow from "@/assets/icons/rightArrow.svg";
import leftArrow from "@/assets/icons/leftArrow.svg";
import type { Column } from "../Table/Table.types";
import { useNavigate } from "react-router-dom";

export default function () {
  const navigate = useNavigate();

  const columns: Column[] = [
    { header: "LOAN ID", accessor: "phoneNumber" },
    { header: "CLIENT NAME", accessor: "name" },
    { header: "AMOUNT", accessor: "phoneNumber" },
    { header: "TENURE", accessor: "phoneNumber" },
    { header: "AGENT", accessor: "phoneNumber" },
    {
      header: "STATUS",
      accessor: "status",
      render: (value: string) => (
        <span
          className={`px-2 text-[12px] leading-[145%] rounded-[12px] ${
            {
              Approved: "bg-[#0F973D1A] text-[#0F973D]",
              Pending: "bg-[#F3A2181A] text-[#F3A218]",
              Overdue: "bg-[#CB1A141A] text-[#CB1A14]",
            }[value] || "bg-gray-100 text-gray-600" // fallback for unknown values
          }`}
        >
          {value}
        </span>
      ),
    },
    { header: "APPLICATION DATE", accessor: "date" },
    {
      header: "",
      fixed: "right", // ✅ stick this column to the right
      accessor: "id",
      render: (_: any, row: any) => (
        <div
          className="flex items-center gap-3 text-[14px] leading-[145%] font-semibold"
          onClick={() => navigate(`loan-info/${row.id}`)}
        >
          <p className="text-primary cursor-pointer hidden md:block">
            View Details
          </p>
        </div>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      name: "John Yinka",
      phoneNumber: "08123456789",
      status: "Approved",
      date: "2025-09-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      phoneNumber: "08098765432",
      status: "Pending",
      date: "2025-09-02",
    },
    {
      id: 3,
      name: "Michael Brown",
      phoneNumber: "07011223344",
      status: "Overdue",
      date: "2025-09-03",
    },
    {
      id: 4,
      name: "Sophia Johnson",
      phoneNumber: "09033445566",
      status: "Active",
      date: "2025-09-04",
    },
    {
      id: 5,
      name: "David Williams",
      phoneNumber: "08155667788",
      status: "Declined",
      date: "2025-09-05",
    },
  ];

  return (
    <div className="space-y-[22px]">
      <Table columns={columns} data={data} />

      <div className="flex items-center justify-between text-[14px] leadng-[145%] text-gray-700 font-semibold">
        <button className="sm:px-4 px-2 py-2 flex items-center gap-2 border border-gray-300 rounded-[8px] cursor-pointer">
          <img src={addPrimary} className="hidden sm:block" />
          <p className="hidden sm:block">Previous</p>
          <img src={leftArrow} className="block sm:hidden" />
        </button>

        <p>Showing 1–20 of 250 clients</p>

        <button className="sm:px-4 px-2 py-2 flex items-center gap-2 border border-gray-300 rounded-[8px] cursor-pointer">
          <p className="hidden sm:block">Next</p>
          <img src={addPrimary} className="hidden sm:block" />
          <img src={rightArrow} className="block sm:hidden" />
        </button>
      </div>
    </div>
  );
}
