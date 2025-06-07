import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../axiosConfig";
import { toast } from "react-hot-toast";

// Types
interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  fullResponse?: {
    response: string;
    agent_used: string;
    session_id: string;
    success: boolean;
    guardrails_blocked: boolean;
    memory_enabled: boolean;
  };
}

interface SendMessagePayload {
  msg: string;
}

interface ChatState {
  messages: ChatMessage[];
  isChatLoading: boolean;
  isChatSuccess: boolean;
  isChatError: boolean;
  chatErrorMessage: string;
}

// Initial State
const initialState: ChatState = {
  messages: [],
  isChatLoading: false,
  isChatSuccess: false,
  isChatError: false,
  chatErrorMessage: "",
};

// Async Thunk - POST request with only `msg` in body
export const sendChatMessage = createAsyncThunk(
  "chat/sendChatMessage",
  async ({ msg }: SendMessagePayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/bot/chat/", { message: msg });
      if (response.data) {
        localStorage.setItem("chatSessionId", response?.data?.session_id);
      }
      return response.data; // ✅ Return the entire response object
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while sending the message.";
      return rejectWithValue(message);
    }
  }
);

// Slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Add user message before API response
    addUserMessage: (state, action: PayloadAction<string>) => {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: action.payload,
        sender: "user",
        timestamp: new Date(),
      };
      state.messages.push(userMessage);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.isChatLoading = true;
        state.isChatSuccess = false;
        state.isChatError = false;
        state.chatErrorMessage = "";
      })
      .addCase(
        sendChatMessage.fulfilled,
        (state, action: PayloadAction<any>) => {
          console.log("Full API response:", action.payload);
          const botMessage: ChatMessage = {
            id: Date.now().toString(),
            content: action.payload.response, // Extract the text for display
            sender: "bot",
            timestamp: new Date(),
            fullResponse: {
              response: action.payload.response,
              agent_used: action.payload.agent_used,
              session_id: action.payload.session_id,
              success: action.payload.success,
              guardrails_blocked: action.payload.guardrails_blocked,
              memory_enabled: action.payload.memory_enabled,
            },
          };
          state.messages.push(botMessage);
          state.isChatLoading = false;
          state.isChatSuccess = true;
          state.isChatError = false;
        }
      )
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isChatLoading = false;
        state.isChatSuccess = false;
        state.isChatError = true;
        state.chatErrorMessage = action.payload as string;
        toast.error(state.chatErrorMessage, { duration: 2000 });
      });
  },
});

export const { addUserMessage } = chatSlice.actions;
export default chatSlice.reducer;
