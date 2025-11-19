"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import api from "@/lib/axios"
import { Button } from "../ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "../common/mode-toggle"

export default function AuthNavbar() {
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
              <h1 className="lg:text-3xl md:text-4xl text-xl font-extrabold text-black dark:text-white lg:leading-7 tracking-tighter leading-5 md:leading-7">
                INDUSTRY DAY 2025
              </h1>
              <span className="text-xs md:text-base lg:text-base font-bold text-gray-700 dark:text-gray-300">
                FACULTY OF SCIENCE
              </span>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 ml-3">
            <ModeToggle />
            <Link href={"/"}>
              {/* Desktop: Full text button */}
              <Button
                variant="secondary"
                className="hidden sm:flex rounded-none bg-white dark:bg-transparent border-1 border-grey-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                disabled={isLoading}
                title="Go to SIIC Website"
              >
                Back to SIIC Website
              </Button>
              {/* Mobile: Icon only */}
              <Button
                variant="secondary"
                size="icon"
                className="sm:hidden rounded-none bg-white dark:bg-transparent border-1 border-grey-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                disabled={isLoading}
                title="Go to SIIC Website"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
