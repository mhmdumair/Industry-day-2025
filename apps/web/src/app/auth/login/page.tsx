"use client"
import { LoginForm } from "@/components/auth/login-form"
//import {Header} from "@/components/common/header";

export default function LoginPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 font-inter">
            <div className="flex w-full max-w-lg flex-col gap-6">
                    <LoginForm className="justify-center items-center"/>
            </div>
        </div>
    )
}