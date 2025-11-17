"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "../common/mode-toggle";
import { Home } from "lucide-react";
import { Button } from "../ui/button";
import api from "@/lib/axios";

const navItems = [
  { title: "Profile", url: "/student/profile" },
  { title: "Register", url: "/student/register" },
  { title: "Interviews", url: "/student/interviews" },
  { title: "Feedback", url: "/student/feedback" },
];

export default function StudentNavbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const studentId = searchParams.get("studentId");
  const [studentRegNo, setStudentRegNo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        setLoading(true);
        const response = await api.get("/student/by-user");
        setStudentRegNo(response.data.regNo);
      } catch (error) {
        console.error("Failed to fetch student info", error);
        setStudentRegNo("Student");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentInfo();
  }, []);

  return (
    <header className="w-full bg-white dark:bg-transparent border-b border-gray-200 dark:border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Student branding */}
          <div className="flex items-center">
            <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-none border-1 border-gray-100/50">
              <span className="text-base font-semibold">
                {loading ? "Loading..." : studentRegNo}
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
                      studentId ? `?studentId=${studentId}` : ""
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
        </div>
      </div>
    </header>
  );
}
