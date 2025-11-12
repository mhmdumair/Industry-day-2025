import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import CompanySidebar from "@/components/company/company-sidebar";
import CompanyNavbar from "@/components/company/company-navbar";
import React from "react";

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  return (
      <SidebarProvider defaultOpen={false}>
        <div className="flex antialiased bg-transparent w-full">
          <CompanySidebar />
          <main className="flex flex-col min-h-screen w-full">
            <CompanyNavbar />
            <div className="w-full p-2 sm:p-4">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
  );
}