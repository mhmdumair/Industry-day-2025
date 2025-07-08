"use client"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import React from 'react'
import { Button } from "../ui/button"
import { SidebarTrigger } from "../ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

function Navbar() {
    const router = useRouter();

    return (
        <div className="flex items-center h-25 bg-slate-300 w-full px-4 pt-3">
            {/* Sidebar Trigger on the left */}
            <div className="flex items-center">
                <SidebarTrigger className="h-16 w-16"/>
            </div>

            {/* Center (Tabs) */}
            <div className="flex-1 flex justify-center">
                <Tabs defaultValue="home" className="w-fit text-xl">
                    <TabsList>
                        <TabsTrigger value="home" asChild>
                            <Link href="/home" className="px-4 py-2 text-xl">Home</Link>
                        </TabsTrigger>
                        <TabsTrigger value="map" asChild>
                            <Link href="/home/map" className="px-4 py-2 text-xl">Map</Link>
                        </TabsTrigger>
                        <TabsTrigger value="live" asChild>
                            <Link href="/home/live" className="px-4 py-2 text-xl">Live Queues</Link>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Right (Avatar + Dashboard Button) */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    className="text-base text-white px-6 py-2 border-black bg-slate-700"
                    onClick={() => router.push('/company/profile')}
                >
                    Dashboard
                </Button>
                <Avatar className="h-16 w-16 ring-4 ring-blue-100">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Company Logo" />
                </Avatar>
            </div>
        </div>
    )
}

export default Navbar
