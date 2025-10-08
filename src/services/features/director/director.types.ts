// Director Types
export interface Director {
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
  isMainDirector: boolean;
  canShutdownSystem: boolean;
  canFreezeAccounts: boolean;
  canCreateDirectors: boolean;
  canCreateManagers: boolean;
  canCreateCreditAgents: boolean;
  canApproveLoans: boolean;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export interface DirectorLoginRequest {
  email: string;
  password: string;
}

export interface DirectorLoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: Director;
  };
}

export interface DirectorCreateRequest {
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
  isMainDirector: boolean;
  canShutdownSystem: boolean;
  canFreezeAccounts: boolean;
  canCreateDirectors: boolean;
  canCreateManagers: boolean;
  canCreateCreditAgents: boolean;
  canApproveLoans: boolean;
}

export interface DirectorUpdateRequest {
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
  canShutdownSystem?: boolean;
  canFreezeAccounts?: boolean;
  canCreateDirectors?: boolean;
  canCreateManagers?: boolean;
  canCreateCreditAgents?: boolean;
  canApproveLoans?: boolean;
}

export interface DirectorChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DirectorUpdateProfileRequest {
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

export interface SystemControlRequest {
  targetUserId?: string;
  reason: string;
}

export interface SystemStatus {
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  isShutdown: boolean;
  shutdownAt: string | null;
  shutdownBy: string | null;
  shutdownByRole: string | null;
  shutdownReason: string | null;
}

export interface SystemSettings {
  systemStatus: SystemStatus;
  lastUpdated: string;
}

export interface SystemSettingsResponse {
  success: boolean;
  message: string;
  data: SystemSettings;
}

export interface DirectorListResponse {
  success: boolean;
  message: string;
  data: {
    directors: Director[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface DirectorDetailsResponse {
  success: boolean;
  message: string;
  data: Director;
}

export interface DirectorState {
  directors: Director[];
  currentDirector: Director | null;
  settings: SystemSettings | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
