"use client"
import { StudentLoginForm, CompanyLoginForm } from "@/components/auth/login-form"
import AuthNavbar from "@/components/auth/auth-navbar";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black">
            <AuthNavbar/>
            <div className="flex-1 flex items-center justify-center p-6 md:p-10">
                <div className="max-w-7xl w-full">
                    {/* 2 Column Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Student Login */}
                        <div className="flex flex-col">
                            <StudentLoginForm />
                        </div>

                        {/* Right Column - Company Login */}
                        <div className="flex flex-col">
                            <CompanyLoginForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}