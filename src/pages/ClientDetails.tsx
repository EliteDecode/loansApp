import arrowLeft from "@/assets/icons/arrow-left.svg";
import receipt from "@/assets/icons/receipt.svg";
import money from "@/assets/icons/money-1.svg";
import pdf from "@/assets/icons/pdf.svg";
import verified from "@/assets/icons/verifiedGreen.svg";

import Button from "@/components/Button/Button";
import AgentNotesForm from "@/components/ui/AgentNotesForm";
import CustomTable from "@/components/CustomTable/CustomTable";
import type { CustomTableColumn } from "@/components/CustomTable/CustomTable.types";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getClientDetails } from "@/services/features/client/clientSlice";
import type { Client } from "@/services/features/client/client.types";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import SuccessModal from "@/components/modals/SuccessModal/SuccessModal";
import ErrorModal from "@/components/modals/ErrorModal/ErrorModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal/ConfirmationModal";
import { useClientSuspendHook, useProfileHook } from "@/hooks";

// Loan interface based on the API response
interface Loan {
  _id: string;
  requestID: string;
  loanAmount: number;
  paymentAmount: number;
  totalPayments: number;
  repaymentFrequency: string;
  totalRepaymentAmount: number;
  status: string;
  approvalDate?: string;
  rejectionDate?: string;
  rejectionReason?: string;
  createdAt: string;
  loanProductId: {
    _id: string;
    productName: string;
    interestRate: number;
  };
}

// Extended Client interface with loans
interface ClientWithLoans extends Client {
  loans: {
    all: Loan[];
    summary: {
      paymentSummary: {
        daily: number;
        weekly: number;
        monthly: number;
        quarterly: number;
        yearly: number;
        total: number;
      };
      totalLoans: number;
      totalActiveLoans: number;
      totalLoanAmount: number;
      totalRepaymentAmount: number;
    };
  };
}

// Profile data interface
interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  directorID?: string;
  managerID?: string;
  creditAgentID?: string;
  gender?: string;
  dateOfBirth?: string;
  residentialAddress?: string;
  stateOfResidence?: string;
  lgaOfResidence?: string;
  bankName?: string;
  bankAccount?: string;
  employmentType?: string;
  dateOfEmployment?: string;
  status?: string;
  validNIN?: string;
  utilityBill?: string;
  passport?: string;
  employmentLetter?: string;
}

