"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";

const navItems = [
  { title: "Profile", url: "/room-admin/profile" },
  { title: "Stalls", url: "/room-admin/stalls" },
];

export default function RoomAdminNavbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const roomAdminId = searchParams.get("roomAdminId");
  const [roomAdminName, setRoomAdminName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchRoomAdminInfo = async () => {
      try {
        setLoading(true);
        const response = await api.get("/room-admin/by-user");
        // Get the full name from the user object
        const firstName = response.data.user?.first_name || "";
        const lastName = response.data.user?.last_name || "";
        const fullName = `${firstName} ${lastName}`.trim();
        setRoomAdminName(fullName || "Room Admin");
      } catch (error) {
        console.error("Failed to fetch room admin info", error);
        setRoomAdminName("Room Admin");
      } finally {
        setLoading(false);
      }
    };
    fetchRoomAdminInfo();
  }, []);

  return (
    <header className="w-full bg-white dark:bg-transparent border-b border-gray-200 dark:border-gray-800 relative">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Room Admin branding */}
          <div className="flex items-center">
            <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-none border-1 border-gray-100/50">
              <span className="text-base font-semibold">
                {loading ? "Loading..." : roomAdminName}
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex justify-start gap-6 ml-6">
              {navItems.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <Link
                    key={item.title}
                    href={`${item.url}${
                      roomAdminId ? `?roomAdminId=${roomAdminId}` : ""
                    }`}
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
          {/* Mobile Menu Button */}
          <div className="ml-auto">
            <Button
              variant="secondary"
              size="icon"
              className="lg:hidden rounded-none bg-white dark:bg-transparent border-1 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-black flex flex-col gap-4 p-4 shadow-md border-b border-gray-200 dark:border-gray-800 z-50">
            {navItems.map((item) => {
              const isActive = pathname === item.url;

              return (
                <Link
                  key={item.title}
                  href={`${item.url}${roomAdminId ? `?roomAdminId=${roomAdminId}` : ""}`}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm font-medium py-2 ${
                    isActive
                      ? "text-black font-semibold bg-gray-100/90 px-5 py-3"
                      : "text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white px-5 py-3"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}