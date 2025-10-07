import axiosClient from "@/services/api/axiosClient";

// Authentication - Now handled by auth service

// Profile Management
export const getAgentProfile = async () => {
  const response = await axiosClient.get("/agent/me");
  return response.data;
};

export const agentChangePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await axiosClient.put("/agent/change-password", data);
  return response.data;
};

export const agentUpdateProfile = async (data: {
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
  const response = await axiosClient.put("/agent/update-profile", data);
  return response.data;
};

// CRUD Operations (Directors and Managers only)
export const createCreditAgent = async (data: any) => {
  const response = await axiosClient.post("/agent/create", data);
  return response.data;
};

export const getAllCreditAgents = async () => {
  const response = await axiosClient.get("/agent/get-all");
  return response.data;
};

export const getCreditAgentDetails = async (creditAgentId: string) => {
  const response = await axiosClient.get(`/agent/get-details/${creditAgentId}`);
  return response.data;
};

export const updateCreditAgent = async (creditAgentId: string, data: any) => {
  const response = await axiosClient.put(
    `/agent/update/${creditAgentId}`,
    data
  );
  return response.data;
};

export const toggleCreditAgentStatus = async (creditAgentId: string) => {
  const response = await axiosClient.put(
    `/agent/toggle-status/${creditAgentId}`
  );
  return response.data;
};

export const deleteCreditAgent = async (creditAgentId: string) => {
  const response = await axiosClient.delete(`/agent/delete/${creditAgentId}`);
  return response.data;
};

const agentService = {
  // Profile Management
  getAgentProfile,
  agentChangePassword,
  agentUpdateProfile,
  // CRUD Operations
  createCreditAgent,
  getAllCreditAgents,
  getCreditAgentDetails,
  updateCreditAgent,
  toggleCreditAgentStatus,
  deleteCreditAgent,
};

export default agentService;
