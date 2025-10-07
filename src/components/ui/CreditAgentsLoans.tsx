import CustomTable from "../CustomTable/CustomTable";
import type { CustomTableColumn } from "../CustomTable/CustomTable.types";

interface CreditAgentsLoansProps {
  loanRequests?: Array<{
    _id: string;
    amount: number;
    status: string;
    clientId: {
      firstName: string;
      lastName: string;
      email: string;
    };
    creditAgentId: {
      firstName: string;
      lastName: string;
      email: string;
      creditAgentID: string;
    };
  }>;
}

export default function CreditAgentsLoans({
  loanRequests = [],
}: CreditAgentsLoansProps) {
  const columns: CustomTableColumn<any>[] = [
    {
      header: "LOAN ID",
      accessor: "_id",
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value.slice(-6)}</span>
      ),
    },
    {
      header: "CLIENT NAME",
      accessor: "clientId",
      render: (value: any) => (
        <div>
          <p className="font-medium text-gray-900">
            {value.firstName} {value.lastName}
          </p>
          <p className="text-sm text-gray-500">{value.email}</p>
        </div>
      ),
    },
    {
      header: "LOAN AMOUNT",
      accessor: "amount",
      render: (value: number) => (
        <span className="font-medium text-gray-900">
          ₦{value.toLocaleString()}
        </span>
      ),
    },
    {
      header: "STATUS",
      accessor: "status",
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-[12px] leading-[145%] rounded-[12px] font-medium ${
            {
              approved: "bg-[#0F973D1A] text-[#0F973D]",
              pending: "bg-[#F3A2181A] text-[#F3A218]",
              rejected: "bg-[#CB1A141A] text-[#CB1A14]",
              active: "bg-[#0F973D1A] text-[#0F973D]",
              completed: "bg-[#20C9971A] text-[#20C997]",
            }[value.toLowerCase()] || "bg-gray-100 text-gray-600"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      header: "AGENT",
      accessor: "creditAgentId",
      render: (value: any) => (
        <div>
          <p className="font-medium text-gray-900">
            {value.firstName} {value.lastName}
          </p>
          <p className="text-sm text-gray-500">{value.creditAgentID}</p>
        </div>
      ),
    },
  ];

  const data = loanRequests;

  return (
    <div className="space-y-6">
      <CustomTable
        data={data}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search by loan ID, client name, or status"
        searchFields={[
          "_id",
          "clientId.firstName",
          "clientId.lastName",
          "status",
        ]}
        pagination={true}
        pageSize={10}
        showPageSizeSelector={true}
        pageSizeOptions={[5, 10, 20, 50]}
        emptyMessage="No loans processed by this agent"
        loading={false}
      />
    </div>
  );
}
