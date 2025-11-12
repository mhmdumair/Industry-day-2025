"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "../common/mode-toggle";
import { Home } from "lucide-react";
import { Button } from "../ui/button";

const navItems = [
  { title: "Profile", url: "/admin/profile" },
  { title: "Students", url: "/admin/students" },
  { title: "Companies", url: "/admin/companies" },
  { title: "Interviews", url: "/admin/interviews" },
  { title: "Announcements", url: "/admin/announcements" },
  { title: "Rooms", url: "/admin/rooms" },
  { title: "Room Admins", url: "/admin/room-admins" },
  { title: "Stalls", url: "/admin/stalls" },
  { title: "Feedbacks", url: "/admin/feedback" },
  { title: "Upload CV", url: "/admin/student-cv" },
];

export default function AdminNavbar() {
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");

  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Admin branding */}
          <div className="flex items-center">
            <div className="bg-gray-900 dark:bg-gray-800 text-white px-6 py-2 rounded-none">
              <span className="text-base font-semibold">Admin Dashboard</span>
            </div>
          </div>

          {/* Center - Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={`${item.url}${adminId ? `?adminId=${adminId}` : ""}`}
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors font-medium text-sm"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link href="/home">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-none bg-white dark:bg-transparent border-1 border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Go to Home"
              >
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
