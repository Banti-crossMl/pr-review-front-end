import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../axiosConfig";
import { toast } from "react-hot-toast";
import axios from "axios";

// Types
interface FetchRepoPayload {
  type: string;
}

interface RepoState {
  repos: any[];
  isPendingRepo: boolean;
  isSuccessRepo: boolean;
  isErrorRepo: boolean;
  errorRepo: string;
}

// Initial State
const initialState: RepoState = {
  repos: [],
  isPendingRepo: false,
  isSuccessRepo: false,
  isErrorRepo: false,
  errorRepo: "",
};

export const fetchRepoAction = createAsyncThunk(
  "repo/fetchRepoAction",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/agent/repositories/");
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch repositories";
      return rejectWithValue(message);
    }
  }
);

// Slice
const fetchRepoSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepoAction.pending, (state) => {
        state.repos = [];
        state.isPendingRepo = true;
        state.isSuccessRepo = false;
        state.isErrorRepo = false;
        state.errorRepo = "";
      })
      .addCase(
        fetchRepoAction.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.repos = action.payload;
          state.isPendingRepo = false;
          state.isSuccessRepo = true;
          state.isErrorRepo = false;
          state.errorRepo = "";
        }
      )
      .addCase(fetchRepoAction.rejected, (state, action) => {
        state.repos = [];
        state.isPendingRepo = false;
        state.isSuccessRepo = false;
        state.isErrorRepo = true;
        state.errorRepo = action.payload as string;
        toast.error(state.errorRepo, { duration: 2000 });
      });
  },
});

export default fetchRepoSlice.reducer;
