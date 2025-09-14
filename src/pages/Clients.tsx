import Button from "@/components/Button/Button";
import PageHeader from "@/components/PageHeader/PageHeader";
import add from "@/assets/icons/add.svg";
import addPrimary from "@/assets/icons/addPrimary.svg";
import rightArrow from "@/assets/icons/rightArrow.svg";
import leftArrow from "@/assets/icons/leftArrow.svg";
import { EllipsisVertical, Search } from "lucide-react";
import { useState } from "react";
import Table from "@/components/Table/Table";
import { useNavigate } from "react-router-dom";
import type { Column } from "@/components/Table/Table.types";

export default function Clients() {
  const navigate = useNavigate();
  const [age, setAge] = useState("");

  const columns: Column[] = [
    { header: "CLIENT NAME", accessor: "name" },
    { header: "PHONE  NUMBER", accessor: "phoneNumber" },
    {
      header: "LOAN STATUS",
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
    { header: "REGISTRATION DATE", accessor: "date" },
    {
      header: "Actions",
      fixed: "right", // ✅ stick this column to the right
      accessor: "id",
      render: (_: any, row: any) => (
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/clients/${row.id}`)}
        >
          <EllipsisVertical className="hidden md:block" />

          <p className="block md:hidden text-[14px] leading-[145%] font-semibold text-primary">
            Details
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
    <div>
      <div className="flex items-center justify-between">
        <PageHeader
          title="Clients"
          subtitle="Welcome back! Here's your loan portfolio overview"
        />

        <div className="hidden lg:block">
          <Button
            variant="primary"
            icon={<img src={add} alt="+" />}
            onClick={() => navigate("/clients/new")}
          >
            Add New Clients
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 space-y-[22px]">
        <div className="flex items-center justify-between">
          <div className="lg:max-w-[517px] w-full relative">
            <input
              placeholder="Search by name, phone number, or client ID"
              className="h-10 w-full pl-10 pr-3 outline-0 bg-[#F9FAFB] shadow-[0px_1px_2px_0px_#1018280D] rounded-[6px] text-[14px] leading-[145%] placeholder:text-[#667185]"
            />

            <Search className="absolute top-2 left-3 w-5 h-5" color="#475367" />
          </div>

          <div className="space-x-4 hidden md:block">
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="py-3 px-4 bg-gray-50 border border-gray-100 rounded-[8px] text-gray-700 text-[16px] leading-[145%] outline-none"
            >
              <option value="">Status</option>
              <option value={10}>Ten</option>xw
              <option value={20}>Twenty</option>
              <option value={30}>Thirty</option>
            </select>

            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="py-3 px-4 bg-gray-50 border border-gray-100 rounded-[8px] text-gray-700 text-[16px] leading-[145%] outline-none"
            >
              <option value="">Date Added</option>
              <option value={10}>Ten</option>xw
              <option value={20}>Twenty</option>
              <option value={30}>Thirty</option>
            </select>
          </div>
        </div>
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
    </div>
  );
}
