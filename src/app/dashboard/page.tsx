"use client";

import { useContext } from "react";
import { useAuthRedirect } from "@/hook/useAuthRedirect";
import { AuthContext } from "@/context/AuthContext";

export default function DashboardPage() {
  const { token } = useContext(AuthContext)!;
  useAuthRedirect(token);
  return <div style={{ marginLeft: '240px', padding: '1rem' }}>Chào mừng đến trang Dashboard!</div>;
}
