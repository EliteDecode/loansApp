import axiosClient from "@/services/api/axiosClient";

export const getAllFinancesRecord = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  const response = await axiosClient.get("/finance/get-all-records", {
    params,
  });
  return response.data;
};

export const getFinancesReports = async () => {
  const response = await axiosClient.get("/finance/reports");
  return response.data;
};

export const updateStaffSalary = async (data: {
  staffId: string;
  staffType: string;
  currentSalary: number;
  updateReason?: string;
}) => {
  const response = await axiosClient.put("/finance/update-salary", data);
  return response.data;
};

const financesService = {
  getAllFinancesRecord,
  getFinancesReports,
  updateStaffSalary,
};

export default financesService;
