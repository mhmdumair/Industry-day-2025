import React from 'react';

interface HeaderProps extends React.ComponentProps<"header"> {
    className?: string;
}

export function Header({
                           className = "",
                           ...props
                       }: HeaderProps) {
    return (
        <header
            className={`w-full max-w-lg h-40 relative ${className}`}
            {...props}
        >
            {/* Background card */}
            <div className="w-full max-w-lg h-30 left-0 top-[6px] absolute bg-[#167C94] rounded-md shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-black"></div>

            {/* Main title */}
            <div className="w-full max-w-lg h-32 left-[1px] top-[25px] absolute text-center justify-center text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-5xl font-extrabold font-inter leading-[48px] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">
                Industry Day 2025
            </div>

            {/* Subtitle */}
            <div className="w-full max-w-lg h-8 left-0 top-[70px] absolute text-center justify-center text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-sm font-medium font-inter leading-[48px] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">
                Faculty of Science, University of Peradeniya
            </div>
        </header>
    );
}