"use client";
import {
  Home,
  Inbox,
  Calendar,
  Users,
  Bell,
  House,
  Building,
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
  { title: "Profile", url: "/admin/profile", icon: Home },
  { title: "Students", url: "/admin/students", icon: Inbox },
  { title: "Companies", url: "/admin/companies", icon: Building },
  { title: "Interviews", url: "/admin/interviews", icon: Calendar },
  { title: "Announcements", url: "/admin/announcements", icon: Bell },
  { title: "Rooms", url: "/admin/rooms", icon: House },
  { title: "Room Admins", url: "/admin/room-admins", icon: Users },
  { title: "Stalls", url: "/admin/stalls", icon: Bell },
  { title: "Feedbacks", url: "/admin/feedback", icon: Inbox },
  { title: "Upload CV", url: "/admin/student-cv", icon: Calendar }
];

const AdminSidebar = () => {
  const searchParams = useSearchParams();
  const adminId = searchParams.get('adminId');

  return (
    <Sidebar variant="sidebar" className="min-h-screen bg-black border-slate-700">
      <SidebarHeader className="py-4 h-16 flex items-center justify-between bg-slate-100 px-3" />

      <SidebarContent className="bg-slate-100">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12 mb-1 hover:bg-slate-100">
                    <Link
                      href={`${item.url}${adminId ? `?adminId=${adminId}` : ''}`}
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

export default AdminSidebar;
