"use client"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import React from 'react'
import {Button} from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Menu} from "lucide-react";
import ExpandableSidebar from "./sidebar"

function Navbar() {
    const router = useRouter();

    return (
        <div className="flex">
        <ExpandableSidebar/>
        <header className="w-full h-20 border-b shadow-sm bg-amber-300">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2 sm:gap-0">
                

                {/* Logo + Title + Mobile Menu Trigger */}
                <div className="flex items-center gap-2 max-sm:w-full max-sm:justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/unilogo.png" alt="University Logo" className="h-10 sm:h-12 w-auto" />
                        <div className="font-inter text-base sm:text-2xl font-bold leading-tight text-black dark:text-white">
                            INDUSTRY DAY 2025<br />
                            <span className="text-sm sm:text-xl font-normal">Faculty of Science</span>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className="sm:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="font-inter p-6 space-y-4 text-black">
                                <Link href="/home" className="block text-lg font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                                    Home
                                </Link>
                                <Link href="/home/map" className="block text-lg font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                                    Map
                                </Link>
                                <Link href="/home/live" className="block text-lg font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                                    Live Queues
                                </Link>
                                <Button className="w-full text-base font-medium" onClick={() => router.push("/company/profile")}>
                                    Dashboard
                                </Button>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden sm:flex gap-6 items-center font-inter">
                    <Link href="/home" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                        Home
                    </Link>
                    <Link href="/home/map" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                        Map
                    </Link>
                    <Link href="/home/live" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                        Live Queues
                    </Link>
                    <Button size="sm" className="text-base font-medium" onClick={() => router.push("/company/profile")}>
                        Dashboard
                    </Button>
                </nav>

                {/* Avatar */}
                <div className="hidden sm:flex ml-4">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-200">
                        <AvatarImage src="https://github.com/shadcn.png" alt="Company Logo" />
                    </Avatar>
                </div>
            </div>
        </header>
        </div>
    )
}

export default Navbar