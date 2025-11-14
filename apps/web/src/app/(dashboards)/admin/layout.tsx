import AdminNavbar from "@/components/admin/admin-navbar";
import DashboardNavbar from "@/components/common/dashboard-navbar";
import React, { Suspense } from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <Suspense fallback={<div className="w-full h-16 border-b border-gray-200 dark:border-gray-800" />}>
        <DashboardNavbar/>
      </Suspense>
      <Suspense fallback={<div className="w-full h-16 border-b border-gray-200 dark:border-gray-800" />}>
        <AdminNavbar />
      </Suspense>
      <div className="w-full p-2 sm:p-4">
        {children}
      </div>
    </main>
  );
}
