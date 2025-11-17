"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import api from "../../lib/axios";
import { AxiosError } from "axios";
import { ModeToggle } from "../common/mode-toggle";

export default function HomeNavbar() {
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check authentication status on mount
        const checkAuth = async () => {
            try {
                await api.get('/user/dashboard');
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    const handleDashboardClick = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/user/dashboard');
            setIsAuthenticated(true);
            router.push(data.redirectUrl);

        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            if (error instanceof AxiosError && error.response?.status === 401) {
                console.log("Unauthorized. Redirecting to login page.");
                setIsAuthenticated(false);
                router.push('/auth/login');
            } else {
                console.log("An unexpected error occurred. Redirecting to login page.");
                setIsAuthenticated(false);
                router.push('/auth/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await api.post('/auth/logout');
            setIsAuthenticated(false);
            router.push('/');
        } catch (error) {
            console.error("Failed to logout:", error);
            // Even if logout fails, clear local state and redirect
            setIsAuthenticated(false);
            router.push('/home');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <header className="w-full bg-white dark:bg-transparent border-b border-gray-200 dark:border-gray-800">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 relative">
                    {/* Logo and Title */}
                    <div className="flex items-start gap-3">
                        <img
                            src="/unilogo.png"
                            alt="University Logo"
                            className="h-12 w-12"
                        />
                        <div className="flex flex-col">
                            <h1 className="text-4xl font-extrabold text-black dark:text-white leading-7">
                            INDUSTRY DAY 2025
                            </h1>
                            <span className="text-base font-bold text-gray-700 dark:text-gray-300">
                            FACULTY OF SCIENCE
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                        <Link
                            href="/home"
                            className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors font-medium"
                        >
                            Home
                        </Link>
                        <Link
                            href="/home/map"
                            className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors font-medium"
                        >
                            Map
                        </Link>
                        <Link
                            href="/home/live"
                            className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors font-medium"
                        >
                            Live Queues
                        </Link>
                    </nav>

                    {/* Dashboard/Login and Logout Buttons - Desktop */}
                    <div className="hidden md:flex items-center gap-2">
                        <ModeToggle/>
                        <Button
                            onClick={handleDashboardClick}
                            disabled={isLoading}
                            className="rounded-none bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black px-6"
                        >
                            {isLoading ? "Loading..." : isAuthenticated ? "Dashboard" : "Login"}
                        </Button>
                        {isAuthenticated && (
                            <Button
                                onClick={handleLogout}
                                disabled={isLoading}
                                variant="outline"
                                className="rounded-none px-6"
                            >
                                Logout
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <ModeToggle/>
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
                            <SheetContent side="right" className="rounded-none bg-white dark:bg-gray-950">
                                <nav className="flex flex-col space-y-4 mt-8">
                                    <Link
                                        href="/home"
                                        className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/home/map"
                                        className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        Map
                                    </Link>
                                    <Link
                                        href="/home/live"
                                        className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        Live Queues
                                    </Link>
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                                        <Button
                                            className="w-full rounded-none bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black"
                                            onClick={handleDashboardClick}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Loading..." : isAuthenticated ? "Dashboard" : "Login"}
                                        </Button>
                                        {isAuthenticated && (
                                            <Button
                                                className="w-full rounded-none"
                                                onClick={handleLogout}
                                                disabled={isLoading}
                                                variant="outline"
                                            >
                                                Logout
                                            </Button>
                                        )}
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