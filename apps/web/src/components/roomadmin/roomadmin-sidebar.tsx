"use client";
import {
  Home,
  Inbox,
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
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const items = [
  { title: "Profile", url: "/room-admin/profile", icon: Home },
  { title: "Stalls", url: "/room-admin/stalls", icon: Inbox },
];

const RoomAdminSidebar = () => {
  const searchParams = useSearchParams();
  const roomAdminId = searchParams.get('roomAdminId');

  const itemsWithRoomAdminId = items.map(item => ({
    ...item,
    url: roomAdminId ? `${item.url}?roomAdminId=${roomAdminId}` : item.url
  }));

  return (
      <Sidebar variant="sidebar" side="left" collapsible="offcanvas">
        <SidebarHeader className="py-4 h-16 flex items-center justify-between px-4 border-b border-slate-200"/>
        <SidebarContent className="p-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {itemsWithRoomAdminId.map(item => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="h-12 mb-1 hover:bg-slate-200 rounded-lg">
                        <Link
                            href={item.url}
                            className="flex items-center gap-3 px-3 py-2 transition-all duration-200"
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0 text-black" />
                          <span className="text-base truncate text-black">{item.title}</span>
                        </Link>
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

export default RoomAdminSidebar;