// Loan Product Types
export interface LoanProduct {
  _id: string;
  productName: string;
  description: string;
  interestRate: number;
  minLoanAmount: number;
  maxLoanAmount: number;
  penaltyRate: number;
  minTenure: number;
  maxTenure: number;
  tenureUnit: "days" | "weeks" | "months" | "years";
  repaymentFrequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  gracePeriod: number;
  requiresCollateral: boolean;
  collateralDescription: string;
  status: "active" | "inactive" | "suspended";
  createdBy: string;
  createdByRole: "director" | "manager";
  createdAt: string;
  updatedAt: string;
}

export interface LoanProductCreateRequest {
  productName: string;
  description: string;
  interestRate: number;
  minLoanAmount: number;
  maxLoanAmount: number;
  penaltyRate: number;
  minTenure: number;
  maxTenure: number;
  tenureUnit: "days" | "weeks" | "months" | "years";
  repaymentFrequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  gracePeriod: number;
  requiresCollateral: boolean;
  collateralDescription: string;
}

export interface LoanProductUpdateRequest {
  productName?: string;
  description?: string;
  interestRate?: number;
  minLoanAmount?: number;
  maxLoanAmount?: number;
  penaltyRate?: number;
  minTenure?: number;
  maxTenure?: number;
  tenureUnit?: "days" | "weeks" | "months" | "years";
  repaymentFrequency?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  gracePeriod?: number;
  requiresCollateral?: boolean;
  collateralDescription?: string;
}

export interface LoanProductListResponse {
  success: boolean;
  message: string;
  data: {
    loanProducts: LoanProduct[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface LoanProductDetailsResponse {
  success: boolean;
  message: string;
  data: LoanProduct;
}

export interface LoanProductState {
  loanProducts: LoanProduct[];
  myLoanProducts: LoanProduct[];
  activeLoanProducts: LoanProduct[];
  currentLoanProduct: LoanProduct | null;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
