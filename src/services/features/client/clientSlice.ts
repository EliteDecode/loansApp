import { createAsyncThunkWithHandler } from "@/services/api/apiHandler";
import { createSlice } from "@reduxjs/toolkit";
import clientService from "./clientService";
import type { ClientState } from "./client.types";

const initialState: ClientState = {
  clients: [],
  myClients: [],
  currentClient: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
};

// Client Management Actions
export const createClient = createAsyncThunkWithHandler(
  "client/createClient",
  async (payload: any, _) => {
    return await clientService.createClient(payload);
  }
);

export const getAllClients = createAsyncThunkWithHandler(
  "client/getAllClients",
  async (
    _,
    payload?: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
      createdByRole?: string;
    }
  ) => {
    return await clientService.getAllClients(payload);
  }
);

export const getMyClients = createAsyncThunkWithHandler(
  "client/getMyClients",
  async (
    _,
    payload?: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    }
  ) => {
    return await clientService.getMyClients(payload);
  }
);

export const getClientDetails = createAsyncThunkWithHandler(
  "client/getClientDetails",
  async (payload: string, _) => {
    return await clientService.getClientDetails(payload);
  }
);

export const updateClient = createAsyncThunkWithHandler(
  "client/updateClient",
  async (payload: { clientId: string; data: any }, _) => {
    return await clientService.updateClient(payload.clientId, payload.data);
  }
);

export const toggleClientStatus = createAsyncThunkWithHandler(
  "client/toggleClientStatus",
  async (payload: { clientId: string; status: string }, _) => {
    return await clientService.toggleClientStatus(payload.clientId, {
      status: payload.status,
    });
  }
);

export const deleteClient = createAsyncThunkWithHandler(
  "client/deleteClient",
  async (payload: string, _) => {
    return await clientService.deleteClient(payload);
  }
);

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    resetClient: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearClient: (state) => {
      state.clients = [];
      state.myClients = [];
      state.currentClient = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.totalCount = 0;
      state.currentPage = 1;
      state.totalPages = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Client
      .addCase(createClient.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Client created successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(createClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Get All Clients
      .addCase(getAllClients.fulfilled, (state, action) => {
        state.clients = action.payload?.data?.clients || [];
        state.totalCount = action.payload?.data?.totalCount || 0;
        state.currentPage = action.payload?.data?.currentPage || 1;
        state.totalPages = action.payload?.data?.totalPages || 1;
      })
      // Get My Clients
      .addCase(getMyClients.fulfilled, (state, action) => {
        state.myClients = action.payload?.data?.clients || [];
        state.totalCount = action.payload?.data?.totalCount || 0;
        state.currentPage = action.payload?.data?.currentPage || 1;
        state.totalPages = action.payload?.data?.totalPages || 1;
      })
      // Get Client Details
      .addCase(getClientDetails.fulfilled, (state, action) => {
        state.currentClient = action.payload?.data || null;
      })
      // Update Client
      .addCase(updateClient.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Client updated successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
        // Update client in the list if it exists
        if (state.currentClient && action.payload?.data) {
          state.currentClient = action.payload.data;
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Toggle Client Status
      .addCase(toggleClientStatus.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(toggleClientStatus.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Client status updated successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(toggleClientStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Delete Client
      .addCase(deleteClient.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Client deleted successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      });
  },
});

export const { resetClient, clearClient } = clientSlice.actions;
export default clientSlice.reducer;
