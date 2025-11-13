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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
            setRooms([]); 
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
        <Card className="rounded-none">
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
                                className="rounded-none"
                            />
                        </div>
                        <div>
                            <Label>First Name</Label>
                            <Input
                                name="first_name"
                                value={formData.user.first_name}
                                onChange={(e) => handleInputChange(e, "user")}
                                className="rounded-none"
                            />
                        </div>
                        <div>
                            <Label>Last Name</Label>
                            <Input
                                name="last_name"
                                value={formData.user.last_name}
                                onChange={(e) => handleInputChange(e, "user")}
                                className="rounded-none"
                            />
                        </div>
                        <div>
                            <Label>Profile Picture URL (optional)</Label>
                            <Input
                                name="profile_picture"
                                value={formData.user.profile_picture}
                                onChange={(e) => handleInputChange(e, "user")}
                                className="rounded-none"
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
                                className="rounded-none"
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
                                className="rounded-none"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Label>Assigned Room</Label>
                            {roomsError ? (
                                <div className="space-y-2">
                                    <Alert variant="destructive" className="rounded-none">
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{roomsError}</AlertDescription>
                                    </Alert>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={handleRetryFetchRooms}
                                        disabled={roomsLoading}
                                        className="rounded-none"
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
                                    <SelectTrigger className="rounded-none">
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
                                    <SelectContent className="rounded-none">
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
                        <Alert variant="destructive" className="rounded-none">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Success Message */}
                    {success && (
                        <Alert variant="default" className="rounded-none">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>Room Admin created successfully!</AlertDescription>
                        </Alert>
                    )}

                    <Button 
                        type="submit" 
                        className="w-full mt-4 rounded-none" 
                        disabled={isLoading || roomsLoading || (rooms.length === 0 && !roomsError)}
                    >
                        {isLoading ? "Creating..." : "Create Room Admin"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
