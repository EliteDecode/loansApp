import axiosClient from "@/services/api/axiosClient";

// Authentication - Now handled by auth service

// Profile Management
export const getManagerProfile = async () => {
  const response = await axiosClient.get("/manager/me");
  return response.data;
};

export const managerChangePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await axiosClient.put("/manager/change-password", data);
  return response.data;
};

export const managerUpdateProfile = async (data: {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  residentialAddress?: string;
  stateOfResidence?: string;
  lgaOfResidence?: string;
  bankName?: string;
  bankAccount?: string;
  employmentType?: string;
  validNIN?: string;
  utilityBill?: string;
  passport?: string;
  employmentLetter?: string;
}) => {
  const response = await axiosClient.put("/manager/update-profile", data);
  return response.data;
};

// Credit Agent Management
export const freezeCreditAgent = async (creditAgentId: string) => {
  const response = await axiosClient.put(
    `/manager/freeze-credit-agent/${creditAgentId}`
  );
  return response.data;
};

const managerService = {
  // Profile Management
  getManagerProfile,
  managerChangePassword,
  managerUpdateProfile,
  // Credit Agent Management
  freezeCreditAgent,
};

export default managerService;
