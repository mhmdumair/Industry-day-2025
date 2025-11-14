"use client";
import React from "react";
import RoomAdminNavbar from "@/components/roomadmin/roomadmin-navbar";
import DashboardNavbar from "@/components/common/dashboard-navbar";

export default function RoomAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <DashboardNavbar />
      <RoomAdminNavbar />
      <div className="w-full p-2 sm:p-4">
        {children}
      </div>
    </main>
  );
}