import axiosClient from "@/services/api/axiosClient";

// Loan Product Management
export const createLoanProduct = async (data: any) => {
  const response = await axiosClient.post("/loan-product/create", data);
  return response.data;
};

export const getAllLoanProducts = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  const response = await axiosClient.get("/loan-product/get-all", { params });
  return response.data;
};

export const getMyLoanProducts = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  const response = await axiosClient.get("/loan-product/my-products", {
    params,
  });
  return response.data;
};

export const getActiveLoanProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const response = await axiosClient.get("/loan-product/active-products", {
    params,
  });
  return response.data;
};

export const getLoanProductDetails = async (productId: string) => {
  const response = await axiosClient.get(
    `/loan-product/get-details/${productId}`
  );
  return response.data;
};

export const updateLoanProduct = async (productId: string, data: any) => {
  const response = await axiosClient.put(
    `/loan-product/update/${productId}`,
    data
  );
  return response.data;
};

export const toggleLoanProductStatus = async (productId: string) => {
  const response = await axiosClient.put(
    `/loan-product/toggle-status/${productId}`
  );
  return response.data;
};

export const deleteLoanProduct = async (productId: string) => {
  const response = await axiosClient.delete(
    `/loan-product/delete/${productId}`
  );
  return response.data;
};

const loanProductService = {
  createLoanProduct,
  getAllLoanProducts,
  getMyLoanProducts,
  getActiveLoanProducts,
  getLoanProductDetails,
  updateLoanProduct,
  toggleLoanProductStatus,
  deleteLoanProduct,
};

export default loanProductService;
