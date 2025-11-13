import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import StudentSidebar from "@/components/student/student-sidebar";
import StudentNavbar from "@/components/student/student-navbar";
import DashboardNavbar from "@/components/common/dashboard-navbar";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
        <main className="flex flex-col min-h-screen w-full">
          <DashboardNavbar/>
          <StudentNavbar/>
          <div className="w-full p-2 sm:p-4">
            {children}
          </div>
        </main>
    </SidebarProvider>
  );
}