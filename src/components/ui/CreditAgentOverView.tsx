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
import type { CreditAgent } from "@/services/features/agent/agent.types";

interface CreditAgentOverViewProps {
  agent?: CreditAgent;
}

export default function CreditAgentOverView({
  agent,
}: CreditAgentOverViewProps) {
  const columns: Column[] = [
    { header: "DATE AND TIME", accessor: "date" },
    { header: "ACTION", accessor: "phoneNumber" },
  ];

  const data: any[] = [];

  return (
    <div className="space-y-6">
      <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1  gap-6">
        <CreditAgentMetricsCard
          title="Total Clients Assigned"
          value={agent?.statistics?.totalClients?.toString() || "0"}
          icon={userBlue}
          iconBg="#0088FF1A"
        />
        <CreditAgentMetricsCard
          title="Total Loans Processed"
          value={agent?.statistics?.totalLoanRequests?.toString() || "0"}
          icon={filePurple}
          iconBg="#D11EED1A"
        />
        <CreditAgentMetricsCard
          title="Current Salary"
          value={
            agent?.financeRecord?.currentSalary
              ? `₦${agent.financeRecord.currentSalary.toLocaleString()}`
              : "N/A"
          }
          icon={verifiedGreenOutline}
          iconBg="#20C9971A"
        />
        <CreditAgentMetricsCard
          title="Unpaid Amount"
          value={
            agent?.financeRecord?.totalUnpaidAmount
              ? `₦${agent.financeRecord.totalUnpaidAmount.toLocaleString()}`
              : "₦0"
          }
          icon={chartDown}
          iconBg="#FF383C1A"
        />
      </div>

      <div className="space-y-6">
        <h1 className="text-[24px] leading-[120%] tracking-[-2%] font-medium text-gray-700">
          Recent Activity
        </h1>

        {data.length > 0 ? (
          <>
            <Table columns={columns} data={data} />
            <div className="flex items-center justify-between text-[14px] leading-[145%] text-gray-700 font-semibold">
              <button className="sm:px-4 px-2 py-2 flex items-center gap-2 border border-gray-300 rounded-[8px] cursor-pointer">
                <img src={addPrimary} className="hidden sm:block" />
                <p className="hidden sm:block">Previous</p>
                <img src={leftArrow} className="block sm:hidden" />
              </button>

              <p>
                Showing 1–{data.length} of {data.length} activities
              </p>

              <button className="sm:px-4 px-2 py-2 flex items-center gap-2 border border-gray-300 rounded-[8px] cursor-pointer">
                <p className="hidden sm:block">Next</p>
                <img src={addPrimary} className="hidden sm:block" />
                <img src={rightArrow} className="block sm:hidden" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity found</p>
          </div>
        )}
      </div>
    </div>
  );
}
