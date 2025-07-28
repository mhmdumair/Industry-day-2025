
import RoomadminSidebar from "@/components/roomadmin/roomadmin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import CompanyNavbar from "@/components/company/company-navbar";


export default async function RoomAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <main className={`flex antialiased`}>

        <SidebarProvider defaultOpen={defaultOpen}>
            <RoomadminSidebar />
            <div className="w-full">
            <CompanyNavbar />
            <div className="px-4">{children}</div>
            </div>
        </SidebarProvider>

    </main>
    );

}
