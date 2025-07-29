import {
  Home,
  Inbox
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import React from "react";

const items = [
  { title: "Profile", url: "/student/profile", icon: Home },
  { title: "Interviews", url: "/student/interviews", icon: Inbox }
];

const StudentSidebar = () => {
  return (
      <Sidebar collapsible="icon" className="min-h-screen bg-black border-slate-700">
        <SidebarHeader className="py-4 h-16 flex items-center justify-between bg-slate-100 px-3" />
        <SidebarContent className="bg-slate-100">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="h-12 mb-1 hover:bg-slate-200 border-2 border-gray-300">
                        <a
                            href={item.url}
                            className="flex items-center gap-3 px-3 py-2 transition-all duration-200"
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0 text-black" />
                          <span className="text-base truncate text-black">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  );
};

export default StudentSidebar;