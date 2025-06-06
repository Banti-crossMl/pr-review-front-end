// signupSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "./axiosConfig";
import { AxiosError } from "axios";

interface SignUpPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

interface ErrorResponse {
  error?: string;
  message?: string;
}

interface SignUpState {
  signupData: any;
  signupIsLoading: boolean;
  signupIsError: boolean;
  signupError: string;
  signupIsSuccess: boolean;
}

const initialState: SignUpState = {
  signupData: {},
  signupIsLoading: false,
  signupIsError: false,
  signupError: "",
  signupIsSuccess: false,
};

export const signUpUser = createAsyncThunk<any, SignUpPayload>(
  "signup/signUpUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/auth/signup/`, payload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      const err: AxiosError<ErrorResponse> = error;
      if (err.response) {
        const { status, data } = err.response;
        if (status === 504) return rejectWithValue("Gateway Timeout");
        if (status === 404) return rejectWithValue("Resource Not Found");
        return rejectWithValue(data?.error || data?.message || "Server error");
      }
      return rejectWithValue("Internal server error. Contact admin.");
    }
  }
);

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    resetSignup: (state) => {
      state.signupData = {};
      state.signupIsLoading = false;
      state.signupIsError = false;
      state.signupError = "";
      state.signupIsSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.signupIsLoading = true;
        state.signupIsError = false;
        state.signupError = "";
        state.signupIsSuccess = false;
      })
      .addCase(signUpUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.signupData = action.payload;
        state.signupIsLoading = false;
        state.signupIsSuccess = true;
      })
      .addCase(signUpUser.rejected, (state, action: any) => {
        state.signupIsLoading = false;
        state.signupIsError = true;
        state.signupError = action.payload || action.error.message;
        state.signupIsSuccess = false;
      });
  },
});

export const { resetSignup } = signupSlice.actions;
export default signupSlice.reducer;
