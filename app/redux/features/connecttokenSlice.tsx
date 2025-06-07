import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../axiosConfig";
import { toast } from "react-hot-toast";

// Types
interface TokenPayload {
  token: string;
}

interface ConnectTokenState {
  connectToken: any[];
  isConnectTokenPending: boolean;
  isConnectTokenSuccess: boolean;
  isConnectTokenError: boolean;
  errorConnectTokenMessage: string;
}

// Initial State
const initialState: ConnectTokenState = {
  connectToken: [],
  isConnectTokenPending: false,
  isConnectTokenSuccess: false,
  isConnectTokenError: false,
  errorConnectTokenMessage: "",
};

// Async Thunk - Only sending token in body
export const connectTokenAction = createAsyncThunk(
  "connectToken/connectTokenAction",
  async ({ token }: TokenPayload, { rejectWithValue }) => {
    try {
      const url = `/auth/save-github-token/`;
      const response = await axiosInstance.post(url, { token });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to connect token";
      return rejectWithValue(message);
    }
  }
);

// Slice
const connectTokenSlice = createSlice({
  name: "connectToken",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(connectTokenAction.pending, (state) => {
        state.connectToken = [];
        state.isConnectTokenPending = true;
        state.isConnectTokenSuccess = false;
        state.isConnectTokenError = false;
        state.errorConnectTokenMessage = "";
      })
      .addCase(
        connectTokenAction.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.connectToken = action.payload;
          state.isConnectTokenPending = false;
          state.isConnectTokenSuccess = true;
          state.isConnectTokenError = false;
          state.errorConnectTokenMessage = "";
        }
      )
      .addCase(connectTokenAction.rejected, (state, action) => {
        state.connectToken = [];
        state.isConnectTokenPending = false;
        state.isConnectTokenSuccess = false;
        state.isConnectTokenError = true;
        state.errorConnectTokenMessage = action.payload as string;
        toast.error(state.errorConnectTokenMessage, { duration: 2000 });
      });
  },
});

export default connectTokenSlice.reducer;
