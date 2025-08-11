"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import api from "@/lib/axios"

import { Button } from "../ui/button"
import { Home } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function RoomAdminNavbar() {
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading]= useState(false)

    const handleHomeClick = async () => {
        setIsLoading(true)

        try {
            const roomAdminId = searchParams.get("roomAdminId")

            let userId: string | undefined

            if (roomAdminId) {
                const { data } = await api.get(`/room-admin/${roomAdminId}`)
                userId = data.user?.userID
            }

            if (userId) {
                window.location.href = `/home?id=${userId}`
            } else {
                console.warn("Unable to resolve userId — sending to generic /home")
            }
        } catch (err) {
            console.error("Could not fetch userId:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <header className="w-full shadow-sm bg-slate-100 border border-black rounded-md max-w-screen mt-2">
            <div className="w-full mx-auto px-4 py-3 flex items-center justify-between relative">

                <div className="flex items-center gap-3">
                    <SidebarTrigger />

                    <div className="flex items-center gap-2">
                        <img src="/unilogo.png" alt="University Logo" className="h-10 sm:h-12 w-auto" />
                        <div className="font-inter text-base sm:text-2xl font-bold leading-tight text-black">
                            INDUSTRY DAY 2025<br />
                            <span className="text-sm sm:text-xl font-normal">Faculty of Science</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="p-2 hover:bg-slate-200 rounded-md transition-colors"
                        onClick={handleHomeClick}
                        disabled={isLoading}
                        title="Go to Home"
                    >
                        <Home className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    )
}