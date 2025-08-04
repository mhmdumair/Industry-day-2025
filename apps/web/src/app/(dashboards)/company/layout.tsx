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
    <main className="flex antialiased min-h-screen w-full">
      <SidebarProvider defaultOpen={defaultOpen}>
        <CompanySidebar />
        <div className="flex flex-col flex-1 min-w-screen">
          <CompanyNavbar />
          <div className="flex-1 px-2 sm:px-4 py-2 sm:py-4 max-w-screen" >
            <div className="w-full max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
}