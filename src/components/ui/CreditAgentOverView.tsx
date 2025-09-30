import CreditAgentMetricsCard from "../CreditAgentMetricsCard/CreditAgentMetricsCard";
import userBlue from "@/assets/icons/userBlue.svg";
import filePurple from "@/assets/icons/filePurple.svg";
import verifiedGreenOutline from "@/assets/icons/verifiedGreenOutline.svg";
import chartDown from "@/assets/icons/chart-down.svg";
import Table from "../Table/Table";
import type { Column } from "../Table/Table.types";
import rightArrow from "@/assets/icons/rightArrow.svg";
import leftArrow from "@/assets/icons/leftArrow.svg";
import addPrimary from "@/assets/icons/addPrimary.svg";

export default function CreditAgentOverView() {
  const columns: Column[] = [
    { header: "DATE AND TIME", accessor: "date" },
    { header: "ACTION", accessor: "phoneNumber" },
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
      <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1  gap-6">
        <CreditAgentMetricsCard
          title="Total Clients Assigned"
          value="247"
          icon={userBlue}
          iconBg="#0088FF1A"
        />
        <CreditAgentMetricsCard
          title="Total Loans Processed"
          value="247"
          icon={filePurple}
          iconBg="#D11EED1A"
        />
        <CreditAgentMetricsCard
          title="Repayment Success Rate"
          value="247"
          icon={verifiedGreenOutline}
          iconBg="#20C9971A"
        />
        <CreditAgentMetricsCard
          title="Default Rate"
          value="12.5%"
          icon={chartDown}
          iconBg="#FF383C1A"
        />
      </div>

      <div className="space-y-6">
        <h1 className="text-[24px] leading-[120%] tracking-[-2%] font-medium text-gray-700">
          Recent Activity
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
    </div>
  );
}
