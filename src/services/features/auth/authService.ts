import axiosClient from "@/services/api/axiosClient";

export const login = async (
  data: { email: string; password: string },
  role: "director" | "manager" | "agent"
) => {
  let endpoint;
  switch (role) {
    case "director":
      endpoint = "/director/login";
      break;
    case "manager":
      endpoint = "/manager/login";
      break;
    case "agent":
      endpoint = "/agent/login";
      break;
    default:
      throw new Error("Invalid role");
  }

  const response = await axiosClient.post(endpoint, data);
  return response.data;
};

export const refreshToken = async (
  data: { refreshToken: string },
  role: "director" | "manager" | "agent"
) => {
  let endpoint;
  switch (role) {
    case "director":
      endpoint = "/director/refresh-token";
      break;
    case "manager":
      endpoint = "/manager/refresh-token";
      break;
    case "agent":
      endpoint = "/agent/refresh-token";
      break;
    default:
      throw new Error("Invalid role");
  }

  const response = await axiosClient.post(endpoint, data);
  return response.data;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await axiosClient.post("/admin/auth/forgot-password", data);
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await axiosClient.put("/admin/auth/change-password", data);
  return response.data;
};

export const updateProfile = async (data: {
  fullname?: string;
  email?: string;
  phone?: string;
  address?: string;
}) => {
  const response = await axiosClient.put("/admin/auth/profile", data);
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosClient.get("/admin/auth/");
  return response.data;
};

export const logout = async (
  data: { refreshToken: string },
  role: "director" | "manager" | "agent"
) => {
  let endpoint;
  switch (role) {
    case "director":
      endpoint = "/director/logout";
      break;
    case "manager":
      endpoint = "/manager/logout";
      break;
    case "agent":
      endpoint = "/agent/logout";
      break;
    default:
      throw new Error("Invalid role");
  }

  const response = await axiosClient.post(endpoint, data);
  return response.data;
};

const authService = {
  login,
  refreshToken,
  forgotPassword,
  changePassword,
  updateProfile,
  getProfile,
  logout,
};

export default authService;
