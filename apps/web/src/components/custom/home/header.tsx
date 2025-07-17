"use client"
import Sidebar from './sidebar'
import { Button } from "@/components/ui/button"

// You can change this to props if you want dynamic children or logo, etc.
export default function SiteHeader() {
    return (
        <header className="w-full border-b">
        <div className="flex h-14 items-center px-4 justify-between bg-slate-400">
            {/* Sidebar/hamburger icon on mobile only */}
            <Sidebar className="md:hidden" />
        {/* Dashboard button: always visible */}
        <div className="flex-1 flex justify-end">
    <Button variant="default">Dashboard</Button>
        </div>
        </div>
        </header>
)
}
