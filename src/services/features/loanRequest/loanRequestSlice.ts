import { createAsyncThunkWithHandler } from "@/services/api/apiHandler";
import { createSlice } from "@reduxjs/toolkit";
import loanRequestService from "./loanRequestService";
import type { LoanRequestState } from "./loanRequest.types";

const initialState: LoanRequestState = {
  loanRequests: [],
  myLoanRequests: [],
  pendingLoanRequests: [],
  currentLoanRequest: null,
  isLoading: false,
  isFetching: false,
  isSuccess: false,
  isError: false,
  message: "",
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
};

// Loan Request Management Actions
export const createLoanRequest = createAsyncThunkWithHandler(
  "loanRequest/createLoanRequest",
  async (payload: any, _) => {
    return await loanRequestService.createLoanRequest(payload);
  }
);

export const getAllLoanRequests = createAsyncThunkWithHandler(
  "loanRequest/getAllLoanRequests",
  async (
    _,
    payload?: {
      page?: number;
      limit?: number;
      status?: string;
      clientId?: string;
      loanProductId?: string;
      search?: string;
    }
  ) => {
    return await loanRequestService.getAllLoanRequests(payload);
  }
);

export const getMyLoanRequests = createAsyncThunkWithHandler(
  "loanRequest/getMyLoanRequests",
  async (
    _,
    payload?: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    }
  ) => {
    return await loanRequestService.getMyLoanRequests(payload);
  }
);

export const getPendingLoanRequests = createAsyncThunkWithHandler(
  "loanRequest/getPendingLoanRequests",
  async (
    _,
    payload?: {
      page?: number;
      limit?: number;
      search?: string;
    }
  ) => {
    return await loanRequestService.getPendingLoanRequests(payload);
  }
);

export const getLoanRequestDetails = createAsyncThunkWithHandler(
  "loanRequest/getLoanRequestDetails",
  async (payload: string, _) => {
    return await loanRequestService.getLoanRequestDetails(payload);
  }
);

export const updateLoanRequest = createAsyncThunkWithHandler(
  "loanRequest/updateLoanRequest",
  async (payload: { requestId: string; data: any }, _) => {
    return await loanRequestService.updateLoanRequest(
      payload.requestId,
      payload.data
    );
  }
);

export const approveLoanRequest = createAsyncThunkWithHandler(
  "loanRequest/approveLoanRequest",
  async (payload: { requestId: string; data?: any }, _) => {
    return await loanRequestService.approveLoanRequest(
      payload.requestId,
      payload.data
    );
  }
);

export const rejectLoanRequest = createAsyncThunkWithHandler(
  "loanRequest/rejectLoanRequest",
  async (payload: { requestId: string; rejectionReason: string }, _) => {
    return await loanRequestService.rejectLoanRequest(payload.requestId, {
      rejectionReason: payload.rejectionReason,
    });
  }
);

export const deleteLoanRequest = createAsyncThunkWithHandler(
  "loanRequest/deleteLoanRequest",
  async (payload: string, _) => {
    return await loanRequestService.deleteLoanRequest(payload);
  }
);

const loanRequestSlice = createSlice({
  name: "loanRequest",
  initialState,
  reducers: {
    resetLoanRequest: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearLoanRequest: (state) => {
      state.loanRequests = [];
      state.myLoanRequests = [];
      state.pendingLoanRequests = [];
      state.currentLoanRequest = null;
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
      // Create Loan Request
      .addCase(createLoanRequest.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createLoanRequest.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Loan request created successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(createLoanRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Get All Loan Requests
      .addCase(getAllLoanRequests.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getAllLoanRequests.fulfilled, (state, action) => {
        state.isFetching = false;
        state.loanRequests = action.payload?.data?.loanRequests || [];
        state.totalCount = action.payload?.data?.totalCount || 0;
        state.currentPage = action.payload?.data?.currentPage || 1;
        state.totalPages = action.payload?.data?.totalPages || 1;
      })
      .addCase(getAllLoanRequests.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Get My Loan Requests
      .addCase(getMyLoanRequests.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getMyLoanRequests.fulfilled, (state, action) => {
        state.isFetching = false;
        state.myLoanRequests = action.payload?.data?.loanRequests || [];
        state.totalCount = action.payload?.data?.totalCount || 0;
        state.currentPage = action.payload?.data?.currentPage || 1;
        state.totalPages = action.payload?.data?.totalPages || 1;
      })
      .addCase(getMyLoanRequests.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Get Pending Loan Requests
      .addCase(getPendingLoanRequests.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getPendingLoanRequests.fulfilled, (state, action) => {
        state.isFetching = false;
        state.pendingLoanRequests = action.payload?.data?.loanRequests || [];
        state.totalCount = action.payload?.data?.totalCount || 0;
        state.currentPage = action.payload?.data?.currentPage || 1;
        state.totalPages = action.payload?.data?.totalPages || 1;
      })
      .addCase(getPendingLoanRequests.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Get Loan Request Details
      .addCase(getLoanRequestDetails.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getLoanRequestDetails.fulfilled, (state, action) => {
        state.isFetching = false;
        state.currentLoanRequest = action.payload?.data || null;
      })
      .addCase(getLoanRequestDetails.rejected, (state, action) => {
        state.isFetching = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Update Loan Request
      .addCase(updateLoanRequest.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateLoanRequest.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Loan request updated successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
        // Update loan request in the list if it exists
        if (state.currentLoanRequest && action.payload?.data) {
          state.currentLoanRequest = action.payload.data;
        }
      })
      .addCase(updateLoanRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Approve Loan Request
      .addCase(approveLoanRequest.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(approveLoanRequest.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Loan request approved successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
        // Update loan request in the list if it exists
        if (state.currentLoanRequest && action.payload?.data) {
          state.currentLoanRequest = action.payload.data;
        }
      })
      .addCase(approveLoanRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Reject Loan Request
      .addCase(rejectLoanRequest.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(rejectLoanRequest.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Loan request rejected successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
        // Update loan request in the list if it exists
        if (state.currentLoanRequest && action.payload?.data) {
          state.currentLoanRequest = action.payload.data;
        }
      })
      .addCase(rejectLoanRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Delete Loan Request
      .addCase(deleteLoanRequest.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(deleteLoanRequest.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Loan request deleted successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(deleteLoanRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      });
  },
});

export const { resetLoanRequest, clearLoanRequest } = loanRequestSlice.actions;
export default loanRequestSlice.reducer;
