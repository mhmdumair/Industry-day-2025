import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import CompanyNavbar from "@/components/company/company-navbar";
import React, { Suspense } from "react";
import DashboardNavbar from "@/components/common/dashboard-navbar";

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  return (
      <SidebarProvider defaultOpen={false}>
        <div className="flex antialiased bg-transparent w-full">
          <main className="flex flex-col min-h-screen w-full">
            <Suspense fallback={<div className="w-full h-16 border-b border-gray-200 dark:border-gray-800" />}>
              <DashboardNavbar/>
            </Suspense>
            <Suspense fallback={<div className="w-full h-16 border-b border-gray-200 dark:border-gray-800" />}>
              <CompanyNavbar />
            </Suspense>
            <div className="w-full p-2 sm:p-4">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
  );
}