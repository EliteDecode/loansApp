import { createAsyncThunkWithHandler } from "@/services/api/apiHandler";
import { createSlice } from "@reduxjs/toolkit";
import directorService from "./directorService";
import type { DirectorState } from "./director.types";

// Load current director from localStorage
const currentDirectorFromStorage = localStorage.getItem("currentDirector");

const initialState: DirectorState = {
  directors: [],
  currentDirector: currentDirectorFromStorage
    ? JSON.parse(currentDirectorFromStorage)
    : null,
  managers: [], //change later
  settings: null,
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
export const getDirectorProfile = createAsyncThunkWithHandler(
  "director/getProfile",
  async (_, __) => {
    return await directorService.getDirectorProfile();
  }
);

export const directorChangePassword = createAsyncThunkWithHandler(
  "director/changePassword",
  async (
    payload: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    _
  ) => {
    return await directorService.directorChangePassword(payload);
  }
);

export const directorUpdateProfile = createAsyncThunkWithHandler(
  "director/updateProfile",
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
    return await directorService.directorUpdateProfile(payload);
  }
);

// Director Management Actions
export const createDirector = createAsyncThunkWithHandler(
  "director/createDirector",
  async (payload: any, _) => {
    return await directorService.createDirector(payload);
  }
);

export const getAllDirectors = createAsyncThunkWithHandler(
  "director/getAllDirectors",
  async (
    _,
    payload?: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    }
  ) => {
    return await directorService.getAllDirectors(payload);
  }
);

export const getDirectorDetails = createAsyncThunkWithHandler(
  "director/getDirectorDetails",
  async (payload: string, _) => {
    return await directorService.getDirectorDetails(payload);
  }
);

export const getSystemSettings = createAsyncThunkWithHandler(
  "director/getSystemSettings",
  async () => {
    return await directorService.getSystemSettings();
  }
);

export const updateDirector = createAsyncThunkWithHandler(
  "director/updateDirector",
  async (payload: { directorId: string; data: any }, _) => {
    return await directorService.updateDirector(
      payload.directorId,
      payload.data
    );
  }
);

export const toggleDirectorStatus = createAsyncThunkWithHandler(
  "director/toggleDirectorStatus",
  async (payload: string, _) => {
    return await directorService.toggleDirectorStatus(payload);
  }
);

export const deleteDirector = createAsyncThunkWithHandler(
  "director/deleteDirector",
  async (payload: string, _) => {
    return await directorService.deleteDirector(payload);
  }
);

// System Control Actions
export const freezeAccount = createAsyncThunkWithHandler(
  "director/freezeAccount",
  async (payload: { targetUserId: string; reason: string }, _) => {
    return await directorService.freezeAccount(payload);
  }
);

export const unfreezeAccount = createAsyncThunkWithHandler(
  "director/unfreezeAccount",
  async (payload: { targetUserId: string; reason: string }, _) => {
    return await directorService.unfreezeAccount(payload);
  }
);

export const restoreSystem = createAsyncThunkWithHandler(
  "director/restoreSystem",
  async (payload: { password: string }, _) => {
    return await directorService.restoreSystem(payload);
  }
);

export const shutdownSystem = createAsyncThunkWithHandler(
  "director/shutdownSystem",
  async (payload: { reason: string; password: string }, _) => {
    return await directorService.shutdownSystem(payload);
  }
);

// Manager Management Actions
export const createManager = createAsyncThunkWithHandler(
  "director/createManager",
  async (payload: any, _) => {
    return await directorService.createManager(payload);
  }
);

export const getAllManagers = createAsyncThunkWithHandler(
  "director/getAllManagers",
  async (
    _,
    payload?: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    }
  ) => {
    return await directorService.getAllManagers(payload);
  }
);

export const getManagerDetails = createAsyncThunkWithHandler(
  "director/getManagerDetails",
  async (payload: string, _) => {
    return await directorService.getManagerDetails(payload);
  }
);

export const updateManager = createAsyncThunkWithHandler(
  "director/updateManager",
  async (payload: { managerId: string; data: any }, _) => {
    return await directorService.updateManager(payload.managerId, payload.data);
  }
);

export const toggleManagerStatus = createAsyncThunkWithHandler(
  "director/toggleManagerStatus",
  async (payload: string, _) => {
    return await directorService.toggleManagerStatus(payload);
  }
);

export const deleteManager = createAsyncThunkWithHandler(
  "director/deleteManager",
  async (payload: string, _) => {
    return await directorService.deleteManager(payload);
  }
);

const directorSlice = createSlice({
  name: "director",
  initialState,
  reducers: {
    resetDirector: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearDirector: (state) => {
      state.directors = [];
      state.currentDirector = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      state.totalCount = 0;
      state.currentPage = 1;
      state.totalPages = 1;
      // Clear localStorage
      localStorage.removeItem("currentDirector");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login - Now handled by auth service
      // Get Profile
      .addCase(getDirectorProfile.fulfilled, (state, action) => {
        state.currentDirector = action.payload?.data || null;
        // Store in localStorage
        if (state.currentDirector) {
          localStorage.setItem(
            "currentDirector",
            JSON.stringify(state.currentDirector)
          );
        }
      })
      // Update Profile
      .addCase(directorUpdateProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(directorUpdateProfile.fulfilled, (state, action) => {
        state.currentDirector = action.payload?.data || state.currentDirector;
        state.message =
          action.payload?.message || "Profile updated successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
        // Update localStorage
        if (state.currentDirector) {
          localStorage.setItem(
            "currentDirector",
            JSON.stringify(state.currentDirector)
          );
        }
      })
      .addCase(directorUpdateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Change Password
      .addCase(directorChangePassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(directorChangePassword.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Password changed successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(directorChangePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Get All Directors
      .addCase(getAllDirectors.fulfilled, (state, action) => {
        state.directors = action.payload?.data || [];
        state.totalCount = action.payload?.data?.totalCount || 0;
        state.currentPage = action.payload?.data?.currentPage || 1;
        state.totalPages = action.payload?.data?.totalPages || 1;
      })
      // Create Director
      .addCase(createDirector.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createDirector.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Director created successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(createDirector.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      //System shut down
      .addCase(shutdownSystem.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(shutdownSystem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload?.message || "System shutdown successful";
      })
      .addCase(shutdownSystem.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // Get System Settings
      .addCase(getSystemSettings.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getSystemSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.settings = action.payload?.data || null;
        state.message =
          action.payload?.message || "System settings retrieved successfully";
      })
      .addCase(getSystemSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // Create Director
      .addCase(createManager.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createManager.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Director created successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(createManager.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })

      // 🧭 Get All Managers
      .addCase(getAllManagers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getAllManagers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.managers = action.payload?.data || [];
        state.message =
          action.payload?.message || "Managers retrieved successfully.";
      })
      .addCase(getAllManagers.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message =
          action.payload?.message ||
          "Failed to retrieve managers. Please try again.";
      })

      // Update Credit Agent
      .addCase(updateManager.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateManager.fulfilled, (state, _) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "manager updated successfully";
      })
      .addCase(updateManager.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      });

    // Logout - Now handled by auth service
  },
});

export const { resetDirector, clearDirector } = directorSlice.actions;
export default directorSlice.reducer;
