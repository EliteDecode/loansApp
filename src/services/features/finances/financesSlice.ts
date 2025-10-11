import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunkWithHandler } from "@/services/api/apiHandler";
import financesService from "./financesService";
import type { FinancesState } from "./finances.types";

// ✅ Initial state
const initialState: FinancesState = {
  records: [],
  reports: [],
  total: 0,
  isLoading: false,
  isLoadingReport: false,
  isSuccess: false,
  isError: false,
  message: null,
  error: null,
};

// ✅ Thunk: Fetch all finance records
export const getAllFinancesRecord = createAsyncThunkWithHandler(
  "finances/getAllFinancesRecord",
  async (payload?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => await financesService.getAllFinancesRecord(payload)
);

// ✅ Thunk: Fetch finance reports
export const getFinancesReports = createAsyncThunkWithHandler(
  "finances/getFinancesReports",
  async () => await financesService.getFinancesReports()
);

// ✅ Thunk: Update staff salary
export const updateStaffSalary = createAsyncThunkWithHandler(
  "finances/updateStaffSalary",
  async (payload: {
    staffId: string;
    staffType: string;
    currentSalary: number;
    updateReason?: string;
  }) => await financesService.updateStaffSalary(payload)
);

// ✅ (Optional) Thunk: Mark salary as paid
export const markSalaryAsPaid = createAsyncThunkWithHandler(
  "finances/markSalaryAsPaid",
  async (payload: { recordId: string }) =>
    await financesService.markSalaryAsPaid(payload)
);

// ✅ Slice
const financesSlice = createSlice({
  name: "finances",
  initialState,
  reducers: {
    clearFinancesError: (state) => {
      state.error = null;
      state.message = null;
    },
    resetFinancesState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Get all finance records
      .addCase(getAllFinancesRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllFinancesRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload?.data || [];
        state.total = action.payload?.total || 0;
      })
      .addCase(getAllFinancesRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          "Failed to load finance records. Please try again.";
      })

      // ✅ Get finance reports
      .addCase(getFinancesReports.pending, (state) => {
        state.isLoadingReport = true;
        state.error = null;
      })
      .addCase(getFinancesReports.fulfilled, (state, action) => {
        state.isLoadingReport = false;
        state.reports = action.payload?.data || [];
      })
      .addCase(getFinancesReports.rejected, (state, action) => {
        state.isLoadingReport = false;
        state.error =
          (action.payload as string) ||
          "Failed to load finance reports. Please try again.";
      })

      // ✅ Update staff salary
      .addCase(updateStaffSalary.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(updateStaffSalary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message =
          action.payload?.message || "Salary updated successfully";

        const updated = action.payload?.data?.finance;
        if (updated && state.records?.length > 0) {
          const index = state.records.findIndex(
            (r) => r.staffId === updated.staffId
          );
          if (index !== -1) {
            state.records[index] = {
              ...state.records[index],
              currentSalary: updated.currentSalary,
            };
          }
        }
      })
      .addCase(updateStaffSalary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          (action.payload as string) || "Failed to update staff salary";
      })

      // ✅ Mark salary as paid
      .addCase(markSalaryAsPaid.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(markSalaryAsPaid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message =
          action.payload?.message || "Salary marked as paid successfully";

        const updated = action.payload?.data;
        if (updated && state.records?.length > 0) {
          const index = state.records.findIndex(
            (r) => r._id === updated.recordId
          );
          if (index !== -1) {
            state.records[index] = {
              ...state.records[index],
              status: "paid",
              paidAt: updated.paidAt,
            };
          }
        }
      })
      .addCase(markSalaryAsPaid.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          (action.payload as string) || "Failed to mark salary as paid";
      });
  },
});

// ✅ Exports
export const { clearFinancesError, resetFinancesState } = financesSlice.actions;
export default financesSlice.reducer;
