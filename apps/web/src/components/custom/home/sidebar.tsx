"use client"

import {
    Home,
    Map,
    Radio, // for Live Queues, you can change icon
} from "lucide-react"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import React from "react"

interface SidebarProps {
    className?: string
}

const items = [
    { title: "Home", url: "/home", icon: Home },
    { title: "Map", url: "/home/map", icon: Map },
    { title: "Live Queues", url: "/home/live", icon: Radio },
]

export default function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className={className}>
                    <Menu size={32} />
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-slate-300">
                {/* Header */}
                <div className="py-4 h-24 flex items-center justify-center bg-slate-300 border-b">
                    {/* Logo or title */}
                    {/*<span className="font-bold text-2xl text-slate-800">Company</span>*/}
                </div>
                {/* Menu */}
                <nav className="bg-slate-300 px-3 py-6 flex flex-col gap-1">
                    {items.map((item) => {
                        const isActive = pathname === item.url
                        return (
                            <Link
                                key={item.title}
                                href={item.url}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-base
                  ${isActive
                                    ? "bg-slate-400 text-white font-semibold"
                                    : "hover:bg-slate-200 text-slate-800"
                                }`}
                            >
                                <item.icon className="w-7 h-7" />
                                <span className="text-lg">{item.title}</span>
                            </Link>
                        )
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    )
}
