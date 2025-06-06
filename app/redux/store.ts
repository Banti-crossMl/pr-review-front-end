"use client";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./authSlice";
import signupReducer from "./signupSlice";
import fetchRepoReducer from "./features/fetchrepoSlice";

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    auth: authReducer,
    repo: fetchRepoReducer,
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
