"use client";

import React from "react";
import CreateRoom from "../../../../components/admin/create-room";
import RoomsListCard from "../../../../components/admin/room-list";

export default function RoomsPage() {
    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Room Management</h1>
                <p className="text-gray-600 dark:text-gray-300">Create and manage rooms in the system</p>
            </div>
            
            <div className="space-y-6">
                <CreateRoom />
                <RoomsListCard />
            </div>
        </div>
    );
}
