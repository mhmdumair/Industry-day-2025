"use client"
import { LoginForm } from "@/components/ui/login-form"

export default function LoginPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 font-inter">
            <div className="flex w-full max-w-sm flex-col gap-6">
                    <div className="w-full max-w-sm h-44 relative">
                        <div className="w-full max-w-sm h-40 left-0 top-[6px] absolute bg-[#167C94] rounded-md shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-solid border-black"></div>
                        <div className="w-full max-w-sm h-8 left-0 top-[119px] absolute text-center justify-center text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-sm font-medium font-inter leading-[48px] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">Faculty of Science, University of Peradeniya</div>
                        <div className="w-full max-w-sm h-32 left-[1px] top-[12px] absolute text-center justify-center text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-5xl font-extrabold font-inter leading-[48px] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">Industry Day<br/>2025</div>
                    </div>
                    <LoginForm/>
            </div>
        </div>
    )
}