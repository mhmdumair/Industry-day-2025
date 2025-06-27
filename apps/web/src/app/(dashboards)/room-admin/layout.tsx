import { Geist, Geist_Mono } from "next/font/google";
import RoomAdminSidebar from "@/components/RoomAdminSidebar";
import Navbar from "@/components/Navbar";
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
            <RoomAdminSidebar />
            <div className="w-full">
            <Navbar />
            <div className="px-4">{children}</div>
            </div>
        </SidebarProvider>

    </main>
    );

}
