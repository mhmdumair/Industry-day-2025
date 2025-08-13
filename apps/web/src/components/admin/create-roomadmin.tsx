"use client";

import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Room {
    roomID: string;
    roomName: string;
    location: string;
    isActive: boolean;
}

export default function CreateRoomadmin() {
    const [formData, setFormData] = useState({
        user: {
            email: "",
            role: "room_admin",
            first_name: "",
            last_name: "",
            profile_picture: ""
        },
        roomAdmin: {
            designation: "",
            contact: "", // Added contact field
            roomID: "",
        },
    });

    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [roomsError, setRoomsError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Fetch rooms on component mount
    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setRoomsLoading(true);
            setRoomsError(null);
            const response = await api.get("/room");
            console.log("Rooms fetched:", response.data);
            setRooms(response.data.filter((room: Room) => room.isActive)); // Only show active rooms
        } catch (error: any) {
            console.error("Error fetching rooms:", error);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               "Failed to fetch rooms. Please try again.";
            setRoomsError(errorMessage);
            setRooms([]); // Set empty array on error
        } finally {
            setRoomsLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        section: "user" | "roomAdmin"
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value,
            },
        }));
    };

    const handleSelectChange = (
        section: "roomAdmin",
        name: string,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await api.post("/room-admin", formData);
            setSuccess(true);
            // Reset form
            setFormData({
                user: {
                    email: "",
                    role: "room_admin",
                    first_name: "",
                    last_name: "",
                    profile_picture: ""
                },
                roomAdmin: {
                    designation: "",
                    contact: "", // Reset contact field
                    roomID: "",
                },
            });
        } catch (error: any) {
            console.error("Error creating room admin:", error);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               "Failed to create room admin. Please check your input and try again.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetryFetchRooms = () => {
        fetchRooms();
    };

    return (
        <Card className="bg-white shadow-md">
            <CardHeader>
                <CardTitle>Create Room Admin</CardTitle>
                <CardDescription>Register new user and room admin details</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* User Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Email</Label>
                            <Input
                                name="email"
                                type="email"
                                value={formData.user.email}
                                onChange={(e) => handleInputChange(e, "user")}
                                required
                            />
                        </div>
                        <div>
                            <Label>First Name</Label>
                            <Input
                                name="first_name"
                                value={formData.user.first_name}
                                onChange={(e) => handleInputChange(e, "user")}
                            />
                        </div>
                        <div>
                            <Label>Last Name</Label>
                            <Input
                                name="last_name"
                                value={formData.user.last_name}
                                onChange={(e) => handleInputChange(e, "user")}
                            />
                        </div>
                        <div>
                            <Label>Profile Picture URL (optional)</Label>
                            <Input
                                name="profile_picture"
                                value={formData.user.profile_picture}
                                onChange={(e) => handleInputChange(e, "user")}
                            />
                        </div>
                    </div>

                    {/* Room Admin Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                            <Label>Designation</Label>
                            <Input
                                name="designation"
                                value={formData.roomAdmin.designation}
                                onChange={(e) => handleInputChange(e, "roomAdmin")}
                                placeholder="e.g., Room Manager, Supervisor"
                                required
                            />
                        </div>
                        <div>
                            <Label>Contact</Label>
                            <Input
                                name="contact"
                                value={formData.roomAdmin.contact}
                                onChange={(e) => handleInputChange(e, "roomAdmin")}
                                placeholder="e.g., +94 77 123 4567"
                                required
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Label>Assigned Room</Label>
                            {roomsError ? (
                                <div className="space-y-2">
                                    <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                                        {roomsError}
                                    </div>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={handleRetryFetchRooms}
                                        disabled={roomsLoading}
                                    >
                                        {roomsLoading ? "Retrying..." : "Retry"}
                                    </Button>
                                </div>
                            ) : (
                                <Select
                                    value={formData.roomAdmin.roomID}
                                    onValueChange={(val) =>
                                        handleSelectChange("roomAdmin", "roomID", val)
                                    }
                                    disabled={roomsLoading || rooms.length === 0}
                                >
                                    <SelectTrigger>
                                        <SelectValue 
                                            placeholder={
                                                roomsLoading 
                                                    ? "Loading rooms..." 
                                                    : rooms.length === 0 
                                                        ? "No active rooms available" 
                                                        : "Select room"
                                            } 
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rooms.map((room) => (
                                            <SelectItem key={room.roomID} value={room.roomID}>
                                                {room.roomName} - {room.location}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
                            Room Admin created successfully!
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        className="w-full mt-4" 
                        disabled={isLoading || roomsLoading || (rooms.length === 0 && !roomsError)}
                    >
                        {isLoading ? "Creating..." : "Create Room Admin"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
