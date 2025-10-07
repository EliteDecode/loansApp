import { createAsyncThunkWithHandler } from "@/services/api/apiHandler";
import { createSlice } from "@reduxjs/toolkit";
import loanProductService from "./loanProductService";
import type { LoanProductState } from "./loanProduct.types";

const initialState: LoanProductState = {
  loanProducts: [],
  myLoanProducts: [],
  activeLoanProducts: [],
  currentLoanProduct: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
};

// Loan Product Management Actions
export const createLoanProduct = createAsyncThunkWithHandler(
  "loanProduct/createLoanProduct",
  async (payload: any, _) => {
    return await loanProductService.createLoanProduct(payload);
  }
);

export const getAllLoanProducts = createAsyncThunkWithHandler(
  "loanProduct/getAllLoanProducts",
  async (payload?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    return await loanProductService.getAllLoanProducts(payload);
  }
);

export const getMyLoanProducts = createAsyncThunkWithHandler(
  "loanProduct/getMyLoanProducts",
  async (
    _,
    payload?: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    }
  ) => {
    return await loanProductService.getMyLoanProducts(payload);
  }
);

export const getActiveLoanProducts = createAsyncThunkWithHandler(
  "loanProduct/getActiveLoanProducts",
  async (
    _,
    payload?: {
      page?: number;
      limit?: number;
      search?: string;
    }
  ) => {
    return await loanProductService.getActiveLoanProducts(payload);
  }
);

export const getLoanProductDetails = createAsyncThunkWithHandler(
  "loanProduct/getLoanProductDetails",
  async (payload: string, _) => {
    return await loanProductService.getLoanProductDetails(payload);
  }
);

export const updateLoanProduct = createAsyncThunkWithHandler(
  "loanProduct/updateLoanProduct",
  async (payload: { productId: string; data: any }, _) => {
    return await loanProductService.updateLoanProduct(
      payload.productId,
      payload.data
    );
  }
);

export const toggleLoanProductStatus = createAsyncThunkWithHandler(
  "loanProduct/toggleLoanProductStatus",
  async (payload: string, _) => {
    return await loanProductService.toggleLoanProductStatus(payload);
  }
);

export const deleteLoanProduct = createAsyncThunkWithHandler(
  "loanProduct/deleteLoanProduct",
  async (payload: string, _) => {
    return await loanProductService.deleteLoanProduct(payload);
  }
);

const loanProductSlice = createSlice({
  name: "loanProduct",
  initialState,
  reducers: {
    resetLoanProduct: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearLoanProduct: (state) => {
      state.loanProducts = [];
      state.myLoanProducts = [];
      state.activeLoanProducts = [];
      state.currentLoanProduct = null;
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
      // Create Loan Product
      .addCase(createLoanProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createLoanProduct.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Loan product created successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(createLoanProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Get All Loan Products
      .addCase(getAllLoanProducts.fulfilled, (state, action) => {
        state.loanProducts = action.payload?.data || [];
        state.totalCount = action.payload?.data?.totalCount || 0;
        state.currentPage = action.payload?.data?.currentPage || 1;
        state.totalPages = action.payload?.data?.totalPages || 1;
      })
      // Get My Loan Products
      .addCase(getMyLoanProducts.fulfilled, (state, action) => {
        state.myLoanProducts = action.payload?.data?.loanProducts || [];
        state.totalCount = action.payload?.data?.totalCount || 0;
        state.currentPage = action.payload?.data?.currentPage || 1;
        state.totalPages = action.payload?.data?.totalPages || 1;
      })
      // Get Active Loan Products
      .addCase(getActiveLoanProducts.fulfilled, (state, action) => {
        console.log(action);
        state.activeLoanProducts = action.payload?.data?.loanProducts || [];
        state.totalCount = action.payload?.data?.totalCount || 0;
        state.currentPage = action.payload?.data?.currentPage || 1;
        state.totalPages = action.payload?.data?.totalPages || 1;
      })
      // Get Loan Product Details
      .addCase(getLoanProductDetails.fulfilled, (state, action) => {
        state.currentLoanProduct = action.payload?.data || null;
      })
      // Update Loan Product
      .addCase(updateLoanProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateLoanProduct.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Loan product updated successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
        // Update loan product in the list if it exists
        if (state.currentLoanProduct && action.payload?.data) {
          state.currentLoanProduct = action.payload.data;
        }
      })
      .addCase(updateLoanProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Toggle Loan Product Status
      .addCase(toggleLoanProductStatus.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(toggleLoanProductStatus.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Loan product status updated successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(toggleLoanProductStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      })
      // Delete Loan Product
      .addCase(deleteLoanProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(deleteLoanProduct.fulfilled, (state, action) => {
        state.message =
          action.payload?.message || "Loan product deleted successfully";
        state.isSuccess = true;
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(deleteLoanProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.isSuccess = false;
      });
  },
});

export const { resetLoanProduct, clearLoanProduct } = loanProductSlice.actions;
export default loanProductSlice.reducer;
