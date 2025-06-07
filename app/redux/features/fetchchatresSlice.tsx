import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../axiosConfig";
import { toast } from "react-hot-toast";

// Types
interface fetchchathistoryState {
  fetchchathistory: any[];
  isfetchchathistoryPending: boolean;
  isfetchchathistorySuccess: boolean;
  isfetchchathistoryError: boolean;
  errorfetchchathistoryMessage: string;
}

// Initial State
const initialState: fetchchathistoryState = {
  fetchchathistory: [],
  isfetchchathistoryPending: false,
  isfetchchathistorySuccess: false,
  isfetchchathistoryError: false,
  errorfetchchathistoryMessage: "",
};

// Async Thunk
export const fetchchathistoryAction = createAsyncThunk(
  "fetchchathistory/fetchchathistoryAction",
  async (_, { rejectWithValue }) => {
    try {
      const sessionId = localStorage.getItem("chatSessionId");
      if (!sessionId) throw new Error("Session ID not found in local storage");

      const response = await axiosInstance.get(`/bot/history/${sessionId}`);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch chat history";
      return rejectWithValue(message);
    }
  }
);

// Slice
const fetchchathistorySlice = createSlice({
  name: "fetchchathistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchchathistoryAction.pending, (state) => {
        state.fetchchathistory = [];
        state.isfetchchathistoryPending = true;
        state.isfetchchathistorySuccess = false;
        state.isfetchchathistoryError = false;
        state.errorfetchchathistoryMessage = "";
      })
      .addCase(
        fetchchathistoryAction.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.fetchchathistory = action.payload;
          state.isfetchchathistoryPending = false;
          state.isfetchchathistorySuccess = true;
          state.isfetchchathistoryError = false;
          state.errorfetchchathistoryMessage = "";
        }
      )
      .addCase(fetchchathistoryAction.rejected, (state, action) => {
        state.fetchchathistory = [];
        state.isfetchchathistoryPending = false;
        state.isfetchchathistorySuccess = false;
        state.isfetchchathistoryError = true;
        state.errorfetchchathistoryMessage = action.payload as string;
        toast.error(state.errorfetchchathistoryMessage, { duration: 2000 });
      });
  },
});

export default fetchchathistorySlice.reducer;
