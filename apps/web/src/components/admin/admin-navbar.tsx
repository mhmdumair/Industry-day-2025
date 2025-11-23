"use client";

import React from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "../common/mode-toggle";
import { Home } from "lucide-react";
import { Button } from "../ui/button";

const navItems = [
  { title: "Profile", url: "/admin/profile" },
  { title: "Students", url: "/admin/students" },
  { title: "Companies", url: "/admin/companies" },
  { title: "Interviews", url: "/admin/interviews" },
  { title: "Reports", url: "/admin/reports" },
  { title: "Announcements", url: "/admin/announcements" },
  { title: "Rooms", url: "/admin/rooms" },
  { title: "Room Admins", url: "/admin/room-admins" },
  { title: "Stalls", url: "/admin/stalls" },
  { title: "Feedbacks", url: "/admin/feedback" },
  { title: "Admins", url: "/admin/admins" }
];

export default function AdminNavbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const adminId = searchParams.get("adminId");

  return (
    <header className="w-full bg-white dark:bg-transparent border-b border-gray-200 dark:border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Admin branding */}
          <div className="flex items-center">
            <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-none border-1 border-gray-100/50">
              <span className="text-base font-semibold">Admin Dashboard</span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex justify-start gap-6 ml-6">
              {navItems.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <Link
                    key={item.title}
                    href={`${item.url}${adminId ? `?adminId=${adminId}` : ""}`}
                    className={`relative text-sm font-medium transition-colors pb-1 ${
                      isActive
                        ? "text-black dark:text-white after:content-[''] after:absolute after:-bottom-[2px] after:left-0 after:w-full after:h-[2px] after:bg-black dark:after:bg-white"
                        : "text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
