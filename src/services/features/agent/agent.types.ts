// Credit Agent Types
export interface CreditAgent {
  _id: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  residentialAddress: string;
  stateOfResidence: string;
  lgaOfResidence: string;
  bankName: string;
  bankAccount: string;
  creditAgentID: string;
  employmentType: "full-time" | "part-time" | "contract" | "self-employed";
  dateOfEmployment: string;
  validNIN: string;
  utilityBill: string;
  passport: string;
  employmentLetter: string;
  financeRecord: {
    currentSalary: number;
    salaryHistory: any[];
    paymentRecords: any[];
    unpaidMonths: string[];
    totalUnpaidAmount: number;
    createdAt: string;
    updatedAt: string;
  };
  clients: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    status: string;
  }>;
  loanRequests: Array<{
    _id: string;
    amount: number;
    status: string;
    clientId: {
      firstName: string;
      lastName: string;
      email: string;
    };
    creditAgentId: {
      firstName: string;
      lastName: string;
      email: string;
      creditAgentID: string;
    };
  }>;
  statistics: {
    totalClients: number;
    totalLoanRequests: number;
  };
  canApproveLoans: boolean;
  canViewReports: boolean;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export interface AgentLoginRequest {
  email: string;
  password: string;
}

export interface AgentLoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: CreditAgent;
  };
}

export interface AgentCreateRequest {
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  residentialAddress: string;
  stateOfResidence: string;
  lgaOfResidence: string;
  bankName: string;
  bankAccount: string;
  employmentType: "full-time" | "part-time" | "contract" | "self-employed";
  dateOfEmployment: string;
  validNIN: string;
  utilityBill: string;
  passport: string;
  employmentLetter: string;
  password: string;
  confirmPassword: string;
  canApproveLoans: boolean;
  canViewReports: boolean;
}

export interface AgentUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  residentialAddress?: string;
  stateOfResidence?: string;
  lgaOfResidence?: string;
  bankName?: string;
  bankAccount?: string;
  employmentType?: "full-time" | "part-time" | "contract" | "self-employed";
  validNIN?: string;
  utilityBill?: string;
  passport?: string;
  employmentLetter?: string;
  canApproveLoans?: boolean;
  canViewReports?: boolean;
}

export interface AgentChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AgentUpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  residentialAddress?: string;
  stateOfResidence?: string;
  lgaOfResidence?: string;
  bankName?: string;
  bankAccount?: string;
  employmentType?: "full-time" | "part-time" | "contract" | "self-employed";
  validNIN?: string;
  utilityBill?: string;
  passport?: string;
  employmentLetter?: string;
}

export interface AgentListResponse {
  success: boolean;
  message: string;
  data: {
    creditAgents: CreditAgent[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface AgentDetailsResponse {
  success: boolean;
  message: string;
  data: CreditAgent;
}

export interface AgentState {
  creditAgents: CreditAgent[];
  currentAgent: CreditAgent | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
