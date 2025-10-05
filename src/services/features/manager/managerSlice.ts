import { createAsyncThunkWithHandler } from "@/services/api/apiHandler";
import { createSlice } from "@reduxjs/toolkit";
import managerService from "./managerService";
import type { ManagerState } from "./manager.types";

const initialState: ManagerState = {
  managers: [],
  currentManager: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
};

// Authentication Actions - Now handled by auth service

// Profile Management Actions
export const getManagerProfile = createAsyncThunkWithHandler(
  "manager/getProfile",
  async (_, __) => {
    return await managerService.getManagerProfile();
  }
);

export const managerChangePassword = createAsyncThunkWithHandler(
  "manager/changePassword",
  async (
    payload: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    _
  ) => {
    return await managerService.managerChangePassword(payload);
  }
);

export const managerUpdateProfile = createAsyncThunkWithHandler(
  "manager/updateProfile",
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
    return await managerService.managerUpdateProfile(payload);
  }
);

// Credit Agent Management Actions
export const freezeCreditAgent = createAsyncThunkWithHandler(
  "manager/freezeCreditAgent",
  async (payload: string, _) => {
    return await managerService.freezeCreditAgent(payload);
  }
);

const managerSlice = createSlice({
  name: "manager",
  initialState,
  reducers: {
    resetManager: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearManager: (state) => {
      state.managers = [];
      state.currentManager = null;
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
      // Login - Now handled by auth service
      // Get Profile
      .addCase(getManagerProfile.fulfilled, (state, action) => {
        state.currentManager = action.payload?.data || null;
      })
      // Update Profile
      .addCase(managerUpdateProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(managerUpdateProfile.fulfilled, (state, action) => {
        state.currentManager = action.payload?.data || state.currentManager;
        state.message =
          action.payload?.message || "Profile updated successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(managerUpdateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Change Password
      .addCase(managerChangePassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(managerChangePassword.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Password changed successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(managerChangePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Freeze Credit Agent
      .addCase(freezeCreditAgent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(freezeCreditAgent.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Credit agent frozen successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(freezeCreditAgent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      });
    // Logout - Now handled by auth service
  },
});

export const { resetManager, clearManager } = managerSlice.actions;
export default managerSlice.reducer;
