import PageHeader from "@/components/PageHeader/PageHeader";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store";
import {
  getAllLoanRequests,
  getMyLoanRequests,
} from "@/services/features/loanRequest/loanRequestService";
import CustomTable from "@/components/CustomTable/CustomTable";
import type { CustomTableColumn } from "@/components/CustomTable/CustomTable.types";
import Button from "@/components/Button/Button";

// Loan Request interface based on the API response
interface LoanRequest {
  _id: string;
  requestID: string;
  clientId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  loanProductId: {
    _id: string;
    productName: string;
    interestRate: number;
    minLoanAmount: number;
    maxLoanAmount: number;
  };
  loanAmount: number;
  loanTenure: number;
  tenureUnit: string;
  repaymentFrequency: string;
  repaymentStartDate: string;
  loanPurpose: string;
  clientAccountNumber: string;
  clientBankName: string;
  collateralDescription: string;
  supportingDocuments: string[];
  status: string;
  createdBy: string;
  createdByRole: string;
  createdByModel: string;
  interestRate: number;
  penaltyRate: number;
  gracePeriod: number;
  totalInterestAmount: number;
  paymentAmount: number;
  totalPayments: number;
  totalRepaymentAmount: number;
  createdAt: string;
  updatedAt: string;
}

export default function Loans() {
  const navigate = useNavigate();
  const { role } = useSelector((state: RootState) => state.auth);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch loan requests based on user role and active tab
  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let response;
        if (role === "creditAgent") {
          response = await getMyLoanRequests();
        } else {
          // Directors and Managers can switch between "My" and "All" loan requests
          if (activeTab === 0) {
            response = await getMyLoanRequests();
          } else {
            response = await getAllLoanRequests();
          }
        }

        if (response.success) {
          setLoanRequests(response.data.loanRequests);
        } else {
          setError(response.message || "Failed to fetch loan requests");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanRequests();
  }, [role, activeTab]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Table columns
  const columns: CustomTableColumn<LoanRequest>[] = [
    {
      header: "CLIENT",
      accessor: "clientId",
      sortable: true,
      width: "200px",
      render: (value: any, row: LoanRequest) => (
        <div>
          <div className="font-medium text-gray-900">
            {value.firstName} {value.lastName}
          </div>
          <div className="text-sm text-gray-500">{value.phoneNumber}</div>
          <div className="text-xs text-gray-400 font-mono">{row.requestID}</div>
        </div>
      ),
    },
    {
      header: "LOAN PRODUCT",
      accessor: "loanProductId",
      sortable: true,
      width: "180px",
      render: (value: any) => (
        <div>
          <div className="font-medium text-gray-900">{value.productName}</div>
          <div className="text-sm text-gray-500">
            {value.interestRate}% interest
          </div>
        </div>
      ),
    },
    {
      header: "LOAN AMOUNT",
      accessor: "loanAmount",
      sortable: true,
      width: "140px",
      render: (value: number) => (
        <span className="font-medium text-gray-900">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      header: "TENURE",
      accessor: "loanTenure",
      sortable: true,
      width: "120px",
      render: (value: number, row: LoanRequest) => (
        <span className="text-gray-700">
          {value} {row.tenureUnit}
        </span>
      ),
    },
    {
      header: "REPAYMENT",
      accessor: "totalRepaymentAmount",
      sortable: true,
      width: "160px",
      render: (value: number, row: LoanRequest) => (
        <div>
          <div className="font-medium text-gray-900">
            {formatCurrency(value)}
          </div>
          <div className="text-sm text-gray-500 capitalize">
            {row.repaymentFrequency}
          </div>
        </div>
      ),
    },
    {
      header: "STATUS",
      accessor: "status",
      sortable: true,
      width: "120px",
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-[12px] leading-[145%] rounded-[12px] font-medium ${
            {
              approved: "bg-[#0F973D1A] text-[#0F973D]",
              pending: "bg-[#F3A2181A] text-[#F3A218]",
              rejected: "bg-[#CB1A141A] text-[#CB1A14]",
              active: "bg-[#0088FF1A] text-[#0088FF]",
              completed: "bg-[#0F973D1A] text-[#0F973D]",
              overdue: "bg-[#CB1A141A] text-[#CB1A14]",
            }[value.toLowerCase()] || "bg-gray-100 text-gray-600"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      header: "CREATED DATE",
      accessor: "createdAt",
      sortable: true,
      width: "120px",
      render: (value: string) => (
        <span className="text-sm text-gray-600">{formatDate(value)}</span>
      ),
    },
    {
      header: "ACTIONS",
      accessor: "_id",
      sortable: false,
      width: "120px",
      render: (value: string, row: LoanRequest) => (
        <Button
          variant="outline"
          height="h-8"
          width="w-24"
          onClick={() => navigate(`/loans/${row.requestID}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Loan Requests"
          subtitle="Manage and track loan applications"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <PageHeader
          title="Loan Requests"
          subtitle="Manage and track loan applications"
        />
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get dynamic title based on role and active tab
  const getPageTitle = () => {
    if (role === "creditAgent") {
      return "My Loan Requests";
    }
    return activeTab === 0 ? "My Loan Requests" : "All Loan Requests";
  };

  return (
    <div>
      <PageHeader
        title={getPageTitle()}
        subtitle="Manage and track loan applications"
      />

      <div className="p-4 md:p-6 bg-white rounded-[12px]">
        {/* Role-based tabs for Directors and Managers */}
        {(role === "director" || role === "manager") && (
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab(0)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 0
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Loan Requests
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 1
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Loan Requests
              </button>
            </div>
          </div>
        )}

        {/* Custom Table */}
        <CustomTable
          data={loanRequests}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search by request ID, client name, or status"
          searchFields={["requestID", "status"]}
          pagination={true}
          pageSize={10}
          showPageSizeSelector={true}
          pageSizeOptions={[5, 10, 20, 50]}
          emptyMessage="No loan requests found"
          loading={isLoading}
          onRowClick={(row) => {
            // TODO: Navigate to loan request details
            console.log("Navigate to loan request:", row._id);
          }}
        />
      </div>
    </div>
  );
}
