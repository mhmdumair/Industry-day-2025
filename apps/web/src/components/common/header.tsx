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
            className={`w-full max-w-5xl mx-auto py-6 px-4 relative flex flex-col items-center justify-center ${className}`}
            {...props}
        >
            {/* Background card */}
            <div className="absolute inset-0 top-1 bg-[#167C94] rounded-md shadow-md border border-black z-0"></div>

            {/* Main title */}
            <h1 className="relative z-10 text-center text-white text-3xl sm:text-4xl md:text-5xl font-extrabold drop-shadow-md font-inter">
                Industry Day 2025
            </h1>

            {/* Subtitle */}
            <p className="relative z-10 mt-2 text-center text-white text-sm sm:text-base md:text-lg font-medium drop-shadow-md font-inter">
                Faculty of Science, University of Peradeniya
            </p>
        </header>
    );
}
