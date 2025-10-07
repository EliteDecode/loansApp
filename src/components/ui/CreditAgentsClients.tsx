import CustomTable from "../CustomTable/CustomTable";
import type { CustomTableColumn } from "../CustomTable/CustomTable.types";

interface CreditAgentsClientsProps {
  clients?: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    status: string;
  }>;
}

export default function CreditAgentsClients({
  clients = [],
}: CreditAgentsClientsProps) {
  const columns: CustomTableColumn<any>[] = [
    {
      header: "CLIENT ID",
      accessor: "_id",
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value.slice(-6)}</span>
      ),
    },
    {
      header: "CLIENT NAME",
      accessor: "firstName",
      render: (_: any, row: any) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.firstName} {row.lastName}
          </p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      header: "PHONE NUMBER",
      accessor: "phoneNumber",
      render: (value: string) => <span className="text-gray-700">{value}</span>,
    },
    {
      header: "STATUS",
      accessor: "status",
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-[12px] leading-[145%] rounded-[12px] font-medium ${
            {
              active: "bg-[#0F973D1A] text-[#0F973D]",
              inactive: "bg-[#F3A2181A] text-[#F3A218]",
              suspended: "bg-[#CB1A141A] text-[#CB1A14]",
            }[value] || "bg-gray-100 text-gray-600"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
  ];

  const data = clients;

  return (
    <div className="space-y-6">
      <CustomTable
        data={data}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search by client name, email, or status"
        searchFields={["firstName", "lastName", "email", "status"]}
        pagination={true}
        pageSize={10}
        showPageSizeSelector={true}
        pageSizeOptions={[5, 10, 20, 50]}
        emptyMessage="No clients assigned to this agent"
        loading={false}
      />
    </div>
  );
}
