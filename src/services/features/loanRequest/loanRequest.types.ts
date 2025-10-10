// Loan Request Types
export interface LoanRequest {
  _id: string;
  clientId: string;
  loanProductId: string;
  loanAmount: number;
  loanTenure: number;
  tenureUnit: "days" | "weeks" | "months" | "years";
  repaymentFrequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  repaymentStartDate: string;
  loanPurpose: string;
  clientAccountNumber: string;
  clientBankName: string;
  collateralDescription: string;
  supportingDocuments: string[];
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "disbursed"
    | "completed"
    | "defaulted";
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  disbursedAt?: string;
  completedAt?: string;
  createdBy: string;
  createdByRole: "director" | "manager" | "creditAgent";
  createdAt: string;
  updatedAt: string;
  // Populated fields
  client?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  loanProduct?: {
    _id: string;
    productName: string;
    interestRate: number;
    maxLoanAmount: number;
    maxTenure: number;
    tenureUnit: string;
  };
}

export interface LoanRequestCreateRequest {
  clientId: string;
  loanProductId: string;
  loanAmount: number;
  loanTenure: number;
  tenureUnit: "days" | "weeks" | "months" | "years";
  repaymentFrequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  repaymentStartDate: string;
  loanPurpose: string;
  clientAccountNumber: string;
  clientBankName: string;
  collateralDescription: string;
  supportingDocuments: string[];
}

export interface LoanRequestUpdateRequest {
  loanAmount?: number;
  loanTenure?: number;
  tenureUnit?: "days" | "weeks" | "months" | "years";
  repaymentFrequency?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  repaymentStartDate?: string;
  loanPurpose?: string;
  clientAccountNumber?: string;
  clientBankName?: string;
  collateralDescription?: string;
  supportingDocuments?: string[];
}

export interface LoanRequestApproveRequest {
  approvedAmount?: number;
  approvedTenure?: number;
  notes?: string;
}

export interface LoanRequestRejectRequest {
  rejectionReason: string;
}

export interface LoanRequestListResponse {
  success: boolean;
  message: string;
  data: {
    loanRequests: LoanRequest[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface LoanRequestDetailsResponse {
  success: boolean;
  message: string;
  data: LoanRequest;
}

export interface LoanRequestState {
  loanRequests: LoanRequest[];
  myLoanRequests: LoanRequest[];
  pendingLoanRequests: LoanRequest[];
  currentLoanRequest: LoanRequest | null;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
