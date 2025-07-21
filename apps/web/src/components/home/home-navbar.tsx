"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"

export default function Navbar() {
    const router = useRouter()

    return (
        <header className="w-full border-b shadow-sm bg-amber-300">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2 sm:gap-0">

                {/* Logo + Title + Mobile Menu Trigger */}
                <div className="flex items-center gap-2 max-sm:w-full max-sm:justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/unilogo.png" alt="University Logo" className="h-10 sm:h-12 w-auto" />
                        <div className="text-sm sm:text-xl font-bold leading-tight text-black dark:text-white">
                            INDUSTRY DAY 2025<br />
                            <span className="text-xs sm:text-lg font-normal">Faculty of Science</span>
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
                            <SheetContent side="right" className="p-6 space-y-4">
                                <Link href="/home" className="block text-base text-muted-foreground hover:text-foreground">Home</Link>
                                <Link href="/home/map" className="block text-base text-muted-foreground hover:text-foreground">Map</Link>
                                <Link href="/home/live" className="block text-base text-muted-foreground hover:text-foreground">Live Queues</Link>
                                <Button className="w-full" onClick={() => router.push("/company/profile")}>Dashboard</Button>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden sm:flex gap-6 items-center">
                    <Link href="/home" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
                    <Link href="/home/map" className="text-sm text-muted-foreground hover:text-foreground">Map</Link>
                    <Link href="/home/live" className="text-sm text-muted-foreground hover:text-foreground">Live Queues</Link>
                    <Button size="sm" onClick={() => router.push("/company/profile")}>Dashboard</Button>
                </nav>

                {/* Avatar */}
                <div className="hidden sm:flex ml-4">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-200">
                        <AvatarImage src="https://github.com/shadcn.png" alt="Company Logo" />
                    </Avatar>
                </div>
            </div>
        </header>
    )
}
