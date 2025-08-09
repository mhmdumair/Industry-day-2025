import React from 'react'

function LoginNavbar() {
    return (
        <header className="w-full h-[10vh] shadow-sm bg-slate-100 border border-black mt-3 rounded-md flex items-center justify-center">
            {/* Logo and Title - Centered */}
            <div className="flex items-center gap-2">
                <img src="/unilogo.png" alt="University Logo" className="h-10 sm:h-12 w-auto" />
                <div className="font-inter text-2xl lg:text-4xl font-bold leading-tight text-black">
                    INDUSTRY DAY 2025
                </div>
            </div>
        </header>
    )
}

export default LoginNavbar