"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import api from "../../lib/axios"

export default function HomeNavbar() {
  const searchParams = useSearchParams()
  const userId = searchParams.get("id") ?? ""
  const [isLoading, setIsLoading] = useState(false)

  const handleDashboardClick = async () => {
    setIsLoading(true)
    try {
      if (!userId) return
      const { data: userData } = await api.get(`/user/${userId}`)
      const role = userData.role?.toLowerCase()

      if (role === "student") {
        const { data } = await api.get(`/student/by-user/${userId}`)
        window.location.href = `/student/profile?studentId=${data.studentID}`
      } else if (role === "company") {
        const { data } = await api.get(`/company/by-user/${userId}`)
        window.location.href = `/company/profile?companyId=${data.companyID}`
      } else if (role === "admin") {
        const { data } = await api.get(`/admin/by-user/${userId}`)
        window.location.href = `/admin/profile?adminId=${data.adminID}`
      } else if (role === "room_admin") {
        const { data } = await api.get(`/room-admin/by-user/${userId}`)
        window.location.href = `/room-admin/profile?roomAdminId=${data.roomAdminID}`
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="w-full shadow-sm bg-slate-100 border border-black rounded-md">
      <div className="w-full mx-auto px-4 py-3 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <img src="/unilogo.png" alt="University Logo" className="h-10 sm:h-20 w-auto" />
          <div className="text-2xl sm:text-3xl font-bold leading-none text-green-950">
            INDUSTRY DAY 2025<br />
            <span className="text-lg sm:text-xl font-normal">Faculty of Science</span>
          </div>
        </div>

        <nav className="hidden lg:flex gap-6 items-center absolute left-1/2 transform -translate-x-1/2">
          <Link href={`/home?id=${userId}`} className="text-lg lg:text-xl font-medium hover:text-green-600 transition-colors text-black">Home</Link>
          <Link href={`/home/map?id=${userId}`} className="text-lg lg:text-xl font-medium hover:text-green-700 transition-colors text-black">Map</Link>
          <Link href={`/home/live?id=${userId}`} className="text-lg lg:text-xl font-medium hover:text-green-600 transition-colors text-black">Live Queues</Link>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Button size="sm" onClick={handleDashboardClick} disabled={isLoading}>
            {isLoading ? "Loading..." : "Dashboard"}
          </Button>
          <Avatar className="h-10 w-10 ring-2 ring-blue-200">
            <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>

        <div className="lg:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-6 space-y-4">
              <Link href={`/home?id=${userId}`} className="block hover:text-green-600 transition-colors text-black">Home</Link>
              <Link href={`/home/map?id=${userId}`} className="block hover:text-green-600 transition-colors text-black">Map</Link>
              <Link href={`/home/live?id=${userId}`} className="block hover:text-green-600 transition-colors text-black">Live Queues</Link>
              <div className="pt-4 border-t">
                <Button className="w-full" onClick={handleDashboardClick} disabled={isLoading}>
                  {isLoading ? "Loading..." : "Dashboard"}
                </Button>
                <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-md">
                  <Avatar className="h-8 w-8 ring-2 ring-blue-200">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">Profile</span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
