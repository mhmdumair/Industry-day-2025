import { Geist, Geist_Mono } from "next/font/google";
import AdminSidebar from "@/components/AdminSidebar";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";


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
            <div className="w-full">
            <Navbar />
            <div className="px-4">{children}</div>
            </div>
        </SidebarProvider>
    </main>
    );

}
