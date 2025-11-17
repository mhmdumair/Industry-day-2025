"use client";

import React from "react";
import CreateRoomadmin from "../../../../components/admin/create-roomadmin";
import RoomadminList from "../../../../components/admin/roomadmin-list";

export default function RoomAdminPage() {
    return (
        <div className="container mx-auto p-4 max-w-6xl ">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Room Admin Management</h1>
                <p className="text-primary dark:text-white">Create and manage room administrators in the system</p>
            </div>
            <div className="grid col-1 gap-3">
            <CreateRoomadmin />
            <RoomadminList />
            </div>
            
        </div>
    );
}
