"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import api from "@/lib/axios";

interface Room {
    roomID: string;
    roomName: string;
    location: string;
    isActive: boolean;
}

interface Company {
    companyID: string;
    userID: string;
    companyName: string;
    description: string;
    contactPersonName: string;
    contactPersonDesignation: string;
    contactNumber: string;
    logo: string | null;
    sponsership: string;
    location: string;
    companyWebsite: string;
    user: {
        userID: string;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
        profile_picture: string | null;
        created_at: string;
        updated_at: string;
    };
}

interface Stall {
    stallID: string;
    title: string;
    roomID: string;
    companyID: string;
    preference: string;
    status: string;
    room: Room;
    company: Company;
}

interface RoomAdmin {
    roomAdminID: string;
    userID: string;
    roomID: string;
    user: {
        userID: string;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
        profile_picture: string | null;
    };
    room: Room;
}

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const companyId = searchParams.get('companyId');

    const [stalls, setStalls] = useState<Stall[]>([]);
    const [roomAdmins, setRoomAdmins] = useState<{ [key: string]: RoomAdmin[] }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!companyId) {
                setError("Company ID not found in query parameters");
                setLoading(false);
                return;
            }

            try {
                // Fetch stalls by company ID
                const stallsResponse = await api.get(`/stall/company/${companyId}`);
                const fetchedStalls: Stall[] = stallsResponse.data;
                setStalls(fetchedStalls);

                // Get unique room IDs from stalls
                const uniqueRoomIds = [...new Set(fetchedStalls.map(stall => stall.roomID))];

                // Fetch room admins for each unique room
                const roomAdminPromises = uniqueRoomIds.map(async (roomId) => {
                    try {
                        const response = await api.get(`/room-admin/by-room/${roomId}`);
                        return { roomId, admins: response.data };
                    } catch (error) {
                        console.error(`Failed to fetch room admins for room ${roomId}:`, error);
                        return { roomId, admins: [] };
                    }
                });

                const roomAdminResults = await Promise.all(roomAdminPromises);
                const roomAdminMap: { [key: string]: RoomAdmin[] } = {};
                
                roomAdminResults.forEach(({ roomId, admins }) => {
                    roomAdminMap[roomId] = admins;
                });

                setRoomAdmins(roomAdminMap);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setError("Failed to fetch stalls and room admin data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [companyId]);

    const handleStallClick = (stallId: string) => {
        router.push(`/company/interviews/queue?companyId=${companyId}&stallId=${stallId}`);
    };

    if (loading) {
        return (
            <div className="mt-3 mx-auto p-4">
                <Card className="mt-3 bg-slate-100/80">
                    <CardHeader>
                        <CardTitle>Loading...</CardTitle>
                        <CardDescription>Fetching interview stalls and room admin information</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-3 mx-auto p-4">
                <Card className="mt-3 bg-red-100/80 border-red-300">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (stalls.length === 0) {
        return (
            <div className="mt-3 mx-auto p-4">
                <Card className="mt-3 bg-slate-100/80">
                    <CardHeader>
                        <CardTitle>No Stalls Found</CardTitle>
                        <CardDescription>No interview stalls found for this company</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="mt-3 mx-auto p-4">
            <Card className="mt-3 bg-slate-100/80">
                <CardHeader>
                    <CardTitle>Interviews</CardTitle>
                    <CardDescription>List of all interview stalls for {stalls[0]?.company?.companyName}</CardDescription>
                </CardHeader>
                <CardContent>
                    {stalls.map((stall) => (
                        <div 
                            key={stall.stallID}
                            onClick={() => handleStallClick(stall.stallID)} 
                            className="cursor-pointer mb-4"
                        >
                            <Card className="hover:bg-slate-200 transition-colors duration-150">
                                <CardHeader>
                                    <CardTitle>{stall.title}</CardTitle>
                                    <CardDescription>
                                        Location: {stall.room.roomName} - {stall.room.location}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-gray-600">
                                        <p><strong>Preference:</strong> {stall.preference}</p>
                                        <p><strong>Status:</strong> {stall.status}</p>
                                        <p><strong>Room:</strong> {stall.room.roomName}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="m-0">
                    <CardDescription>To add more interview stalls, contact the respective room admin</CardDescription>
                </CardFooter>

                {/* Room Admin Info for each unique room */}
                {Object.entries(roomAdmins).map(([roomId, admins]) => {
                    const room = stalls.find(s => s.roomID === roomId)?.room;
                    if (!room || admins.length === 0) return null;

                    return (
                        <Card key={roomId} className="m-4 bg-teal-800/60 border-green-950">
                            <CardHeader>
                                <CardTitle>Room Admin - {room.roomName}</CardTitle>
                                <CardDescription className="text-teal-950">
                                    Location: {room.location}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {admins.map((admin, index) => (
                                    <div key={admin.roomAdminID} className="mb-2">
                                        {admins.length > 1 && <strong>Admin {index + 1}:</strong>}<br />
                                        Name: {admin.user.first_name} {admin.user.last_name}<br />
                                        Email: {admin.user.email}<br />
                                        {index < admins.length - 1 && <hr className="my-2" />}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    );
                })}
            </Card>
        </div>
    );
}

export default Page;
