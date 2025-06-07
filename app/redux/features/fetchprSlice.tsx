import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../axiosConfig";
import { toast } from "react-hot-toast";
import axios from "axios";

// Types
interface FetchRepositoryPayload {
  name: string;
  owner: string;
}

interface RepositoryState {
  repositoryDetails: any[];
  isPendingRepositoryDetails: boolean;
  isSuccessRepositoryDetails: boolean;
  isErrorRepositoryDetails: boolean;
  errorRepositoryDetails: string;
}

// Initial State
const initialState: RepositoryState = {
  repositoryDetails: [],
  isPendingRepositoryDetails: false,
  isSuccessRepositoryDetails: false,
  isErrorRepositoryDetails: false,
  errorRepositoryDetails: "",
};

export const fetchRepositoriesAction = createAsyncThunk(
  "repository/fetchRepositoriesAction",
  async (payload: FetchRepositoryPayload, { rejectWithValue }) => {
    try {
      // Send the data as part of the URL path
      const url = `/agent/repositories/${payload.owner}/${payload.name}/pulls/`;
      const response = await axiosInstance.get(url);

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
const repositorySlice = createSlice({
  name: "repository",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepositoriesAction.pending, (state) => {
        state.repositoryDetails = [];
        state.isPendingRepositoryDetails = true;
        state.isSuccessRepositoryDetails = false;
        state.isErrorRepositoryDetails = false;
        state.errorRepositoryDetails = "";
      })
      .addCase(
        fetchRepositoriesAction.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.repositoryDetails = action.payload;
          state.isPendingRepositoryDetails = false;
          state.isSuccessRepositoryDetails = true;
          state.isErrorRepositoryDetails = false;
          state.errorRepositoryDetails = "";
        }
      )
      .addCase(fetchRepositoriesAction.rejected, (state, action) => {
        state.repositoryDetails = [];
        state.isPendingRepositoryDetails = false;
        state.isSuccessRepositoryDetails = false;
        state.isErrorRepositoryDetails = true;
        state.errorRepositoryDetails = action.payload as string;
        toast.error(state.errorRepositoryDetails, { duration: 2000 });
      });
  },
});

export default repositorySlice.reducer;
