import axiosClient from "@/services/api/axiosClient";

// Client Management
export const createClient = async (data: any) => {
  const response = await axiosClient.post("/client/create", data);
  return response.data;
};

export const getAllClients = async () => {
  const response = await axiosClient.get("/client/get-all");
  return response.data;
};

export const getMyClients = async () => {
  const response = await axiosClient.get("/client/my-clients");
  return response.data;
};

export const getClientDetails = async (clientId: string) => {
  const response = await axiosClient.get(`/client/get-details/${clientId}`);
  return response.data;
};

export const updateClient = async (clientId: string, data: any) => {
  const response = await axiosClient.put(`/client/update/${clientId}`, data);
  return response.data;
};

export const toggleClientStatus = async (
  clientId: string,
  data: { status: string }
) => {
  const response = await axiosClient.put(
    `/client/toggle-status/${clientId}`,
    data
  );
  return response.data;
};

export const deleteClient = async (clientId: string) => {
  const response = await axiosClient.delete(`/client/delete/${clientId}`);
  return response.data;
};

const clientService = {
  createClient,
  getAllClients,
  getMyClients,
  getClientDetails,
  updateClient,
  toggleClientStatus,
  deleteClient,
};

export default clientService;
