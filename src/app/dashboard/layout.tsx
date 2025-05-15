"use client"
import DashboardClientWrapper from "./DashboardClientWrapper";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardClientWrapper>
      {children}
    </DashboardClientWrapper>
  );
}