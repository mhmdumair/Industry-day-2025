"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import api from "../../lib/axios";
import { AxiosError } from "axios";

export default function HomeNavbar() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDashboardClick = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/user/dashboard');
            router.push(data.redirectUrl)
            
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            if (error instanceof AxiosError && error.response?.status === 401) {
                console.log("Unauthorized. Redirecting to login page.");
                router.push('/auth/login');
            } else {
                console.log("An unexpected error occurred. Redirecting to login page.");
                router.push('/auth/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <header className="w-full bg-white border-b border-gray-200">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3">
                        <img 
                            src="/unilogo.png" 
                            alt="University Logo" 
                            className="h-10 w-10" 
                        />
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-extrabold text-black leading-tight">
                                INDUSTRY DAY 2025
                            </h1>
                            <span className="text-sm text-gray-700 leading-tight">
                                FACULTY OF SCIENCE
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link 
                            href="/home" 
                            className="text-gray-700 hover:text-black transition-colors font-medium"
                        >
                            Home
                        </Link>
                        <Link 
                            href="/home/map" 
                            className="text-gray-700 hover:text-black transition-colors font-medium"
                        >
                            Map
                        </Link>
                        <Link 
                            href="/home/live" 
                            className="text-gray-700 hover:text-black transition-colors font-medium"
                        >
                            Live Queues
                        </Link>
                    </nav>

                    {/* Dashboard Button - Desktop */}
                    <div className="hidden md:block">
                        <Button 
                            onClick={handleDashboardClick} 
                            disabled={isLoading}
                            className="rounded-none bg-black hover:bg-gray-800 text-white px-6"
                        >
                            {isLoading ? "Loading..." : "Dashboard"}
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="rounded-none"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="rounded-none">
                                <nav className="flex flex-col space-y-4 mt-8">
                                    <Link 
                                        href="/home" 
                                        className="text-lg font-medium text-gray-700 hover:text-black transition-colors"
                                    >
                                        Home
                                    </Link>
                                    <Link 
                                        href="/home/map" 
                                        className="text-lg font-medium text-gray-700 hover:text-black transition-colors"
                                    >
                                        Map
                                    </Link>
                                    <Link 
                                        href="/home/live" 
                                        className="text-lg font-medium text-gray-700 hover:text-black transition-colors"
                                    >
                                        Live Queues
                                    </Link>
                                    <div className="pt-4 border-t">
                                        <Button 
                                            className="w-full rounded-none bg-black hover:bg-gray-800 text-white"
                                            onClick={handleDashboardClick} 
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Loading..." : "Dashboard"}
                                        </Button>
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}