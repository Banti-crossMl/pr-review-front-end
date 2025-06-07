import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../axiosConfig";
import { toast } from "react-hot-toast";

// Types
interface PullRequestPayload {
  owner: string;
  repo: string;
  pr_number: number;
  async_review: boolean;
}

interface PullRequestState {
  pullRequests: any[];
  isPullRequestsPending: boolean;
  isPullRequestsSuccess: boolean;
  isPullRequestsError: boolean;
  errorPullRequestsMessage: string;
}

// Initial State
const initialState: PullRequestState = {
  pullRequests: [],
  isPullRequestsPending: false,
  isPullRequestsSuccess: false,
  isPullRequestsError: false,
  errorPullRequestsMessage: "",
};

// Async Thunk - POST request with payload in body
export const fetchRepositoryPullRequests = createAsyncThunk(
  "pullRequests/fetchRepositoryPullRequests",
  async (payload: PullRequestPayload, { rejectWithValue }) => {
    console.log("payloadpayloadpayload", payload);
    try {
      const url = `/agent/review/`;
      const response = await axiosInstance.post(url, payload);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch pull requests";
      return rejectWithValue(message);
    }
  }
);

// Slice
const pullRequestSlice = createSlice({
  name: "pullRequests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepositoryPullRequests.pending, (state) => {
        state.pullRequests = [];
        state.isPullRequestsPending = true;
        state.isPullRequestsSuccess = false;
        state.isPullRequestsError = false;
        state.errorPullRequestsMessage = "";
      })
      .addCase(
        fetchRepositoryPullRequests.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.pullRequests = action.payload;
          state.isPullRequestsPending = false;
          state.isPullRequestsSuccess = true;
          state.isPullRequestsError = false;
          state.errorPullRequestsMessage = "";
        }
      )
      .addCase(fetchRepositoryPullRequests.rejected, (state, action) => {
        state.pullRequests = [];
        state.isPullRequestsPending = false;
        state.isPullRequestsSuccess = false;
        state.isPullRequestsError = true;
        state.errorPullRequestsMessage = action.payload as string;
        toast.error(state.errorPullRequestsMessage, { duration: 2000 });
      });
  },
});

export default pullRequestSlice.reducer;
