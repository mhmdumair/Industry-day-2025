"use client";

import React from "react";
import RoomAdminSidebar from "@/components/roomadmin/roomadmin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import RoomAdminNavbar from "@/components/roomadmin/roomadmin-navbar";

export default function RoomAdminLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex antialiased bg-transparent w-full ml-3 mr-3">
                <RoomAdminSidebar />
                <main className="flex flex-col min-h-screen w-full">
                    <RoomAdminNavbar />
                    <div className="w-full p-2 sm:p-4">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}