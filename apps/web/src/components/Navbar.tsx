"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Menu, Moon, Settings, Sun, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { useTheme } from "next-themes"
import { SidebarTrigger } from "./ui/sidebar"

function Navbar() {

    const { setTheme } = useTheme()
  return (
    <div className='px-4 pt-3 flex items-center justify-between'>
        {/* {left} */}
        <SidebarTrigger />
        {/* {right} */}
        <div className='flex items-center gap-4'>
            <Link href="/dashboard">Dashboard</Link>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src="/logo.jpg" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={10}>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <User className="h-[1.2rem] w-[1.2rem] mr-2" />Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive">
                        <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu> 

                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu size="icon"/>
                        <span className="sr-only">Open Menu</span>
                    </Button>
                </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
        </div>
    </div>
  )
}

export default Navbar