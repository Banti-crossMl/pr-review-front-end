"use client";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./authSlice";
import signupReducer from "./signupSlice";
import fetchRepoReducer from "./features/fetchrepoSlice";
import repositoryReducer from "./features/fetchprSlice";
import pullRequestReducer from "./features/fetchchangesSlice";
import chatReducer from "./features/chatboatSlice";
import connectTokenReducer from "./features/connecttokenSlice";

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    auth: authReducer,
    repo: fetchRepoReducer,
    pullrequest: repositoryReducer,
    reviewcode: pullRequestReducer,
    chat: chatReducer,
    tokenres: connectTokenReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
