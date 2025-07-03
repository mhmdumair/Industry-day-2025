"use client";
import {
  Home,
  Inbox,
  Search,
  User2,
  ChevronUp,
  Bell,
  List,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const items = [
  {
    title: "Profile",
    url: "/company/profile",
    icon: Home,
  },
  {
    title: "Interviews",
    url: "/company/interviews",
    icon: Inbox,
  },
  {
    title: "Pre-listed",
    url: "/company/pre-listed", // Fixed: unique URL
    icon: List, // Changed icon to differentiate
  },
  {
    title: "Announcements",
    url: "/company/announcements",
    icon: Bell, // Changed icon to differentiate
  },
  {
    title: "Selected Students",
    url: "/company/selected",
    icon: Search,
  }
];

const CompanySidebar = () => {
  const { setOpenMobile } = useSidebar();

  const handleItemClick = () => {
    // Close sidebar on mobile/small screens when item is clicked
    setOpenMobile(false);
  };

  return (
      <Sidebar collapsible="icon">
        <SidebarHeader className="py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <Image src="/logo.jpg" alt="logo" width={20} height={20} className="rounded-full"/>
                  <span>Industry Day 2025</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Company Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url} onClick={handleItemClick}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> John Doe <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Account</DropdownMenuItem>
                  <DropdownMenuItem>Setting</DropdownMenuItem>
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
  );
};

export default CompanySidebar;