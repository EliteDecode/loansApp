import axiosClient from "@/services/api/axiosClient";

// Loan Request Management
export const createLoanRequest = async (data: any) => {
  const response = await axiosClient.post("/loan-request/create", data);
  return response.data;
};

export const getAllLoanRequests = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  clientId?: string;
  loanProductId?: string;
  search?: string;
}) => {
  const response = await axiosClient.get("/loan-request/get-all", { params });
  return response.data;
};

export const getMyLoanRequests = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  const response = await axiosClient.get("/loan-request/my-requests", {
    params,
  });
  return response.data;
};

export const getPendingLoanRequests = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const response = await axiosClient.get("/loan-request/pending", { params });
  return response.data;
};

export const getLoanRequestDetails = async (requestId: string) => {
  const response = await axiosClient.get(
    `/loan-request/get-details/${requestId}`
  );
  return response.data;
};

export const updateLoanRequest = async (requestId: string, data: any) => {
  const response = await axiosClient.put(
    `/loan-request/update/${requestId}`,
    data
  );
  return response.data;
};

export const approveLoanRequest = async (
  requestId: string,
  data?: {
    approvedAmount?: number;
    approvedTenure?: number;
    notes?: string;
  }
) => {
  const response = await axiosClient.patch(
    `/loan-request/approve/${requestId}`,
    data
  );
  return response.data;
};

export const rejectLoanRequest = async (
  requestId: string,
  data: { rejectionReason: string }
) => {
  const response = await axiosClient.patch(
    `/loan-request/reject/${requestId}`,
    data
  );
  return response.data;
};

export const deleteLoanRequest = async (requestId: string) => {
  const response = await axiosClient.delete(
    `/loan-request/delete/${requestId}`
  );
  return response.data;
};

const loanRequestService = {
  createLoanRequest,
  getAllLoanRequests,
  getMyLoanRequests,
  getPendingLoanRequests,
  getLoanRequestDetails,
  updateLoanRequest,
  approveLoanRequest,
  rejectLoanRequest,
  deleteLoanRequest,
};

export default loanRequestService;
