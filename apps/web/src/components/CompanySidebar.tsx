"use client";

import {
  Home,
  Inbox,
  Search,
  Bell,
  List,
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
  SidebarSeparator,
  useSidebar,
} from "./ui/sidebar";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const items = [
  { title: "Profile", url: "/company/profile", icon: Home },
  { title: "Interviews", url: "/company/interviews", icon: Inbox },
  { title: "Pre-listed", url: "/company/pre-listed", icon: List },
  { title: "Announcements", url: "/company/announcements", icon: Bell },
  { title: "Selected Students", url: "/company/selected", icon: Search },
];

const CompanySidebar = () => {
  const { setOpenMobile, collapsed } = useSidebar();
  const pathname = usePathname();

  const handleItemClick = () => {
    setOpenMobile(false);
  };

  return (
      <Sidebar
          collapsible="icon"
          className="min-h-screen bg-slate-300 border-slate-700 data-[collapsed=true]:w-30"
      >
        {/* Sidebar Header */}
        <SidebarHeader className="py-4 h-23 flex items-center justify-center bg-slate-300">
          {/* Logo or title can go here */}
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent className="bg-slate-300">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild className="h-16">
                          <Link
                              href={item.url}
                              onClick={handleItemClick}
                              className={`flex items-center gap-3 px-3 py-2 transition-all duration-200 ${
                                  isActive
                                      ? "bg-slate-400 text-white font-semibold"
                                      : "hover:bg-slate-200"
                              }`}
                          >
                            <item.icon className="w-16" />
                            {!collapsed && (
                                <span className="text-lg">{item.title}</span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  );
};

export default CompanySidebar;
