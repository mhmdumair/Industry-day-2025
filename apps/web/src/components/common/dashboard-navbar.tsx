"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import api from "@/lib/axios"
import { Button } from "../ui/button"
import { Home } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"
import Link from "next/link"

export default function DashboardNavbar() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  const handleHomeClick = async () => {
    setIsLoading(true)

    try {
      const companyId = searchParams.get("companyId")
      const studentId = searchParams.get("studentId")
      const adminId = searchParams.get("adminId")

      let userId: string | undefined

      if (companyId) {
        const { data } = await api.get(`/company/${companyId}`)
        userId = data.user.userID
      } else if (studentId) {
        const { data } = await api.get(`/student/${studentId}`)
        userId = data.user?.userID
      } else if (adminId) {
        const { data } = await api.get(`/admin/${adminId}`)
        userId = data.user?.userID
        console.log(data)
      }

      if (userId) {
        window.location.href = `/home`
      } else {
        console.warn("Unable to resolve userId — sending to generic /home")
        console.log("problem")
      }
    } catch (err) {
      console.error("Could not fetch userId:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="w-full bg-white dark:bg-transparent border-b border-gray-200 dark:border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <img
              src="/unilogo.png"
              alt="University Logo"
              className="h-12 w-12"
            />
            <div className="flex flex-col">
              <h1 className="text-4xl font-extrabold text-black dark:text-white leading-7">
                INDUSTRY DAY 2025
              </h1>
              <span className="text-base font-bold text-gray-700 dark:text-gray-300">
                FACULTY OF SCIENCE
              </span>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link href={"/home"}>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-none bg-white dark:bg-transparent border-1 border-grey-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                disabled={isLoading}
                title="Go to Home"
              >
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
