// Client Types
export interface Client {
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
  employmentType:
    | "employed"
    | "self-employed"
    | "business-owner"
    | "unemployed";
  occupationOrBusinessType: string;
  monthlyIncome: number;
  employer: string | null;
  workAddress: string | null;
  yearsInBusiness: number;
  guarantorFullName: string;
  guarantorRelationship: string;
  guarantorPhoneNumber: string;
  guarantorAddress: string;
  secondaryGuarantorFullName: string;
  secondaryGuarantorRelationship: string;
  secondaryGuarantorPhoneNumber: string;
  secondaryGuarantorAddress: string;
  validNIN: string;
  utilityBill: string;
  passport: string;
  clientID: string;
  status: "active" | "inactive" | "suspended" | "terminated";
  createdBy: string;
  createdByRole: "director" | "manager" | "creditAgent";
  createdByModel: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    creditAgentID?: string;
    managerID?: string;
    directorID?: string;
    role: "director" | "manager" | "creditAgent";
    model: "Director" | "Manager" | "CreditAgent";
  };
}

export interface ClientCreateRequest {
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  residentialAddress: string;
  stateOfResidence: string;
  lgaOfResidence: string;
  employmentType:
    | "employed"
    | "self-employed"
    | "business-owner"
    | "unemployed";
  occupationOrBusinessType: string;
  monthlyIncome: number;
  employer: string | null;
  workAddress: string | null;
  yearsInBusiness: number;
  guarantorFullName: string;
  guarantorRelationship: string;
  guarantorPhoneNumber: string;
  guarantorAddress: string;
  secondaryGuarantorFullName: string;
  secondaryGuarantorRelationship: string;
  secondaryGuarantorPhoneNumber: string;
  secondaryGuarantorAddress: string;
  validNIN: string;
  utilityBill: string;
  passport: string;
}

export interface ClientUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  residentialAddress?: string;
  stateOfResidence?: string;
  lgaOfResidence?: string;
  employmentType?: "full-time" | "part-time" | "contract" | "self-employed";
  occupationOrBusinessType?: string;
  monthlyIncome?: number;
  employer?: string;
  workAddress?: string;
  yearsInBusiness?: number;
  guarantorFullName?: string;
  guarantorRelationship?: string;
  guarantorPhoneNumber?: string;
  guarantorAddress?: string;
  secondaryGuarantorFullName?: string;
  secondaryGuarantorRelationship?: string;
  secondaryGuarantorPhoneNumber?: string;
  secondaryGuarantorAddress?: string;
  validNIN?: string;
  utilityBill?: string;
  passport?: string;
}

export interface ClientToggleStatusRequest {
  status: "active" | "inactive" | "suspended";
}

export interface ClientListResponse {
  success: boolean;
  message: string;
  data: {
    clients: Client[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface ClientDetailsResponse {
  success: boolean;
  message: string;
  data: Client;
}

export interface ClientState {
  clients: Client[];
  myClients: Client[];
  currentClient: Client | null;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
