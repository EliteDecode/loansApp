import { createAsyncThunkWithHandler } from "@/services/api/apiHandler";
import { createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

export interface LoginState {
  token: string;
  role: string;
  user: any | null;
  message: string;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
}

const token = localStorage.getItem("asavic_token");
const role = localStorage.getItem("asa_role");

const initialState: LoginState = {
  token: token ? JSON.parse(token) : "",
  role: role ? JSON.parse(role) : "",
  user: null, // User data will be fetched separately if needed
  message: "",
  isSuccess: false,
  isError: false,
  isLoading: false,
};

export const login = createAsyncThunkWithHandler(
  "auth/login",
  async (
    payload: {
      email: string;
      password: string;
      role: "director" | "manager" | "agent";
    },
    _
  ) => {
    return await authService.login(
      { email: payload.email, password: payload.password },
      payload.role
    );
  }
);

export const refreshTokenAction = createAsyncThunkWithHandler(
  "auth/refreshToken",
  async (
    payload: { refreshToken: string; role: "director" | "manager" | "agent" },
    _
  ) => {
    return await authService.refreshToken(
      { refreshToken: payload.refreshToken },
      payload.role
    );
  }
);

export const forgotPassword = createAsyncThunkWithHandler(
  "auth/forgotPassword",
  async (payload: { email: string }, _) => {
    return await authService.forgotPassword(payload);
  }
);

export const changePassword = createAsyncThunkWithHandler(
  "auth/changePassword",
  async (payload: { currentPassword: string; newPassword: string }, _) => {
    return await authService.changePassword(payload);
  }
);

export const updateProfile = createAsyncThunkWithHandler(
  "auth/updateProfile",
  async (
    payload: {
      fullname?: string;
      email?: string;
      phone?: string;
      address?: string;
    },
    _
  ) => {
    return await authService.updateProfile(payload);
  }
);

export const getProfile = createAsyncThunkWithHandler(
  "auth/getProfile",
  async (_, __) => {
    return await authService.getProfile();
  }
);

export const logout = createAsyncThunkWithHandler(
  "auth/logout",
  async (
    payload: { refreshToken: string; role: "director" | "manager" | "agent" },
    _
  ) => {
    return await authService.logout(
      { refreshToken: payload.refreshToken },
      payload.role
    );
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearAuth: (state) => {
      state.token = "";
      state.role = "";
      state.user = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      localStorage.removeItem("asavic_token");
      localStorage.removeItem("asavic_refresh_token");
      localStorage.removeItem("asa_role");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, _) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = action.payload?.message || "Login successful";
        state.token = action.payload?.data?.accessToken || "";
        state.role = action.payload?.data?.role || "";

        // Store user data (without role since it's separate)
        state.user = action.payload?.data?.user || null;

        // Store tokens, role, and user data in localStorage
        localStorage.setItem("asavic_token", JSON.stringify(state.token));
        localStorage.setItem(
          "asavic_refresh_token",
          JSON.stringify(action.payload?.data?.refreshToken || "")
        );
        localStorage.setItem(
          "asa_role",
          JSON.stringify(action.payload?.data?.role)
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Refresh Token
      .addCase(refreshTokenAction.fulfilled, (state, action) => {
        state.token = action.payload?.data?.accessToken || "";

        localStorage.setItem("asavic_token", JSON.stringify(state.token));
      })
      // Get Profile
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload?.data || null;
        localStorage.setItem("asa_user", JSON.stringify(state.user));
      })
      // Update Profile
      .addCase(updateProfile.pending, (state, _) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload?.data || state.user;
        state.message =
          action.payload?.message || "Profile updated successfully";
        localStorage.setItem("asa_user", JSON.stringify(state.user));
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Change Password
      .addCase(changePassword.pending, (state, _) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Password changed successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state, _) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Password reset email sent successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.token = "";
        state.role = "";
        state.user = null;
        state.message = "Logout successful";
        localStorage.removeItem("asavic_token");
        localStorage.removeItem("asavic_refresh_token");
        localStorage.removeItem("asa_role");
      });
  },
});

export const { resetAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
