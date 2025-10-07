import arrowLeft from "@/assets/icons/arrow-left.svg";
import receipt from "@/assets/icons/receipt.svg";
import money from "@/assets/icons/money-1.svg";
import pdf from "@/assets/icons/pdf.svg";
import verified from "@/assets/icons/verifiedGreen.svg";

import Button from "@/components/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getLoanRequestDetails } from "@/services/features/loanRequest/loanRequestService";

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
  approvalDate?: string;
  approvedBy?: string;
  approvedByModel?: string;
  approvedByRole?: string;
  rejectionDate?: string;
  rejectionReason?: string;
}

export default function LoanDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loanRequest, setLoanRequest] = useState<LoanRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch loan request details
  useEffect(() => {
    const fetchLoanDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await getLoanRequestDetails(id);

        if (response.success) {
          setLoanRequest(response.data);
        } else {
          setError(response.message || "Failed to fetch loan details");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanDetails();
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        <Button onClick={() => navigate("/loans")}>Back to Loans</Button>
      </div>
    );
  }

  // No loan data
  if (!loanRequest) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Loan request not found</p>
        <Button onClick={() => navigate("/loans")}>Back to Loans</Button>
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
          back to All Loans
        </p>
      </div>

      <div className="space-y-[25px]">
        <div className="flex lg:items-center justify-between gap-5 lg:flex-row flex-col">
          <div className="space-y-2 md:text-[20px] text-[16px] leading-[120%] tracking-[-2%] text-gray-400 font-medium">
            <div className="flex items-center gap-12 justify-between lg:justify-start">
              <h1 className="md:text-[28px] text-[20px] font-semibold text-gray-700">
                Loan Request: {loanRequest.requestID}
              </h1>
              <div
                className={`px-3 py-1 text-[12px] leading-[145%] w-fit rounded-[12px] ${
                  {
                    approved: "bg-[#0F973D1A] text-[#0F973D]",
                    pending: "bg-[#F3A2181A] text-[#F3A218]",
                    rejected: "bg-[#CB1A141A] text-[#CB1A14]",
                    active: "bg-[#0088FF1A] text-[#0088FF]",
                    completed: "bg-[#0F973D1A] text-[#0F973D]",
                    overdue: "bg-[#CB1A141A] text-[#CB1A14]",
                  }[loanRequest.status] || "bg-gray-100 text-gray-600"
                }`}
              >
                {loanRequest.status.charAt(0).toUpperCase() +
                  loanRequest.status.slice(1)}
              </div>
            </div>

            <p>
              Client: {loanRequest.clientId.firstName}{" "}
              {loanRequest.clientId.lastName}
            </p>
            <p>Created: {formatDate(loanRequest.createdAt)}</p>
            <p>Loan Amount: {formatCurrency(loanRequest.loanAmount)}</p>
          </div>

          <div className="flex lg:flex-row flex-col items-center md:gap-4 gap-2 flex-wrap">
            <Button
              height="h-[55px]"
              width="lg:w-[205px] w-full"
              variant="outline"
              onClick={() => navigate(`/clients/${loanRequest.clientId._id}`)}
            >
              View Client
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
              Loan Information
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 1
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Client Information
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
          </div>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            {/* Loan Information Tab */}
            {activeTab === 0 && (
              <div className="space-y-6 border-[0.6px] border-gray-200 rounded-[12px] w-full">
                <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4 rounded-t-[12px]">
                  <img src={money} alt="money-icon" />
                  <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                    Loan Information
                  </p>
                </div>

                <div className="space-y-4 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Request ID
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700 font-mono">
                        {loanRequest.requestID}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Loan Product
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {loanRequest.loanProductId.productName}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Loan Amount
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700 font-medium">
                        {formatCurrency(loanRequest.loanAmount)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Interest Rate
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {loanRequest.interestRate}% per annum
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Loan Tenure
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {loanRequest.loanTenure} {loanRequest.tenureUnit}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Repayment Frequency
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700 capitalize">
                        {loanRequest.repaymentFrequency}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Payment Amount
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {formatCurrency(loanRequest.paymentAmount)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Total Repayment
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700 font-medium">
                        {formatCurrency(loanRequest.totalRepaymentAmount)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Total Interest
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {formatCurrency(loanRequest.totalInterestAmount)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Grace Period
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {loanRequest.gracePeriod} days
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Repayment Start Date
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {formatDate(loanRequest.repaymentStartDate)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Penalty Rate
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {loanRequest.penaltyRate}%
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">
                      Loan Purpose
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                      {loanRequest.loanPurpose}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">
                      Collateral Description
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                      {loanRequest.collateralDescription}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Client Information Tab */}
            {activeTab === 1 && (
              <div className="space-y-6 border-[0.6px] border-gray-200 rounded-[12px] w-full">
                <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4 rounded-t-[12px]">
                  <img src={receipt} alt="receipt-icon" />
                  <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                    Client Information
                  </p>
                </div>

                <div className="space-y-4 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Client Name
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {loanRequest.clientId.firstName}{" "}
                        {loanRequest.clientId.lastName}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">Email</label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {loanRequest.clientId.email}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Phone Number
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {loanRequest.clientId.phoneNumber}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Bank Name
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {loanRequest.clientBankName}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Account Number
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700 font-mono">
                        {loanRequest.clientAccountNumber}
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
                    Supporting Documents
                  </p>
                </div>

                <div className="space-y-4 p-4">
                  {loanRequest.supportingDocuments &&
                  loanRequest.supportingDocuments.length > 0 ? (
                    loanRequest.supportingDocuments.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between h-16 border border-[#C9CDD3] rounded-[16px] px-3"
                      >
                        <div className="flex items-center gap-2">
                          <img src={pdf} />
                          <a
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[16px] leading-[145%] text-primary hover:text-primary-dark underline"
                          >
                            Supporting Document {index + 1}
                          </a>
                        </div>
                        <img src={verified} />
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                      <p>No supporting documents uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Approval/Rejection Information - Always visible */}
        {(loanRequest.status === "approved" ||
          loanRequest.status === "rejected") && (
          <div className="space-y-6 border-[0.6px] border-gray-200 rounded-[12px] w-full">
            <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4 rounded-t-[12px]">
              <img src={receipt} alt="receipt-icon" />
              <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                {loanRequest.status === "approved"
                  ? "Approval Information"
                  : "Rejection Information"}
              </p>
            </div>

            <div className="space-y-4 p-4">
              {loanRequest.status === "approved" &&
                loanRequest.approvalDate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Approval Date
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {formatDate(loanRequest.approvalDate)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Approved By
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700 capitalize">
                        {loanRequest.approvedByRole} •{" "}
                        {loanRequest.approvedByModel}
                      </div>
                    </div>
                  </div>
                )}

              {loanRequest.status === "rejected" &&
                loanRequest.rejectionDate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Rejection Date
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                        {formatDate(loanRequest.rejectionDate)}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <label className="font-medium text-gray-900">
                        Rejected By
                      </label>
                      <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700 capitalize">
                        {loanRequest.approvedByRole} •{" "}
                        {loanRequest.approvedByModel}
                      </div>
                    </div>
                  </div>
                )}

              {loanRequest.status === "rejected" &&
                loanRequest.rejectionReason && (
                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-medium text-gray-900">
                      Rejection Reason
                    </label>
                    <div className="p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                      {loanRequest.rejectionReason}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
