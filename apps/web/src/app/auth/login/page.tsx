"use client"
import { Suspense } from "react"
import { StudentLoginForm, CompanyLoginForm } from "@/components/auth/login-form"
import AuthNavbar from "@/components/auth/auth-navbar";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black">
            <Suspense fallback={<div className="h-16 border-b border-gray-200 dark:border-gray-800" />}>
                <AuthNavbar/>
            </Suspense>
            <div className="flex-1 flex items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-5xl mx-auto">
                    {/* 2 Column Grid - Centered */}
                    <div className="grid grid-cols-1 gap-8 items-center justify-items-center">
                       {/* Left Column - Student Login */}
                        <div className="w-full max-w-md">
                            <StudentLoginForm />
                        </div>

                        {/* Right Column - Company Login */}
                        <div className="w-full max-w-md">
                            <CompanyLoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}