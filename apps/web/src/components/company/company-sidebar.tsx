<<<<<<< HEAD
=======
// "use client";

>>>>>>> 22239e97375431b827c1fb5b089ce2e6b69f43d6
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
} from "../ui/sidebar";
import React from "react";

const items = [
  { title: "Profile", url: "/company/profile", icon: Home },
  { title: "Interviews", url: "/company/interviews", icon: Inbox },
  { title: "Pre-listed", url: "/company/pre-listed", icon: List },
  { title: "Announcements", url: "/company/announcements", icon: Bell },
  { title: "Selected Students", url: "/company/selected", icon: Search },
];

const CompanySidebar = () => {
<<<<<<< HEAD
=======
  // const { setOpenMobile, collapsed } = useSidebar();
  // const pathname = usePathname();

  // const handleItemClick = () => {
  //   setOpenMobile(false);
  // };

>>>>>>> 22239e97375431b827c1fb5b089ce2e6b69f43d6
  return (
      <Sidebar
          collapsible="icon"
          className="min-h-screen bg-black border-slate-700"
      >
        {/* Sidebar Header */}
        <SidebarHeader className="py-4 h-16 flex items-center justify-between bg-slate-100 px-3">
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent className="bg-slate-100">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
<<<<<<< HEAD
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                          asChild
                          className="h-12 mb-1 hover:bg-slate-100"
                      >
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
=======
                {items.map((item) => {
                  // const isActive = pathname === item.url;
                  return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild className="h-16">
                          <Link
                              href={item.url}
                              // onClick={handleItemClick}
                              // className={`flex items-center gap-3 px-3 py-2 transition-all duration-200 ${
                              //     isActive
                              //         ? "bg-slate-400 text-white font-semibold"
                              //         : "hover:bg-slate-200"
                              // }`}
                          >
                            <item.icon className="w-16" />
                            {/* {!collapsed && (
                                <span className="text-lg">{item.title}</span>
                            )} */}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                  );
                })}
>>>>>>> 22239e97375431b827c1fb5b089ce2e6b69f43d6
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  );
};

export default CompanySidebar;
