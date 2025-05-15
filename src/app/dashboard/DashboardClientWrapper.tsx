"use client";

import { ReactNode } from "react";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";
import { Provider } from "@/components/ui/provider";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function DashboardClientWrapper({ children }: { children: ReactNode }) {
  return (
    <Provider>
      <Sidebar />
      <AuthProvider>
        <StoreProvider>{children}</StoreProvider>
      </AuthProvider>
    </Provider>
  );
}
