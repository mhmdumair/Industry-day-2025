"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import api from "../../lib/axios";
import { AxiosError } from "axios";
import { ModeToggle } from "../common/mode-toggle";

export default function HomeNavbar() {
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

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
                    <div className="flex items-start lg:gap-3 gap-1">
                        <img
                            src="/unilogo.png"
                            alt="University Logo"
                            className="lg:h-12 h-8 w-auto"
                        />
                        <div className="flex flex-col">
                        <h1 className="lg:text-3xl md:text-4xl text-xl font-extrabold text-black dark:text-white lg:leading-7 tracking-tighter leading-5 md:leading-7">
                            INDUSTRY DAY 2025
                        </h1>
                        <span className="text-xs md:text-base lg:text-base font-bold text-gray-700 dark:text-gray-300">
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
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-none bg-white dark:bg-transparent border-1 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => setMenuOpen((prev) => !prev)}
                        >
                            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {menuOpen && (
                    <div className="md:hidden fixed top-16 left-0 w-full bg-white dark:bg-black z-50 flex flex-col gap-4 p-4 shadow-md border-b border-gray-200 dark:border-gray-800">
                        <Link
                            href="/home"
                            onClick={() => setMenuOpen(false)}
                            className={`text-sm font-medium py-2 ${
                                pathname === "/home"
                                    ? "text-black font-semibold bg-gray-100/90 px-5 py-3"
                                    : "text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white px-5 py-3"
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/home/map"
                            onClick={() => setMenuOpen(false)}
                            className={`text-sm font-medium py-2 ${
                                pathname === "/home/map"
                                    ? "text-black font-semibold bg-gray-100/90 px-5 py-3"
                                    : "text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white px-5 py-3"
                            }`}
                        >
                            Map
                        </Link>
                        <Link
                            href="/home/live"
                            onClick={() => setMenuOpen(false)}
                            className={`text-sm font-medium py-2 ${
                                pathname === "/home/live"
                                    ? "text-black font-semibold bg-gray-100/90 px-5 py-3"
                                    : "text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white px-5 py-3"
                            }`}
                        >
                            Live Queues
                        </Link>
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-800 space-y-2">
                            <Button
                                className="w-full rounded-none bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black"
                                onClick={() => {
                                    handleDashboardClick();
                                    setMenuOpen(false);
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : isAuthenticated ? "Dashboard" : "Login"}
                            </Button>
                            {isAuthenticated && (
                                <Button
                                    className="w-full rounded-none"
                                    onClick={() => {
                                        handleLogout();
                                        setMenuOpen(false);
                                    }}
                                    disabled={isLoading}
                                    variant="outline"
                                >
                                    Logout
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}