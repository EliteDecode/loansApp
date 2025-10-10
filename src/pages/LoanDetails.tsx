import arrowLeft from "@/assets/icons/arrow-left.svg";
import receipt from "@/assets/icons/receipt.svg";
import money from "@/assets/icons/money-1.svg";
import pdf from "@/assets/icons/pdf.svg";
import verified from "@/assets/icons/verifiedGreen.svg";

import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  getLoanRequestDetails, 
  approveLoanRequest, 
  rejectLoanRequest,
  resetLoanRequest 
} from "@/services/features/loanRequest/loanRequestSlice";
import type { RootState, AppDispatch } from "@/store";
import type { DetailedLoanRequest } from "./LoanDetails.types";

export default function LoanDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);
  
  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Get loan request data from Redux store
  const { currentLoanRequest, isFetching, isError, message, isLoading, isSuccess } = useSelector(
    (state: RootState) => state.loanRequest
  );

  // Get user role from auth state
  const { role } = useSelector((state: RootState) => state.auth);

  const loanRequest = currentLoanRequest as DetailedLoanRequest | null;

  // Fetch loan request details using Redux
  useEffect(() => {
    if (id) {
      dispatch(getLoanRequestDetails(id));
    }
  }, [id, dispatch]);

  // Handle success state
  useEffect(() => {
    if (isSuccess && message) {
      // Close modals and refresh data
      setShowApproveModal(false);
      setShowRejectModal(false);
      setRejectionReason("");
      dispatch(resetLoanRequest());
      // Refresh loan details
      if (id) {
        dispatch(getLoanRequestDetails(id));
      }
    }
  }, [isSuccess, message, dispatch, id]);

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

  // Handle approve loan request
  const handleApprove = async () => {
    if (id) {
      dispatch(approveLoanRequest({ requestId: id }));
    }
  };

  // Handle reject loan request
  const handleReject = async () => {
    if (id && rejectionReason.trim()) {
      dispatch(rejectLoanRequest({ 
        requestId: id, 
        rejectionReason: rejectionReason.trim() 
      }));
    }
  };

  // Check if user can approve/reject (director or manager)
  const canApproveReject = (role === "director" || role === "manager") && 
                          loanRequest?.status === "pending";

  // Loading state
  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          {message || "Failed to fetch loan details"}
        </p>
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
                    disbursed: "bg-[#0088FF1A] text-[#0088FF]",
                    defaulted: "bg-[#CB1A141A] text-[#CB1A14]",
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
            
            {/* Approve/Reject buttons for directors and managers */}
            {canApproveReject && (
              <>
                <Button
                  height="h-[55px]"
                  width="lg:w-[150px] w-full"
                  variant="primary"
                  onClick={() => setShowApproveModal(true)}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Approve"}
                </Button>
                <Button
                  height="h-[55px]"
                  width="lg:w-[150px] w-full"
                  variant="danger"
                  onClick={() => setShowRejectModal(true)}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Reject"}
                </Button>
              </>
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
            <button
              onClick={() => setActiveTab(3)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 3
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Repayment Plan
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

                <div className="space-y-6 p-6">
                  {/* Basic Loan Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Basic Loan Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Request ID
                        </span>
                        <p className="text-sm font-medium text-gray-900 font-mono">
                          {loanRequest.requestID}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Loan Product
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {loanRequest.loanProductId.productName}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Product Code
                        </span>
                        <p className="text-sm font-medium text-gray-900 font-mono">
                          {loanRequest.loanProductId.productCode}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Loan Amount
                        </span>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(loanRequest.loanAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Financial Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Interest Rate
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {loanRequest.interestRate}% per annum
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Payment Amount
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(loanRequest.paymentAmount)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Total Repayment
                        </span>
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(loanRequest.totalRepaymentAmount)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Total Interest
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(loanRequest.totalInterestAmount)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Penalty Rate
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {loanRequest.penaltyRate}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Loan Terms */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Loan Terms
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Loan Tenure
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {loanRequest.loanTenure} {loanRequest.tenureUnit}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Repayment Frequency
                        </span>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {loanRequest.repaymentFrequency}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Grace Period
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {loanRequest.gracePeriod} days
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Repayment Start Date
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(loanRequest.repaymentStartDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Product Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Product Information
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Product Description
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {loanRequest.loanProductId.description}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Min Loan Amount
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(
                              loanRequest.loanProductId.minLoanAmount
                            )}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Max Loan Amount
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(
                              loanRequest.loanProductId.maxLoanAmount
                            )}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Min Tenure
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {loanRequest.loanProductId.minTenure}{" "}
                            {loanRequest.loanProductId.tenureUnit}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Max Tenure
                          </span>
                          <p className="text-sm font-medium text-gray-900">
                            {loanRequest.loanProductId.maxTenure}{" "}
                            {loanRequest.loanProductId.tenureUnit}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Requires Collateral
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {loanRequest.loanProductId.requiresCollateral
                            ? "Yes"
                            : "No"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Additional Information
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Loan Purpose
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {loanRequest.loanPurpose}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Collateral Description
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {loanRequest.collateralDescription}
                        </p>
                      </div>
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

                <div className="space-y-6 p-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Client ID
                        </span>
                        <p className="text-sm font-medium text-gray-900 font-mono">
                          {loanRequest.clientId.clientID}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Full Name
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {loanRequest.clientId.firstName}{" "}
                          {loanRequest.clientId.lastName}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Gender
                        </span>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {loanRequest.clientId.gender}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Date of Birth
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(loanRequest.clientId.dateOfBirth)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Email
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {loanRequest.clientId.email}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Phone Number
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {loanRequest.clientId.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Address Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Residential Address
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {loanRequest.clientId.residentialAddress}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          State of Residence
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {loanRequest.clientId.stateOfResidence}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          LGA of Residence
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {loanRequest.clientId.lgaOfResidence}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Employment Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Employment Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Employment Type
                        </span>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {loanRequest.clientId.employmentType.replace(
                            "-",
                            " "
                          )}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Occupation/Business
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {loanRequest.clientId.occupationOrBusinessType}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Monthly Income
                        </span>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(loanRequest.clientId.monthlyIncome)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Years in Business
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {loanRequest.clientId.yearsInBusiness} years
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Employer
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {loanRequest.clientId.employer}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Work Address
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {loanRequest.clientId.workAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Guarantor Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Guarantor Information
                    </h3>
                    <div className="space-y-6">
                      {/* Primary Guarantor */}
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">
                          Primary Guarantor
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="space-y-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">
                              Full Name
                            </span>
                            <p className="text-sm font-medium text-gray-900">
                              {loanRequest.clientId.guarantorFullName}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">
                              Relationship
                            </span>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {loanRequest.clientId.guarantorRelationship}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">
                              Phone Number
                            </span>
                            <p className="text-sm font-medium text-gray-900">
                              {loanRequest.clientId.guarantorPhoneNumber}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">
                              Address
                            </span>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {loanRequest.clientId.guarantorAddress}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Secondary Guarantor */}
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">
                          Secondary Guarantor
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="space-y-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">
                              Full Name
                            </span>
                            <p className="text-sm font-medium text-gray-900">
                              {loanRequest.clientId.secondaryGuarantorFullName}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">
                              Relationship
                            </span>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {
                                loanRequest.clientId
                                  .secondaryGuarantorRelationship
                              }
                            </p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">
                              Phone Number
                            </span>
                            <p className="text-sm font-medium text-gray-900">
                              {
                                loanRequest.clientId
                                  .secondaryGuarantorPhoneNumber
                              }
                            </p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">
                              Address
                            </span>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {loanRequest.clientId.secondaryGuarantorAddress}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Banking Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Banking Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Bank Name
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {loanRequest.clientBankName}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Account Number
                        </span>
                        <p className="text-sm font-medium text-gray-900 font-mono">
                          {loanRequest.clientAccountNumber}
                        </p>
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
                    Documents
                  </p>
                </div>

                <div className="space-y-6 p-4">
                  {/* Client Documents */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Client Documents
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between h-16 border border-[#C9CDD3] rounded-[16px] px-3">
                        <div className="flex items-center gap-2">
                          <img src={pdf} alt="pdf" />
                          <a
                            href={loanRequest.clientId.validNIN}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[16px] leading-[145%] text-primary hover:text-primary-dark underline"
                          >
                            Valid NIN
                          </a>
                        </div>
                        <img src={verified} alt="verified" />
                      </div>
                      <div className="flex items-center justify-between h-16 border border-[#C9CDD3] rounded-[16px] px-3">
                        <div className="flex items-center gap-2">
                          <img src={pdf} alt="pdf" />
                          <a
                            href={loanRequest.clientId.utilityBill}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[16px] leading-[145%] text-primary hover:text-primary-dark underline"
                          >
                            Utility Bill
                          </a>
                        </div>
                        <img src={verified} alt="verified" />
                      </div>
                      <div className="flex items-center justify-between h-16 border border-[#C9CDD3] rounded-[16px] px-3">
                        <div className="flex items-center gap-2">
                          <img src={pdf} alt="pdf" />
                          <a
                            href={loanRequest.clientId.passport}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[16px] leading-[145%] text-primary hover:text-primary-dark underline"
                          >
                            Passport Photo
                          </a>
                        </div>
                        <img src={verified} alt="verified" />
                      </div>
                    </div>
                  </div>

                  {/* Supporting Documents */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Supporting Documents
                    </h3>
                    {loanRequest.supportingDocuments &&
                    loanRequest.supportingDocuments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loanRequest.supportingDocuments.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between h-16 border border-[#C9CDD3] rounded-[16px] px-3"
                          >
                            <div className="flex items-center gap-2">
                              <img src={pdf} alt="pdf" />
                              <a
                                href={doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[16px] leading-[145%] text-primary hover:text-primary-dark underline"
                              >
                                Supporting Document {index + 1}
                              </a>
                            </div>
                            <img src={verified} alt="verified" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 text-gray-500">
                        <p>No supporting documents uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Repayment Plan Tab */}
            {activeTab === 3 && (
              <div className="space-y-6 border-[0.6px] border-gray-200 rounded-[12px] w-full">
                <div className="h-16 flex flex-row gap-2 items-center bg-[#E6EAEF] p-4 rounded-t-[12px]">
                  <img src={money} alt="money-icon" />
                  <p className="md:text-[24px] text-[18px] font-semibold leading-[120%] text-gray-600">
                    Repayment Plan
                  </p>
                </div>

                <div className="space-y-6 p-4">
                  {loanRequest.repaymentPlan ? (
                    <>
                      {/* Repayment Summary */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Repayment Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">
                              Total Installments
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              {loanRequest.repaymentPlan.totalInstallments}
                            </p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">
                              Paid Installments
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {loanRequest.repaymentPlan.paidInstallments}
                            </p>
                          </div>
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">
                              Unpaid Installments
                            </p>
                            <p className="text-2xl font-bold text-orange-600">
                              {loanRequest.repaymentPlan.unpaidInstallments}
                            </p>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">
                              Total Amount
                            </p>
                            <p className="text-2xl font-bold text-purple-600">
                              {formatCurrency(
                                loanRequest.repaymentPlan.totalAmount
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Progress */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Payment Progress
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">
                              Total Paid Amount
                            </p>
                            <p className="text-xl font-bold text-green-600">
                              {formatCurrency(
                                loanRequest.repaymentPlan.totalPaidAmount
                              )}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">
                              Total Unpaid Amount
                            </p>
                            <p className="text-xl font-bold text-red-600">
                              {formatCurrency(
                                loanRequest.repaymentPlan.totalUnpaidAmount
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>
                              {Math.round(
                                (loanRequest.repaymentPlan.paidInstallments /
                                  loanRequest.repaymentPlan.totalInstallments) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${
                                  (loanRequest.repaymentPlan.paidInstallments /
                                    loanRequest.repaymentPlan
                                      .totalInstallments) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Installment Schedule */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Installment Schedule
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                  #
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                  Due Date
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                  Amount
                                </th>
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {loanRequest.repaymentPlan.installments.map(
                                (installment) => (
                                  <tr key={installment._id}>
                                    <td className="border border-gray-300 px-4 py-2">
                                      {installment.installmentNumber}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                      {formatDate(installment.dueDate)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 font-medium">
                                      {formatCurrency(installment.amount)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                          installment.status === "paid"
                                            ? "bg-green-100 text-green-800"
                                            : installment.status === "overdue"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}
                                      >
                                        {installment.status
                                          .charAt(0)
                                          .toUpperCase() +
                                          installment.status.slice(1)}
                                      </span>
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                      <p>No repayment plan available</p>
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

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        closeOnOutsideClick={false}
        title="Approve Loan Request"
        maxWidth="max-w-[500px]"
      >
        <div className="space-y-6 pt-4">
          <div className="text-center">
            <p className="text-[16px] leading-[145%] text-gray-700 mb-4">
              Are you sure you want to approve this loan request?
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Request ID:</strong> {loanRequest?.requestID}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Client:</strong> {loanRequest?.clientId.firstName} {loanRequest?.clientId.lastName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Amount:</strong> {formatCurrency(loanRequest?.loanAmount || 0)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setShowApproveModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleApprove}
              disabled={isLoading}
            >
              {isLoading ? "Approving..." : "Approve Loan"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        closeOnOutsideClick={false}
        title="Reject Loan Request"
        maxWidth="max-w-[600px]"
      >
        <div className="space-y-6 pt-4">
          <div className="text-center">
            <p className="text-[16px] leading-[145%] text-gray-700 mb-4">
              Are you sure you want to reject this loan request?
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-left mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Request ID:</strong> {loanRequest?.requestID}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Client:</strong> {loanRequest?.clientId.firstName} {loanRequest?.clientId.lastName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Amount:</strong> {formatCurrency(loanRequest?.loanAmount || 0)}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejecting this loan request..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={4}
              disabled={isLoading}
            />
            {!rejectionReason.trim() && (
              <p className="text-red-500 text-xs mt-1">
                Rejection reason is required
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason("");
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={isLoading || !rejectionReason.trim()}
            >
              {isLoading ? "Rejecting..." : "Reject Loan"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
