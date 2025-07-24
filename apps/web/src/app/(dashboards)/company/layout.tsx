import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import CompanySidebar from "@/components/company/company-sidebar";
import CompanyNavbar from "@/components/company/company-navbar";

export default async function CompanyLayout({
                                              children,
                                            }: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
      <main className={`flex antialiased`}>
        <SidebarProvider defaultOpen={defaultOpen}>
          {/* Add the CompanySidebar here */}
          <CompanySidebar />

          <div className="flex flex-col items-center min-h-screen w-full mx-auto p-2 sm:p-4">
            <CompanyNavbar />
            <div className="flex-1 px-4">{children}</div>
          </div>
        </SidebarProvider>
      </main>
  );
}
