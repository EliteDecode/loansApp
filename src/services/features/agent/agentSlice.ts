import { createAsyncThunkWithHandler } from "@/services/api/apiHandler";
import { createSlice } from "@reduxjs/toolkit";
import agentService from "./agentService";
import type { AgentState } from "./agent.types";

// Load current agent from localStorage
const currentAgentFromStorage = localStorage.getItem("currentAgent");

const initialState: AgentState = {
  creditAgents: [],
  currentAgent: currentAgentFromStorage
    ? JSON.parse(currentAgentFromStorage)
    : null,
  isLoading: false,
  isFetching: false,
  isSuccess: false,
  isError: false,
  message: "",
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
};

// Authentication Actions - Now handled by auth service

// Profile Management Actions
export const getAgentProfile = createAsyncThunkWithHandler(
  "agent/getProfile",
  async (_, __) => {
    return await agentService.getAgentProfile();
  }
);

export const agentChangePassword = createAsyncThunkWithHandler(
  "agent/changePassword",
  async (
    payload: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    _
  ) => {
    return await agentService.agentChangePassword(payload);
  }
);

export const agentUpdateProfile = createAsyncThunkWithHandler(
  "agent/updateProfile",
  async (
    payload: {
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
    },
    _
  ) => {
    return await agentService.agentUpdateProfile(payload);
  }
);

// CRUD Operations Actions
export const createCreditAgent = createAsyncThunkWithHandler(
  "agent/createCreditAgent",
  async (payload: any, _) => {
    return await agentService.createCreditAgent(payload);
  }
);

export const getAllCreditAgents = createAsyncThunkWithHandler(
  "agent/getAllCreditAgents",
  async (_, __) => {
    return await agentService.getAllCreditAgents();
  }
);

export const getCreditAgentDetails = createAsyncThunkWithHandler(
  "agent/getCreditAgentDetails",
  async (payload: string, _) => {
    return await agentService.getCreditAgentDetails(payload);
  }
);

export const updateCreditAgent = createAsyncThunkWithHandler(
  "agent/updateCreditAgent",
  async (payload: { creditAgentId: string; data: any }, _) => {
    return await agentService.updateCreditAgent(
      payload.creditAgentId,
      payload.data
    );
  }
);

export const toggleCreditAgentStatus = createAsyncThunkWithHandler(
  "agent/toggleCreditAgentStatus",
  async (payload: string, _) => {
    return await agentService.toggleCreditAgentStatus(payload);
  }
);

export const deleteCreditAgent = createAsyncThunkWithHandler(
  "agent/deleteCreditAgent",
  async (payload: string, _) => {
    return await agentService.deleteCreditAgent(payload);
  }
);

const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    resetAgent: (state) => {
      state.isLoading = false;
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearAgent: (state) => {
      state.creditAgents = [];
      state.currentAgent = null;
      state.isLoading = false;
      state.isFetching = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.totalCount = 0;
      state.currentPage = 1;
      state.totalPages = 1;
      // Clear localStorage
      localStorage.removeItem("currentAgent");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login - Now handled by auth service
      // Get Profile
      .addCase(getAgentProfile.fulfilled, (state, action) => {
        state.currentAgent = action.payload?.data || null;
        // Store in localStorage
        if (state.currentAgent) {
          localStorage.setItem(
            "currentAgent",
            JSON.stringify(state.currentAgent)
          );
        }
      })
      // Update Profile
      .addCase(agentUpdateProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(agentUpdateProfile.fulfilled, (state, action) => {
        state.currentAgent = action.payload?.data || state.currentAgent;
        state.message =
          action.payload?.message || "Profile updated successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
        // Update localStorage
        if (state.currentAgent) {
          localStorage.setItem(
            "currentAgent",
            JSON.stringify(state.currentAgent)
          );
        }
      })
      .addCase(agentUpdateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Change Password
      .addCase(agentChangePassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(agentChangePassword.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Password changed successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(agentChangePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Get All Credit Agents
      .addCase(getAllCreditAgents.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getAllCreditAgents.fulfilled, (state, action) => {
        state.creditAgents = action.payload?.data || [];
        state.totalCount = action.payload?.data?.length || 0;
        state.currentPage = 1;
        state.totalPages = 1;
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
      })
      .addCase(getAllCreditAgents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Get Credit Agent Details
      .addCase(getCreditAgentDetails.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getCreditAgentDetails.fulfilled, (state, action) => {
        state.isFetching = false;
        state.currentAgent = action.payload?.data || null;
      })
      .addCase(getCreditAgentDetails.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Create Credit Agent
      .addCase(createCreditAgent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createCreditAgent.fulfilled, (state, _) => {
        state.message = "Credit agent created successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(createCreditAgent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Update Credit Agent
      .addCase(updateCreditAgent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateCreditAgent.fulfilled, (state, _) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "agent updated successfully";
      })
      .addCase(updateCreditAgent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })

      // toogle credit agent status
      .addCase(toggleCreditAgentStatus.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(toggleCreditAgentStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message =
          action.payload?.message || "Director status updated successfully";
        console.log(action);

        // Optional: update director status in currentDirector if same ID
        if (
          state.currentAgent &&
          action.payload?.data?._id === state.currentAgent._id
        ) {
          state.currentAgent.status = action.payload.data.status;
        }
      })
      .addCase(toggleCreditAgentStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload as string;
      });

    // Logout - Now handled by auth service
  },
});

export const { resetAgent, clearAgent } = agentSlice.actions;
export default agentSlice.reducer;
