"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "../common/mode-toggle";
import { Home } from "lucide-react";
import { Button } from "../ui/button";
import api from "@/lib/axios";

const navItems = [
  { title: "Profile", url: "/company/profile" },
  { title: "Pre-listed", url: "/company/pre-listed" },
  { title: "Interviews", url: "/company/interviews" },
  { title: "Announcements", url: "/company/announcements" },
  { title: "Feedback", url: "/company/feedback" },
];

export default function CompanyNavbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const companyId = searchParams.get("companyId");
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        setLoading(true);
        const response = await api.get("/company/by-user");
        setCompanyName(response.data.companyName);
      } catch (error) {
        console.error("Failed to fetch company name", error);
        setCompanyName("Company");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyName();
  }, []);

  return (
    <header className="w-full bg-white dark:bg-transparent border-b border-gray-200 dark:border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Company branding */}
          <div className="flex items-center">
            <div className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-none border-1 border-gray-100/50">
              <span className="text-base font-semibold">
                {loading ? "Loading..." : companyName}
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
                      companyId ? `?companyId=${companyId}` : ""
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
