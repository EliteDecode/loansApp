import type { Column } from "../Table/Table.types";
import addPrimary from "@/assets/icons/addPrimary.svg";
import rightArrow from "@/assets/icons/rightArrow.svg";
import leftArrow from "@/assets/icons/leftArrow.svg";
import Table from "../Table/Table";

export default function PerformanceReport() {
  const columns: Column[] = [
    { header: "AGENT NAME", accessor: "date" },
    { header: "LOANS ISSUED", accessor: "date" },
    { header: "ACTIVE LOANS", accessor: "date" },
    {
      header: "SUCCESS RATE",
      accessor: "status",
      render: (value: string) => (
        <span
          className={`text-[16px] leading-[145%]  ${
            {
              Approved: "text-[#0F973D]",
              Pending: "text-[#F3A218]",
              Overdue: "text-[#CB1A14]",
            }[value] || "text-gray-600" // fallback for unknown values
          }`}
        >
          {value}
        </span>
      ),
    },
    { header: "AVG. PROCESSING TIME", accessor: "date" },
    { header: "REVENUE GENERATED", accessor: "date" },
  ];

  const data = [
    {
      id: 1,
      principal: "₦41,667",
      interest: "₦6,250",
      totalAmount: "₦850,000",
      balance: "₦850,000",
      date: "Dec 20, 2024",
      status: "Active",
    },
    {
      id: 2,
      principal: "₦30,000",
      interest: "₦4,500",
      totalAmount: "₦450,000",
      balance: "₦320,000",
      date: "Nov 12, 2024",
      status: "Pending",
    },
    {
      id: 3,
      principal: "₦55,000",
      interest: "₦8,250",
      totalAmount: "₦660,000",
      balance: "₦100,000",
      date: "Oct 5, 2024",
      status: "Completed",
    },
    {
      id: 4,
      principal: "₦25,000",
      interest: "₦3,750",
      totalAmount: "₦300,000",
      balance: "₦150,000",
      date: "Sep 18, 2024",
      status: "Overdue",
    },
    {
      id: 5,
      principal: "₦70,000",
      interest: "₦10,500",
      totalAmount: "₦980,000",
      balance: "₦980,000",
      date: "Jan 15, 2025",
      status: "Active",
    },
    {
      id: 6,
      principal: "₦60,000",
      interest: "₦9,000",
      totalAmount: "₦720,000",
      balance: "₦500,000",
      date: "Feb 2, 2025",
      status: "Pending",
    },
    {
      id: 7,
      principal: "₦45,000",
      interest: "₦6,750",
      totalAmount: "₦540,000",
      balance: "₦0",
      date: "Aug 1, 2024",
      status: "Completed",
    },
    {
      id: 8,
      principal: "₦80,000",
      interest: "₦12,000",
      totalAmount: "₦960,000",
      balance: "₦960,000",
      date: "Mar 10, 2025",
      status: "Active",
    },
    {
      id: 9,
      principal: "₦35,000",
      interest: "₦5,250",
      totalAmount: "₦420,000",
      balance: "₦200,000",
      date: "Jul 22, 2024",
      status: "Overdue",
    },
    {
      id: 10,
      principal: "₦50,000",
      interest: "₦7,500",
      totalAmount: "₦600,000",
      balance: "₦600,000",
      date: "Apr 9, 2025",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6 bg-white rounded-xl p-6">
      <h1 className="text-[24px] leading-[120%] tracking-[-2%] font-medium text-gray-700">
        Agent Performance Metrics
      </h1>

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
