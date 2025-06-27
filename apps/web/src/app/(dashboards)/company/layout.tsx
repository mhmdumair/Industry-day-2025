import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import CompanySidebar from "@/components/CompanySidebar";


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
        <CompanySidebar />
        <div className="w-full">
          <Navbar />
          <div className="px-4">{children}</div>
        </div>
      </SidebarProvider>
  </main>
);


}
