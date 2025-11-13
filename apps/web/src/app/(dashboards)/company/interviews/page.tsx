"use client";

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import api from "@/lib/axios";
import { AxiosError } from "axios";

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
    designation: string;
    contact: string;
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

    const [stalls, setStalls] = useState<Stall[]>([]);
    const [roomAdmins, setRoomAdmins] = useState<{ [key: string]: RoomAdmin[] }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch company data for the authenticated user
                const companyResponse = await api.get('/company/by-user');
                const companyId = companyResponse.data.companyID;

                // Fetch stalls by company ID
                const stallsResponse = await api.get(`/stall/company/${companyId}`);
                const fetchedStalls: Stall[] = stallsResponse.data;
                setStalls(fetchedStalls);

                const uniqueRoomIds = [...new Set(fetchedStalls.map(stall => stall.roomID))];
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
            } catch (err) {
                console.error("Failed to fetch data:", err);
                if (err instanceof AxiosError && err.response?.status === 401) {
                    router.push('/auth/login');
                }
                setError("Failed to fetch stalls and room admin data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleStallClick = (stallId: string) => {
        // Redirect to the interviews queue page with the stall ID
        // companyId is no longer needed in the URL
        router.push(`/company/interviews/queue?stallId=${stallId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
                <Card className="rounded-none bg-slate-100/80 dark:bg-gray-900">
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
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
                <Card className="rounded-none bg-red-100/80 border-red-300 dark:bg-red-950">
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
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
                <Card className="rounded-none bg-slate-100/80 dark:bg-gray-900">
                    <CardHeader>
                        <CardTitle>No Stalls Found</CardTitle>
                        <CardDescription>No interview stalls found for this company</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* 2 Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Stalls */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Interview Stalls</h2>
                        {stalls.map((stall) => (
                            <div
                                key={stall.stallID}
                                onClick={() => handleStallClick(stall.stallID)}
                                className="cursor-pointer"
                            >
                                <Card className="rounded-none hover:bg-slate-200 dark:hover:bg-gray-800 transition-colors duration-150 border-1">
                                    <CardHeader>
                                        <CardTitle>{stall.title}</CardTitle>
                                        <CardDescription>
                                            Location: {stall.room.roomName} - {stall.room.location}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            <p><strong>Preference:</strong> {stall.preference}</p>
                                            <p><strong>Status:</strong> {stall.status}</p>
                                            <p><strong>Room:</strong> {stall.room.roomName}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                            To add more interview stalls, contact the respective room admin
                        </p>
                    </div>

                    {/* Right Column - Room Admins */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Room Administrator</h2>
                        {Object.entries(roomAdmins).map(([roomId, admins]) => {
                            const room = stalls.find(s => s.roomID === roomId)?.room;
                            if (!room || admins.length === 0) return null;

                            return (
                                <Card key={roomId} className="rounded-none bg-teal-800/60 dark:bg-teal-950 border-green-950 dark:border-teal-900">
                                    <CardHeader>
                                        <CardTitle className="text-white">{room.roomName}</CardTitle>
                                        <CardDescription className="text-teal-950 dark:text-teal-300">
                                            Location: {room.location}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-white">
                                        {admins.map((admin, index) => (
                                            <div key={admin.roomAdminID} className="mb-2">
                                                {admins.length > 1 && <strong>Admin {index + 1}:</strong>}<br />
                                                Name: {admin.user.first_name} {admin.user.last_name}<br />
                                                Email: {admin.user.email}<br />
                                                Contact: {admin.contact}<br />
                                                {index < admins.length - 1 && <hr className="my-2 border-teal-700" />}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;