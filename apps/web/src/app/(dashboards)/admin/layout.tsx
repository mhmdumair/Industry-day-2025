import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import CompanyNavbar from "@/components/company/company-navbar";
import AdminSidebar from "@/components/admin/admin-sidebar";


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <main className={`flex antialiased`}>
        <SidebarProvider defaultOpen={defaultOpen}>
            <AdminSidebar />
            <div className="flex flex-col items-center min-h-screen w-full mx-auto p-2 sm:p-4">
                <CompanyNavbar />
                <div className="flex-1 px-4">{children}</div>
            </div>
        </SidebarProvider>
    </main>
    );

}
