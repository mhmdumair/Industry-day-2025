import Link from 'next/link'
import React from 'react'
import { Button } from "../ui/button"
import { PanelLeftOpen, Home } from "lucide-react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

function CompanyNavbar() {
    return (
        <header className="w-[95%] shadow-sm bg-slate-100 border border-black rounded-md">
            <div className="w-full mx-auto px-4 py-3 flex items-center justify-between relative">

                {/* Left Section: Sidebar Toggle + Logo + Title */}
                <div className="flex items-center gap-3">
                    {/* Sidebar Toggle - Always leftmost for both desktop and mobile */}
                    <SidebarTrigger className="p-2 hover:bg-slate-200 rounded-md transition-colors">
                        <PanelLeftOpen className="h-5 w-5" />
                    </SidebarTrigger>

                    {/* Logo and Title */}
                    <div className="flex items-center gap-2">
                        <img src="/unilogo.png" alt="University Logo" className="h-10 sm:h-12 w-auto" />
                        <div className="font-inter text-base sm:text-2xl font-bold leading-tight text-black">
                            INDUSTRY DAY 2025<br />
                            <span className="text-sm sm:text-xl font-normal">Faculty of Science</span>
                        </div>
                    </div>
                </div>

                {/* Right Section: Navigation + Mobile Menu + Home Icon */}
                <div className="flex items-center gap-4">
                    {/* Home Icon - Right corner for both desktop and mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="p-2 hover:bg-slate-200 rounded-md transition-colors"
                    >
                        <Link href="/home" title="Go to Home">
                            <Home className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default CompanyNavbar
