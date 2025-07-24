import { Geist, Geist_Mono } from "next/font/google";
import RoomadminSidebar from "@/components/roomadmin/roomadmin-sidebar";
import Navbar from "@/components/common/navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";


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
            <Navbar />
            <div className="px-4">{children}</div>
            </div>
        </SidebarProvider>

    </main>
    );

}
