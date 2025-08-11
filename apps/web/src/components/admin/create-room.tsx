"use client";

import React, { useState } from "react";
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

interface CreateRoomForm {
    roomName: string;
    location: string;
    isActive: boolean;
}

export default function CreateRoom() {
    const [formData, setFormData] = useState<CreateRoomForm>({
        roomName: "",
        location: "",
        isActive: true,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            isActive: value === "true",
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await api.post("/room", formData);
            console.log("Room created successfully:", response.data);
            setSuccess(true);
            // Reset form
            setFormData({
                roomName: "",
                location: "",
                isActive: true,
            });
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create room");
            console.error("Error creating room:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-white shadow-md">
            <CardHeader>
                <CardTitle>Create Room</CardTitle>
                <CardDescription>Add a new room to the system</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Room Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Room Name</Label>
                            <Input
                                name="roomName"
                                value={formData.roomName}
                                onChange={handleInputChange}
                                placeholder="Enter room name"
                                required
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Enter location"
                                required
                            />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select
                                value={formData.isActive ? "true" : "false"}
                                onValueChange={handleSelectChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
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
                            Room created successfully!
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Room"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
