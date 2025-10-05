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
import { getClientDetails } from "@/services/features/client/clientService";
import type { Client } from "@/services/features/client/client.types";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getDirectorProfile } from "@/services/features/director/directorService";
import { getManagerProfile } from "@/services/features/manager/managerService";
import { getAgentProfile } from "@/services/features/agent/agentService";

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
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<ClientWithLoans | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [currentUserProfile, setCurrentUserProfile] =
    useState<ProfileData | null>(null);

  // Get user role from Redux
  const { role } = useSelector((state: RootState) => state.auth);

  // Fetch current user profile
  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      try {
        let response;

        if (role === "director") {
          response = await getDirectorProfile();
        } else if (role === "manager") {
          response = await getManagerProfile();
        } else if (role === "creditAgent") {
          response = await getAgentProfile();
        }

        if (response?.success) {
          setCurrentUserProfile(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch current user profile:", err);
      }
    };

    if (role) {
      fetchCurrentUserProfile();
    }
  }, [role]);

  // Fetch client details
  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await getClientDetails(id);

        if (response.success) {
          setClient(response.data);
        } else {
          setError(response.message || "Failed to fetch client details");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientDetails();
  }, [id]);

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
    return client.creator.email === currentUserProfile.email;
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
  ];

  // Loading state
  if (isLoading) {
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
                {client.firstName} {client.lastName}
              </h1>
              <div
                className={`px-3 py-1 text-[12px] leading-[145%] w-fit rounded-[12px] ${
                  {
                    active: "bg-[#0F973D1A] text-[#0F973D]",
                    inactive: "bg-[#F3A2181A] text-[#F3A218]",
                    suspended: "bg-[#CB1A141A] text-[#CB1A14]",
                    terminated: "bg-[#6B72801A] text-[#6B7280]",
                  }[client.status] || "bg-gray-100 text-gray-600"
                }`}
              >
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </div>
            </div>

            <p>Client ID: {client.clientID}</p>
            <p>Joined: {formatDate(client.createdAt)}</p>
            <p>Email: {client.email}</p>
            <p>Phone: {client.phoneNumber}</p>
          </div>

          <div className="flex lg:flex-row flex-col items-center md:gap-4 gap-2 flex-wrap ">
            {isCurrentUserCreator() && (
              <Button
                height="h-[55px]"
                width="lg:w-[205px] w-full"
                onClick={() => navigate(`/clients/${id}/edit`)}
              >
                Edit Client Info
              </Button>
            )}

            {role === "creditAgent" ? (
              <Button
                height="h-[55px]"
                width="lg:w-[205px] w-full"
                variant="warning"
              >
                Suspend Client
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

            <Button
              height="h-[55px]"
              width="lg:w-[205px] w-full"
              variant="outline"
            >
              Send Reminder
            </Button>
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

                <div className="space-y-4 p-4">
                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">
                      Full Name
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                      {client.firstName} {client.lastName}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">
                      Date of Birth
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                      {formatDate(client.dateOfBirth)} (Age:{" "}
                      {new Date().getFullYear() -
                        new Date(client.dateOfBirth).getFullYear()}
                      )
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">
                      Phone Number
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                      {client.phoneNumber}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">
                      Email Address
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                      {client.email}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">Gender</label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700 capitalize">
                      {client.gender}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">
                      Residential Address
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                      {client.residentialAddress}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">
                      State of Residence
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                      {client.stateOfResidence}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">
                      LGA of Residence
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                      {client.lgaOfResidence}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">
                      Employment Type
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700 capitalize">
                      {client.employmentType}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">
                      Occupation / Business Type
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                      {client.occupationOrBusinessType}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">
                      Monthly Income
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                      {formatCurrency(client.monthlyIncome)}
                    </div>
                  </div>

                  {client.employer && (
                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Employer
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {client.employer}
                      </div>
                    </div>
                  )}

                  {client.workAddress && (
                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Work Address
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {client.workAddress}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">
                      Years in Business
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                      {client.yearsInBusiness} years
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">
                      Created By
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {client.creator.firstName} {client.creator.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {client.creator.email}
                        </div>
                        <div className="text-sm text-gray-600 capitalize">
                          {client.creator.role} •{" "}
                          {client.creator.creditAgentID ||
                            client.creator.managerID ||
                            client.creator.directorID}
                        </div>
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

                <div className="space-y-6 p-4">
                  {/* Primary Guarantor */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Primary Guarantor
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-medium text-gray-900">
                          Full Name
                        </label>
                        <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                          {client.guarantorFullName}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-medium text-gray-900">
                          Relationship
                        </label>
                        <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700 capitalize">
                          {client.guarantorRelationship}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-medium text-gray-900">
                          Phone Number
                        </label>
                        <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                          {client.guarantorPhoneNumber}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-medium text-gray-900">
                          Address
                        </label>
                        <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                          {client.guarantorAddress}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Guarantor */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Secondary Guarantor
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-medium text-gray-900">
                          Full Name
                        </label>
                        <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                          {client.secondaryGuarantorFullName}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-medium text-gray-900">
                          Relationship
                        </label>
                        <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700 capitalize">
                          {client.secondaryGuarantorRelationship}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-medium text-gray-900">
                          Phone Number
                        </label>
                        <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                          {client.secondaryGuarantorPhoneNumber}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 w-full">
                        <label className="font-medium text-gray-900">
                          Address
                        </label>
                        <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                          {client.secondaryGuarantorAddress}
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
                  {client.validNIN && (
                    <div className="flex items-center justify-between h-16 border border-[#C9CDD3] rounded-[16px] px-3">
                      <div className="flex items-center gap-2">
                        <img src={pdf} />
                        <a
                          href={client.validNIN}
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

                  {client.utilityBill && (
                    <div className="flex items-center justify-between h-16 border border-[#C9CDD3] rounded-[16px] px-3">
                      <div className="flex items-center gap-2">
                        <img src={pdf} />
                        <a
                          href={client.utilityBill}
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

                  {client.passport && (
                    <div className="flex items-center justify-between h-16 border border-[#C9CDD3] rounded-[16px] px-3">
                      <div className="flex items-center gap-2">
                        <img src={pdf} />
                        <a
                          href={client.passport}
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

                  {!client.validNIN &&
                    !client.utilityBill &&
                    !client.passport && (
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
                {/* Loan Summary */}
                <div className="border-[0.6px] border-gray-200 rounded-[12px] w-full">
                  <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4 rounded-t-[12px]">
                    <img src={money} alt="money-icon" />
                    <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                      Loan Summary
                    </p>
                  </div>

                  <div className="space-y-4 pb-4 p-4">
                    <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                      <p className="w-full max-w-[130px] text-wrap font-medium">
                        Total Loans:
                      </p>
                      <p>{client.loans.summary.totalLoans}</p>
                    </div>

                    <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                      <p className="w-full max-w-[130px] text-wrap font-medium">
                        Active Loans:
                      </p>
                      <p>{client.loans.summary.totalActiveLoans}</p>
                    </div>

                    <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                      <p className="w-full max-w-[130px] text-wrap font-medium">
                        Total Loan Amount:
                      </p>
                      <p>
                        {formatCurrency(client.loans.summary.totalLoanAmount)}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                      <p className="w-full max-w-[130px] text-wrap font-medium">
                        Total Repayment:
                      </p>
                      <p>
                        {formatCurrency(
                          client.loans.summary.totalRepaymentAmount
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 p-2 px-4 text-[16px] leading-[145%] text-gray-600 border-b border-gray-200">
                      <p className="w-full max-w-[130px] text-wrap font-medium">
                        Monthly Payment:
                      </p>
                      <p>
                        {formatCurrency(
                          client.loans.summary.paymentSummary.monthly
                        )}
                      </p>
                    </div>
                  </div>
                </div>

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
                      data={client.loans.all}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
