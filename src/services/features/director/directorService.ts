import axiosClient from "@/services/api/axiosClient";

// Authentication - Now handled by auth service

// Profile Management
export const getDirectorProfile = async () => {
  const response = await axiosClient.get("/director/me");
  return response.data;
};

export const directorChangePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await axiosClient.put("/director/change-password", data);
  return response.data;
};

export const directorUpdateProfile = async (data: {
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
  const response = await axiosClient.put("/director/update-profile", data);
  return response.data;
};

// Director Management
export const createDirector = async (data: any) => {
  const response = await axiosClient.post("/director/create", data);
  return response.data;
};

export const getAllDirectors = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  const response = await axiosClient.get("/director/", { params });
  return response.data;
};

export const getDirectorDetails = async (directorId: string) => {
  const response = await axiosClient.get(`/director/get-details/${directorId}`);
  return response.data;
};

export const updateDirector = async (directorId: string, data: any) => {
  const response = await axiosClient.put(
    `/director/update/${directorId}`,
    data
  );
  return response.data;
};

export const toggleDirectorStatus = async (directorId: string) => {
  const response = await axiosClient.put(
    `/director/toggle-status/${directorId}`
  );
  return response.data;
};

export const deleteDirector = async (directorId: string) => {
  const response = await axiosClient.delete(`/director/delete/${directorId}`);
  return response.data;
};

// System Control
export const freezeAccount = async (data: {
  targetUserId: string;
  reason: string;
}) => {
  const response = await axiosClient.post("/director/freeze-account", data);
  return response.data;
};

export const unfreezeAccount = async (data: {
  targetUserId: string;
  reason: string;
}) => {
  const response = await axiosClient.post("/director/unfreeze-account", data);
  return response.data;
};

export const restoreSystem = async (data: { reason: string }) => {
  const response = await axiosClient.post("/director/restore", data);
  return response.data;
};

export const shutdownSystem = async (data: {
  reason: string;
  password: string;
}) => {
  const response = await axiosClient.post("/director/shutdown", data);
  return response.data;
};

// Manager Management
export const createManager = async (data: any) => {
  const response = await axiosClient.post("/director/create-manager", data);
  return response.data;
};

export const getAllManagers = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  const response = await axiosClient.get("/director/managers/get-all", {
    params,
  });
  return response.data;
};

export const getManagerDetails = async (managerId: string) => {
  const response = await axiosClient.get(
    `/director/managers/get-details/${managerId}`
  );
  return response.data;
};

export const updateManager = async (managerId: string, data: any) => {
  const response = await axiosClient.put(
    `/director/managers/update/${managerId}`,
    data
  );
  return response.data;
};

export const toggleManagerStatus = async (managerId: string) => {
  const response = await axiosClient.put(
    `/director/managers/toggle-status/${managerId}`
  );
  return response.data;
};

export const deleteManager = async (managerId: string) => {
  const response = await axiosClient.delete(
    `/director/managers/delete/${managerId}`
  );
  return response.data;
};

const directorService = {
  // Profile Management
  getDirectorProfile,
  directorChangePassword,
  directorUpdateProfile,
  // Director Management
  createDirector,
  getAllDirectors,
  getDirectorDetails,
  updateDirector,
  toggleDirectorStatus,
  deleteDirector,
  // System Control
  freezeAccount,
  unfreezeAccount,
  restoreSystem,
  shutdownSystem,
  // Manager Management
  createManager,
  getAllManagers,
  getManagerDetails,
  updateManager,
  toggleManagerStatus,
  deleteManager,
};

export default directorService;
