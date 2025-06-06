import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "./store";
import axiosInstance from "./axiosConfig";

interface LoginPayload {
  email: string;
  password: string;
}

interface ErrorResponse {
  error?: string;
  message?: string;
}

interface AuthState {
  loginData: any;
  loginIsLoading: boolean;
  loginIsError: boolean;
  loginError: string;
  loginIsSuccess: boolean;

  refreshData: any;
  refreshIsLoading: boolean;
  refreshIsError: boolean;
  refreshError: string;
  refreshIsSuccess: boolean;
}

const initialState: AuthState = {
  loginData: {},
  loginIsLoading: false,
  loginIsError: false,
  loginError: "",
  loginIsSuccess: false,

  refreshData: {},
  refreshIsLoading: false,
  refreshIsError: false,
  refreshError: "",
  refreshIsSuccess: false,
};

export const loginUser = createAsyncThunk<any, LoginPayload>(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `https://2dec-49-249-18-30.ngrok-free.app/auth/login/`,
        payload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
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

export const authRefreshAction = createAsyncThunk<any>(
  "auth/authRefreshAction",
  async (_, { rejectWithValue }) => {
    try {
      const refresh_token = localStorage.getItem("refresh_token");

      const response = await axios.post(
        `https://2dec-49-249-18-30.ngrok-free.app/auth/refresh-token`,
        {
          refresh_token,
          grant_type: "refresh_token",
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("sessionId", response.data.session_state);
        return response.data;
      } else {
        return rejectWithValue("Your login has expired. Please log in again.");
      }
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

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      localStorage.clear();
    },
    resetloginUser: (state) => {
      state.loginIsLoading = false;
      state.loginIsError = false;
      state.loginError = "";
      state.loginIsSuccess = false;
    },
    resetRefreshction: (state) => {
      state.refreshIsLoading = false;
      state.refreshIsError = false;
      state.refreshError = "";
      state.refreshIsSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loginData = {};
        state.loginIsLoading = true;
        state.loginIsError = false;
        state.loginError = "";
        state.loginIsSuccess = false;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        console.log("action.payload", action.payload);
        state.loginData = action.payload;
        state.loginIsLoading = false;
        state.loginIsError = false;
        state.loginError = "";
        state.loginIsSuccess = true;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loginData = {};
        state.loginIsLoading = false;
        state.loginIsError = true;
        state.loginError = action.payload || action.error.message;
        state.loginIsSuccess = false;
      })

      // refresh
      .addCase(authRefreshAction.pending, (state) => {
        state.refreshData = {};
        state.refreshIsLoading = true;
        state.refreshIsError = false;
        state.refreshError = "";
        state.refreshIsSuccess = false;
      })
      .addCase(
        authRefreshAction.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.refreshData = action.payload;
          state.refreshIsLoading = false;
          state.refreshIsError = false;
          state.refreshError = "";
          state.refreshIsSuccess = true;
        }
      )
      .addCase(authRefreshAction.rejected, (state, action: any) => {
        state.refreshData = {};
        state.refreshIsLoading = false;
        state.refreshIsError = true;
        state.refreshError = action.payload || action.error.message;
        state.refreshIsSuccess = false;
      });
  },
});

export const { logOut, resetloginUser, resetRefreshction } = authSlice.actions;

export default authSlice.reducer;

export const loginData = (state: RootState) => state.auth.loginData;
export const loginIsLoading = (state: RootState) => state.auth.loginIsLoading;
export const loginIsError = (state: RootState) => state.auth.loginIsError;
export const loginError = (state: RootState) => state.auth.loginError;
export const loginIsSuccess = (state: RootState) => state.auth.loginIsSuccess;

export const refreshData = (state: RootState) => state.auth.refreshData;
export const refreshIsLoading = (state: RootState) =>
  state.auth.refreshIsLoading;
export const refreshIsError = (state: RootState) => state.auth.refreshIsError;
export const refreshError = (state: RootState) => state.auth.refreshError;
export const refreshIsSuccess = (state: RootState) =>
  state.auth.refreshIsSuccess;
