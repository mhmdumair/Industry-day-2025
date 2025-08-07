"use client";

import React from "react";
import CreateRoomCard from "../../../../components/admin/CreateRoomCard";
import RoomsListCard from "../../../../components/admin/RoomListCard";

export default function RoomsPage() {
    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Room Management</h1>
                <p className="text-gray-600">Create and manage rooms in the system</p>
            </div>
            
            <CreateRoomCard />
            <RoomsListCard />
        </div>
    );
}