export default function ClientDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const [currentUserProfile, setCurrentUserProfile] =
    useState<ProfileData | null>(null);

  // Get data from Redux store
  const { role } = useSelector((state: RootState) => state.auth);
  const { currentClient, isFetching, isError, message } = useSelector(
    (state: RootState) => state.client
  );

  const client = currentClient as ClientWithLoans | null;
  const error = isError ? message : null;

  // Use the client suspend hook
  const {
    isSuspending,
    showConfirmationModal,
    showSuccessModal,
    showErrorModal,
    errorMessage,
    handleSuspendClick,
    handleConfirmSuspend,
    handleConfirmationClose,
    handleSuccessModalClose,
    handleErrorModalClose,
  } = useClientSuspendHook();

  // Use the profile hook to get current user profile
  const { profileData } = useProfileHook();

  useEffect(() => {
    if (profileData) {
      setCurrentUserProfile(profileData);
    }
  }, [profileData]);

  // Fetch client details using Redux
  useEffect(() => {
    if (id) {
      dispatch(getClientDetails(id));
    }
  }, [id, dispatch]);

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

  // Check if current user is the creator of the client
  const isCurrentUserCreator = () => {
    if (!client || !currentUserProfile) return false;
    return client?.creator.email === currentUserProfile.email;
  };

  // Loan table columns
  const loanColumns: CustomTableColumn<Loan>[] = [
    {
      header: "LOAN ID",
      accessor: "requestID",
      sortable: true,
      width: "120px",
      render: (value: string) => (
        <span className="font-mono text-sm text-gray-700">{value}</span>
      ),
    },
    {
      header: "PRODUCT",
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
      header: "MONTHLY PAYMENT",
      accessor: "paymentAmount",
      sortable: true,
      width: "140px",
      render: (value: number) => (
        <span className="text-gray-700">{formatCurrency(value)}</span>
      ),
    },
    {
      header: "TOTAL REPAYMENT",
      accessor: "totalRepaymentAmount",
      sortable: true,
      width: "140px",
      render: (value: number) => (
        <span className="font-medium text-gray-900">
          {formatCurrency(value)}
        </span>
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
      header: "Actions",
      accessor: "_id",
      fixed: "right",
      width: "120px",
      render: (_: any, row: Loan) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/loans/${row._id}`)}
        >
          View Loan
        </Button>
      ),
    },
  ];

  // Loading state
  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => navigate("/clients")}>Back to Clients</Button>
      </div>
    );
  }

  // No client data
  if (!client) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Client not found</p>
        <Button onClick={() => navigate("/clients")}>Back to Clients</Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 space-y-8">
      <div
        className="flex items-center gap-2 cursor-pointer w-fit"
        onClick={() => navigate(-1)}
      >
        <img src={arrowLeft} alt="arrowLeft" />
        <p className="text-[14px] leading-[145%] text-primary">
          back to All Clients
        </p>
      </div>

      <div className="space-y-[25px]">
        <div className="flex lg:items-center justify-between gap-5 lg:flex-row flex-col">
          <div className="space-y-2 md:text-[20px] text-[16px] leading-[120%] tracking-[-2%] text-gray-400 font-medium">
            <div className="flex items-center gap-12 justify-between lg:justify-start">
              <h1 className="md:text-[28px] text-[20px] font-semibold text-gray-700">
                {client?.firstName} {client?.lastName}
              </h1>
              <div
                className={`px-3 py-1 text-[12px] leading-[145%] w-fit rounded-[12px] ${
                  {
                    active: "bg-[#0F973D1A] text-[#0F973D]",
                    inactive: "bg-[#F3A2181A] text-[#F3A218]",
                    suspended: "bg-[#CB1A141A] text-[#CB1A14]",
                    terminated: "bg-[#6B72801A] text-[#6B7280]",
                  }[client?.status] || "bg-gray-100 text-gray-600"
                }`}
              >
                {client?.status.charAt(0).toUpperCase() +
                  client?.status.slice(1)}
              </div>
            </div>

            <p>Client ID: {client?.clientID}</p>
            <p>Joined: {formatDate(client?.createdAt)}</p>
            <p>Email: {client?.email}</p>
            <p>Phone: {client?.phoneNumber}</p>
          </div>

          <div className="flex lg:flex-row flex-col items-center md:gap-4 gap-2 flex-wrap ">
            {isCurrentUserCreator() && (
              <a href={`/clients/${id}/edit`}>
                <Button height="h-[55px]" width="lg:w-[205px] w-full">
                  Edit Client Info
                </Button>
              </a>
            )}

            {role === "creditAgent" ? (
              <Button
                height="h-[55px]"
                width="lg:w-[205px] w-full"
                variant="warning"
                onClick={handleSuspendClick}
                disabled={isSuspending}
              >
                {isSuspending
                  ? "Processing..."
                  : client?.status === "suspended"
                  ? "Activate Client"
                  : "Suspend Client"}
              </Button>
            ) : (
              <Button
                height="h-[55px]"
                width="lg:w-[205px] w-full"
                variant="success"
              >
                Add Loan
              </Button>
            )}

            {client?.loans?.all?.length > 0 && (
              <Button
                height="h-[55px]"
                width="lg:w-[205px] w-full"
                variant="outline"
              >
                Send Reminder
              </Button>
            )}
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="w-full">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab(0)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 0
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Bio-data
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 1
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Guarantor
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 2
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab(3)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 3
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Loans
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            {/* Bio-data Tab */}
            {activeTab === 0 && (
              <div className="space-y-6 border-[0.6px] border-gray-200 rounded-[12px] w-full">
                <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4 rounded-t-[12px]">
                  <img src={receipt} alt="receipt-icon" />
                  <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                    Bio-data Information
                  </p>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Personal Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                        Personal Information
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Full Name
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {client?.firstName} {client?.lastName}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Date of Birth
                          </span>
                          <p className="text-sm text-gray-700">
                            {formatDate(client?.dateOfBirth)} (Age:{" "}
                            {new Date().getFullYear() -
                              new Date(client?.dateOfBirth).getFullYear()}
                            )
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Gender
                          </span>
                          <p className="text-sm text-gray-700 capitalize">
                            {client?.gender}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Phone Number
                          </span>
                          <p className="text-sm text-gray-700 font-mono">
                            {client?.phoneNumber}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Email Address
                          </span>
                          <p className="text-sm text-gray-700">
                            {client?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                        Address Information
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Residential Address
                          </span>
                          <p className="text-sm text-gray-700">
                            {client?.residentialAddress}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            State of Residence
                          </span>
                          <p className="text-sm text-gray-700">
                            {client?.stateOfResidence}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            LGA of Residence
                          </span>
                          <p className="text-sm text-gray-700">
                            {client?.lgaOfResidence}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Employment Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                        Employment Information
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Employment Type
                          </span>
                          <p className="text-sm text-gray-700 capitalize">
                            {client?.employmentType?.replace("-", " ")}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Occupation/Business
                          </span>
                          <p className="text-sm text-gray-700">
                            {client?.occupationOrBusinessType}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Monthly Income
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(client?.monthlyIncome)}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Years in Business
                          </span>
                          <p className="text-sm text-gray-700">
                            {client?.yearsInBusiness} years
                          </p>
                        </div>
                        {client?.employer && (
                          <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wide">
                              Employer
                            </span>
                            <p className="text-sm text-gray-700">
                              {client?.employer}
                            </p>
                          </div>
                        )}
                        {client?.workAddress && (
                          <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wide">
                              Work Address
                            </span>
                            <p className="text-sm text-gray-700">
                              {client?.workAddress}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Created By Information */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">
                      Created By
                    </h4>
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {client?.creator?.firstName}{" "}
                          {client?.creator?.lastName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {client?.creator?.email}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {client?.creator?.role} •{" "}
                        {client?.creator?.creditAgentID ||
                          client?.creator?.managerID ||
                          client?.creator?.directorID}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Guarantor Tab */}
            {activeTab === 1 && (
              <div className="space-y-6 border-[0.6px] border-gray-200 rounded-[12px] w-full">
                <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4 rounded-t-[12px]">
                  <img src={receipt} alt="guarantor-icon" />
                  <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                    Guarantor Information
                  </p>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Primary Guarantor */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                        Primary Guarantor
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Full Name
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {client?.guarantorFullName}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Relationship
                          </span>
                          <p className="text-sm text-gray-700 capitalize">
                            {client?.guarantorRelationship}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Phone Number
                          </span>
                          <p className="text-sm text-gray-700 font-mono">
                            {client?.guarantorPhoneNumber}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Address
                          </span>
                          <p className="text-sm text-gray-700">
                            {client?.guarantorAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Guarantor */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                        Secondary Guarantor
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Full Name
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {client?.secondaryGuarantorFullName}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Relationship
                          </span>
                          <p className="text-sm text-gray-700 capitalize">
                            {client?.secondaryGuarantorRelationship}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Phone Number
                          </span>
                          <p className="text-sm text-gray-700 font-mono">
                            {client?.secondaryGuarantorPhoneNumber}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Address
                          </span>
                          <p className="text-sm text-gray-700">
                            {client?.secondaryGuarantorAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 2 && (
              <div className="space-y-6 border-[0.6px] border-gray-200 rounded-[12px] w-full">
                <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4 rounded-t-[12px]">
                  <img src={receipt} alt="receipt-icon" />
                  <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                    KYC Documents
                  </p>
                </div>

                <div className="space-y-4 p-4">
                  {client?.validNIN && (
                    <div className="flex items-center justify-between h-16 border border-[#C9CDD3] rounded-[16px] px-3">
                      <div className="flex items-center gap-2">
                        <img src={pdf} />
                        <a
                          href={client?.validNIN}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[16px] leading-[145%] text-primary hover:text-primary-dark underline"
                        >
                          Valid NIN Document
                        </a>
                      </div>
                      <img src={verified} />
                    </div>
                  )}

                  {client?.utilityBill && (
                    <div className="flex items-center justify-between h-16 border border-[#C9CDD3] rounded-[16px] px-3">
                      <div className="flex items-center gap-2">
                        <img src={pdf} />
                        <a
                          href={client?.utilityBill}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[16px] leading-[145%] text-primary hover:text-primary-dark underline"
                        >
                          Utility Bill
                        </a>
                      </div>
                      <img src={verified} />
                    </div>
                  )}

                  {client?.passport && (
                    <div className="flex items-center justify-between h-16 border border-[#C9CDD3] rounded-[16px] px-3">
                      <div className="flex items-center gap-2">
                        <img src={pdf} />
                        <a
                          href={client?.passport}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[16px] leading-[145%] text-primary hover:text-primary-dark underline"
                        >
                          Passport
                        </a>
                      </div>
                      <img src={verified} />
                    </div>
                  )}

                  {!client?.validNIN &&
                    !client?.utilityBill &&
                    !client?.passport && (
                      <div className="flex items-center justify-center h-32 text-gray-500">
                        <p>No documents uploaded</p>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Loans Tab */}
            {activeTab === 3 && (
              <div className="space-y-6">
                {client?.loans.all.length > 0 ? (
                  <>
                    {/* Loan History Table */}
                    <div className="border-[0.6px] border-gray-200 rounded-[12px] w-full">
                      <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4 rounded-t-[12px]">
                        <img src={money} alt="money-icon" />
                        <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                          Loan History
                        </p>
                      </div>

                      <div className="p-4">
                        <CustomTable
                          data={client?.loans.all}
                          columns={loanColumns}
                          searchable={true}
                          searchPlaceholder="Search loans by ID, product, or status"
                          searchFields={["requestID", "status"]}
                          pagination={true}
                          pageSize={5}
                          showPageSizeSelector={true}
                          pageSizeOptions={[5, 10, 20]}
                          emptyMessage="No loans found for this client"
                          loading={false}
                        />
                      </div>
                    </div>

                    {/* Credit Agent Feedback or Agent Notes */}
                    {role === "creditAgent" ? (
                      <div className="border-[0.6px] border-gray-200 rounded-[12px] w-full">
                        <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4 rounded-t-[12px]">
                          <img src={receipt} alt="money-icon" />
                          <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                            Credit Agents Feedback
                          </p>
                        </div>

                        <div className="py-6 px-4 text-[16px] leading-[145%] text-gray-700">
                          Client is very cooperative and has excellent payment
                          history. Recommended for higher loan amounts in future
                          applications.
                        </div>
                      </div>
                    ) : (
                      <AgentNotesForm />
                    )}
                  </>
                ) : (
                  /* No Loans State */
                  <div className="border-[0.6px] border-gray-200 rounded-[12px] w-full">
                    <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4 rounded-t-[12px]">
                      <img src={money} alt="money-icon" />
                      <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                        Loan Information
                      </p>
                    </div>

                    <div className="py-12 px-4 text-center">
                      <div className="text-gray-500 mb-4">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No loans by this user
                      </h3>
                      <p className="text-gray-500 mb-6">
                        This client has not applied for any loans yet.
                      </p>
                      <Button
                        variant="success"
                        onClick={() =>
                          navigate(`/loan-requests?clientId=${client?._id}`)
                        }
                        className="px-6"
                      >
                        Add Loan
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmationModal}
        onClose={handleConfirmationClose}
        onConfirm={() =>
          client && handleConfirmSuspend(client?._id, client?.status)
        }
        title={
          client?.status === "suspended" ? "Activate Client" : "Suspend Client"
        }
        message={
          client?.status === "suspended"
            ? "Are you sure you want to activate this client? This will restore their access to the system."
            : "Are you sure you want to suspend this client? This will restrict their access to the system."
        }
        confirmText={client?.status === "suspended" ? "Activate" : "Suspend"}
        cancelText="Cancel"
        variant="warning"
        loading={isSuspending}
      />

      {/* Success Modal */}
      <SuccessModal
        open={showSuccessModal}
        onClose={handleSuccessModalClose}
        title={
          client?.status === "suspended"
            ? "Client Activated Successfully!"
            : "Client Suspended Successfully!"
        }
        message={
          client?.status === "suspended"
            ? "The client has been activated and can now access the system."
            : "The client has been suspended and their access has been restricted."
        }
        confirmText="OK"
        onConfirm={handleSuccessModalClose}
      />

      {/* Error Modal */}
      <ErrorModal
        open={showErrorModal}
        onClose={handleErrorModalClose}
        message={errorMessage}
        showRetry={true}
        retryText="Try Again"
        onRetry={handleErrorModalClose}
      />
    </div>
  );
}
