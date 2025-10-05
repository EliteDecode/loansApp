// Manager Types
export interface Manager {
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
  employmentType: "full-time" | "part-time" | "contract" | "self-employed";
  dateOfEmployment: string;
  validNIN: string;
  utilityBill: string;
  passport: string;
  employmentLetter: string;
  canCreateCreditAgents: boolean;
  canApproveLoans: boolean;
  canViewReports: boolean;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export interface ManagerLoginRequest {
  email: string;
  password: string;
}

export interface ManagerLoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: Manager;
  };
}

export interface ManagerCreateRequest {
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
  canCreateCreditAgents: boolean;
  canApproveLoans: boolean;
  canViewReports: boolean;
}

export interface ManagerUpdateRequest {
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
  canCreateCreditAgents?: boolean;
  canApproveLoans?: boolean;
  canViewReports?: boolean;
}

export interface ManagerChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ManagerUpdateProfileRequest {
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

export interface ManagerListResponse {
  success: boolean;
  message: string;
  data: {
    managers: Manager[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface ManagerDetailsResponse {
  success: boolean;
  message: string;
  data: Manager;
}

export interface ManagerState {
  managers: Manager[];
  currentManager: Manager | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
