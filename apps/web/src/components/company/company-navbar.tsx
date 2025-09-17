"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import api from "@/lib/axios"

import { Button } from "../ui/button"
import { Home } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"

export default function CompanyNavbar() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading]= useState(false)

  const handleHomeClick = async () => {
    setIsLoading(true)

    try {
      const companyId   = searchParams.get("companyId")
      const studentId   = searchParams.get("studentId")
      const adminId     = searchParams.get("adminId")

      let userId: string | undefined

      if (companyId) {
        const { data } = await api.get(`/company/${companyId}`)
        userId =  data.user.userID
      } else if (studentId) {
        const { data } = await api.get(`/student/${studentId}`)
        userId = data.user?.userID
      } else if (adminId) {
        const { data } = await api.get(`/admin/${adminId}`)
        userId = data.user?.userID
        console.log(data);
      }

      if (userId) {
        window.location.href = `/home`
      } else {
        console.warn("Unable to resolve userId — sending to generic /home")
        console.log("problem");
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
          <SidebarTrigger/>

          <div className="flex items-center gap-2">
            <img src="/unilogo.png" alt="University Logo" className="h-10 sm:h-12 w-auto" />
            <div className="font-inter text-base sm:text-2xl font-bold leading-tight text-black">
              INDUSTRY DAY 2025<br />
              <span className="text-sm sm:text-xl font-normal">Faculty of Science</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href={"/home"}>
              <Button
              variant="ghost"
              size="icon"
              className="p-2 hover:bg-slate-200 rounded-md transition-colors"
              disabled={isLoading}
              title="Go to Home"
            >
              <Home className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
