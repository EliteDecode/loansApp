import { createAsyncThunk } from "@reduxjs/toolkit";

// Ensure `Returned` can be any type, but provide a more specific type for the result
export const createAsyncThunkWithHandler = <Returned = any, ThunkArg = void>(
  name: string,
  thunkFunction: (arg: ThunkArg, thunkAPI: any) => Promise<Returned>
) =>
  createAsyncThunk<Returned, ThunkArg>(name, async (arg, thunkAPI) => {
    try {
      const result = await thunkFunction(arg, thunkAPI);

      // Check if result has a `message` property
      if (result && typeof result === "object" && "message" in result) {
        if (result.message === false) {
          return thunkAPI.rejectWithValue(result.message);
        }
      }

      return result;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          (error.response.data.message || error.response.data.error)) ||
        error.message ||
        error.toString();
      // console.log(error);
      // Check if the error code is 401
      // if (error.response && error.response.status === 401) {
      //   thunkAPI.dispatch(LogoutAdmin());
      //   localStorage.removeItem("BST_Admin_access_Token");
      //   localStorage.removeItem("BST_Admin_refresh_Token");
      //   localStorage.removeItem("BST_user_details");
      //   window.location.href = "/auth/login";
      // }

      return thunkAPI.rejectWithValue(message);
    }
  });
