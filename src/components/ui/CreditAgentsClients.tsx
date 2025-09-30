import rightArrow from "@/assets/icons/rightArrow.svg";
import leftArrow from "@/assets/icons/leftArrow.svg";
import addPrimary from "@/assets/icons/addPrimary.svg";
import Table from "../Table/Table";
import type { Column } from "../Table/Table.types";

export default function CreditAgentsClients() {
  const columns: Column[] = [
    { header: "CLIENT ID", accessor: "date" },
    { header: "LOAN ID", accessor: "phoneNumber" },
    { header: "CLIENT NAME", accessor: "phoneNumber" },
    { header: "LOAN STATUS", accessor: "phoneNumber" },
    {
      header: "REPAYMENT PROGRESS",
      accessor: "phoneNumber",
      fixed: "left",
      render: (_: any) => (
        <div
          className="flex gap-1 flex-col text-[14px] leading-[145%]"
          //   onClick={() => navigate(`/clients/${row.id}`)}
        >
          <div className="w-full h-2 bg-gray-200 rounded-xl overflow-hidden">
            <div
              className={`h-full bg-[#006400] transition-all duration-500`}
              style={{ width: `${70}%` }}
            />
          </div>
          <p className="cursor-pointer text-gray-600">
            65% (₦97,500 / ₦150,000)
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
    <div className="space-y-6">
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
