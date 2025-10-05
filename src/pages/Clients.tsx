import Button from "@/components/Button/Button";
import PageHeader from "@/components/PageHeader/PageHeader";
import add from "@/assets/icons/add.svg";
import { EllipsisVertical } from "lucide-react";
import { useState, useEffect } from "react";
import CustomTable from "@/components/CustomTable/CustomTable";
import { useNavigate } from "react-router-dom";
import type { CustomTableColumn } from "@/components/CustomTable/CustomTable.types";
import {
  getAllClients,
  getMyClients,
} from "@/services/features/client/clientService";
import type { Client } from "@/services/features/client/client.types";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export default function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"my-clients" | "all-clients">(
    "my-clients"
  );

  // Get user role from Redux
  const { role } = useSelector((state: RootState) => state.auth);

  // Fetch clients based on active tab and user role
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let response;

        // Credit agents can only see their own clients
        if (role === "creditAgent") {
          response = await getMyClients();
        } else {
          // Directors and managers can switch between tabs
          if (activeTab === "my-clients") {
            response = await getMyClients();
          } else {
            response = await getAllClients();
          }
        }

        if (response.success) {
          // Handle both response formats: direct array or wrapped in clients property
          const clientsData = Array.isArray(response.data)
            ? response.data
            : response.data.clients;
          setClients(clientsData);
        } else {
          setError(response.message || "Failed to fetch clients");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [activeTab, role]);

  const columns: CustomTableColumn<Client>[] = [
    {
      header: "CLIENT ID",
      accessor: "clientID",
      sortable: true,
      width: "120px",
      render: (value: string) => (
        <span className="font-mono text-sm text-gray-700">{value}</span>
      ),
    },
    {
      header: "CLIENT NAME",
      accessor: "firstName",
      sortable: true,
      width: "200px",
      render: (_: string, row: Client) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.firstName} {row.lastName}
          </div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      header: "PHONE NUMBER",
      accessor: "phoneNumber",
      sortable: true,
      width: "140px",
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      header: "STATUS",
      accessor: "status",
      sortable: true,
      width: "100px",
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-[12px] leading-[145%] rounded-[12px] font-medium ${
            {
              active: "bg-[#0F973D1A] text-[#0F973D]",
              inactive: "bg-[#F3A2181A] text-[#F3A218]",
              suspended: "bg-[#CB1A141A] text-[#CB1A14]",
              terminated: "bg-[#6B72801A] text-[#6B7280]",
            }[value] || "bg-gray-100 text-gray-600"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      header: "CREATED BY",
      accessor: "createdByRole",
      sortable: true,
      width: "120px",
      render: (value: string) => (
        <span className="text-sm text-gray-600 capitalize">
          {value === "creditAgent" ? "Credit Agent" : value}
        </span>
      ),
    },
    {
      header: "REGISTRATION DATE",
      accessor: "createdAt",
      sortable: true,
      width: "140px",
      render: (value: string) => (
        <div>
          <div className="text-sm text-gray-900">
            {new Date(value).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(value).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      fixed: "right",
      width: "80px",
      render: (_: any, row: Client) => (
        <div
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-md transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/clients/${row._id}`);
          }}
        >
          <EllipsisVertical className="w-5 h-5 text-gray-600" />
        </div>
      ),
    },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Clients${
            role !== "creditAgent"
              ? ` - ${
                  activeTab === "my-clients" ? "My Clients" : "All Clients"
                }`
              : ""
          }`}
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

      {/* Tab Interface for Directors and Managers */}
      {role !== "creditAgent" && (
        <div className="mt-6 mb-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("my-clients")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "my-clients"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              My Clients
            </button>
            <button
              onClick={() => setActiveTab("all-clients")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "all-clients"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Clients
            </button>
          </div>
        </div>
      )}

      {/* Client Count Display */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {clients.length} client{clients.length !== 1 ? "s" : ""}
          {role !== "creditAgent" && (
            <span className="ml-2">
              ({activeTab === "my-clients" ? "My Clients" : "All Clients"})
            </span>
          )}
        </p>
      </div>

      <CustomTable
        data={clients}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search by name, phone number, or client ID"
        searchFields={[
          "firstName",
          "lastName",
          "phoneNumber",
          "clientID",
          "email",
        ]}
        pagination={true}
        pageSize={2}
        showPageSizeSelector={true}
        pageSizeOptions={[5, 10, 20, 50]}
        emptyMessage="No clients found"
        loading={isLoading}
        onRowClick={(row) => navigate(`/clients/${row._id}`)}
      />
    </div>
  );
}
