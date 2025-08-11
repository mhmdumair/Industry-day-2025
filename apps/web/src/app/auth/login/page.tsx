"use client"
import { LoginForm } from "@/components/auth/login-form"
import LoginNavbar from "@/components/auth/auth-navbar";

export default function LoginPage() {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <LoginNavbar/>
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 md:p-10 font-inter">
                <div className="flex w-full flex-col gap-6">
                    <LoginForm className="justify-center items-center"/>
                </div>
            </div>
        </div>
    )
}