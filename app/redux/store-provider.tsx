"use client";
import { useRef, ReactNode } from "react";
import { Provider } from "react-redux";
import { store as reduxStore } from "../redux/store";
import type { Store } from "@reduxjs/toolkit"; // adjust based on your store's type

interface StoreProviderProps {
  children: ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<Store | null>(null);

  if (!storeRef.current) {
    storeRef.current = reduxStore;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
