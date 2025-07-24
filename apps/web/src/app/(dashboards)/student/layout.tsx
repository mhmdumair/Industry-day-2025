import { Geist, Geist_Mono } from "next/font/google";
import StudentSidebar from "@/components/student/student-sidebar";
import Navbar from "@/components/common/navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";


export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
  <main className={`flex `}>
  
      <SidebarProvider defaultOpen={defaultOpen}>
        <StudentSidebar />
        <div className="w-full">
          <Navbar />
          <div className="px-4">{children}</div>
        </div>
      </SidebarProvider>

  </main>
);

}
