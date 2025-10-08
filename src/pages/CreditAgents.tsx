import Button from "@/components/Button/Button";
import PageHeader from "@/components/PageHeader/PageHeader";
import add from "@/assets/icons/add.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "@/components/CustomTable/CustomTable";
import type { CustomTableColumn } from "@/components/CustomTable/CustomTable.types";
import profileImage from "@/assets/images/d920cc99a8a164789b26497752374a4d5d852cc9.jpg";
import { getAllCreditAgents } from "@/services/features";
import type { AppDispatch, RootState } from "@/store";
import type { CreditAgent } from "@/services/features/agent/agent.types";

export default function CreditAgents() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get Redux state
  const { creditAgents, isLoading } = useSelector(
    (state: RootState) => state.agent
  );

  // Fetch credit agents on component mount
  useEffect(() => {
    dispatch(getAllCreditAgents());
  }, [dispatch]);

  const columns: CustomTableColumn<CreditAgent>[] = [
    {
      header: "AGENT ID",
      accessor: "creditAgentID",
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      header: "AGENT NAME",
      accessor: "firstName",
      render: (_: any, row: CreditAgent) => (
        <div className="flex items-center gap-3">
          <img
            src={row.passport || profileImage}
            alt={`${row.firstName} ${row.lastName}`}
            className="w-10 h-10 object-cover rounded-full"
            onError={(e) => {
              // Fallback to default image if passport image fails to load
              e.currentTarget.src = profileImage;
            }}
          />
          <div>
            <p className="font-medium text-gray-900">
              {row.firstName} {row.lastName}
            </p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "PHONE NUMBER",
      accessor: "phoneNumber",
      render: (value: string) => <span className="text-gray-700">{value}</span>,
    },
    {
      header: "EMPLOYMENT TYPE",
      accessor: "employmentType",
      render: (value: string) => (
        <span className="capitalize text-gray-700">
          {value.replace("-", " ")}
        </span>
      ),
    },
    {
      header: "SALARY",
      accessor: "financeRecord",
      render: (value: any) => (
        <span className="text-gray-700 font-medium">
          {value?.currentSalary
            ? `₦${value.currentSalary.toLocaleString()}`
            : "Not Available"}
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
    {
      header: "DATE CREATED",
      accessor: "createdAt",
      render: (value: string) => (
        <span className="text-gray-700">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "ACTIONS",
      accessor: "_id",
      sortable: false,
      width: "120px",
      render: (_: string, row: CreditAgent) => (
        <Button
          variant="outline"
          height="h-8"
          width="w-24"
          onClick={() =>
            navigate(`/credit-agents/credit-agents-info/${row._id}`)
          }
        >
          View Details
        </Button>
      ),
    },
  ];

  // Use real data from Redux state
  const data = creditAgents;

  return (
    <div>
      <div className="flex items-center lg:justify-between justify-end">
        <PageHeader
          title="Credit Agents"
          subtitle="Manage and track all credit agents activities"
        />
        <Button
          icon={<img src={add} alt="add" />}
          onClick={() => navigate("/credit-agents/new")}
        >
          Add New Agents
        </Button>
      </div>

      <div className="bg-white rounded-xl space-y-[27.5px]">
        <CustomTable
          data={data}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search by agent ID, name, email, or status"
          searchFields={
            [
              "creditAgentID",
              "firstName",
              "lastName",
              "email",
              "status",
            ] as (keyof CreditAgent)[]
          }
          pagination={true}
          pageSize={10}
          showPageSizeSelector={true}
          pageSizeOptions={[5, 10, 20, 50]}
          emptyMessage="No credit agents found"
          loading={isLoading}
          onRowClick={(row) => {
            navigate(`/credit-agents/credit-agents-info/${row._id}`);
          }}
        />
      </div>
    </div>
  );
}
