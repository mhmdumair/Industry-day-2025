import AdminNavbar from "@/components/admin/admin-navbar";
import DashboardNavbar from "@/components/common/dashboard-navbar";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <DashboardNavbar/>
      <AdminNavbar />
      <div className="w-full p-2 sm:p-4">
        {children}
      </div>
    </main>
  );
}
