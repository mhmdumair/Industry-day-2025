"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Building, Mail } from "lucide-react";
import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import { AxiosError } from "axios";

export interface User {
    userID: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
    created_at: string;
    updated_at: string;
}

export interface AdminProfile {
    roomAdminID: string;
    userID: string;
    designation: string;
    roomID: string;
    user: User;
    room: {
        roomID: string;
        roomName: string;
        location: string;
        isActive: boolean;
    };
}

const safeString = (value: string | null | undefined): string => {
    return value || '';
};

// Separate component that uses useSearchParams
function ProfileCardContent() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [profileData, setProfileData] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    
    const searchParams = useSearchParams();
    const adminId = searchParams.get("roomAdminId");
    
    const [editData, setEditData] = useState<AdminProfile | null>(null);

    useEffect(() => {
        if (!adminId) {
            setLoading(false);
            setError("No roomAdminId provided in URL.");
            return;
        }
        
        setLoading(true);
        api
            .get<AdminProfile>(`/room-admin/${adminId}`)
            .then((res) => {
                const sanitizedData = {
                    ...res.data,
                    designation: safeString(res.data.designation),
                    user: {
                        ...res.data.user,
                        first_name: safeString(res.data.user.first_name),
                        last_name: safeString(res.data.user.last_name),
                        email: safeString(res.data.user.email),
                        profile_picture: safeString(res.data.user.profile_picture),
                        role: "room_admin"
                    }
                };
                setProfileData(sanitizedData);
                setEditData(sanitizedData);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch room admin profile:", err);
                setError("Failed to fetch room admin profile. Check the console for details.");
                setLoading(false);
            });
    }, [adminId]);

    const handleInputChange = <K extends keyof AdminProfile>(
        field: K,
        value: AdminProfile[K]
    ) => {
        setEditData((prev) =>
            prev ? { ...prev, [field]: value } : prev
        );
    };

    const handleUserInputChange = <K extends keyof User>(
        field: K,
        value: User[K]
    ) => {
        setEditData((prev) =>
            prev ? {
                ...prev,
                user: { ...prev.user, [field]: value }
            } : prev
        );
    };

    const handleEditOpen = () => {
        if (profileData) {
            const sanitizedEditData = {
                ...profileData,
                designation: safeString(profileData.designation),
                user: {
                    ...profileData.user,
                    first_name: safeString(profileData.user.first_name),
                    last_name: safeString(profileData.user.last_name),
                    email: safeString(profileData.user.email),
                    profile_picture: safeString(profileData.user.profile_picture),
                }
            };
            setEditData(sanitizedEditData);
        }
        setSaveError(null);
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!editData || !adminId) {
            console.error("Missing edit data or admin ID.");
            setSaveError("Missing data required for saving.");
            return;
        }

        // Basic front-end validation
        if (!editData.user.first_name.trim() || !editData.user.last_name.trim()) {
            setSaveError("First and last names are required.");
            return;
        }
        if (!editData.user.email.trim()) {
            setSaveError("Email is required.");
            return;
        }
        
        setSaveError(null);
        setLoading(true);

        const updatePayload = {
            designation: editData.designation,
            user: {
                first_name: editData.user.first_name,
                last_name: editData.user.last_name,
                email: editData.user.email,
            },
        };

        try {
            await api.patch(`/room-admin/${adminId}`, updatePayload);

            setProfileData((prev) =>
                prev ? {
                    ...prev,
                    designation: updatePayload.designation,
                    user: {
                        ...prev.user,
                        first_name: updatePayload.user.first_name,
                        last_name: updatePayload.user.last_name,
                        email: updatePayload.user.email,
                    },
                } : prev
            );

            setIsDialogOpen(false);
            alert("Profile updated successfully!");

        } catch (e) {
            console.error("Save error:", e);
            if (e instanceof AxiosError && e.response?.data?.message) {
                setSaveError(`Failed to save: ${e.response.data.message}`);
            } else {
                setSaveError("Failed to save due to an unexpected error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }
    
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
    if (!profileData) return <div className="text-center p-4">No admin data found.</div>;

    const fullName = `${profileData.user.first_name} ${profileData.user.last_name}`.trim();

    return (
        <div className="mt-3 w-fit mx-auto p-4">
            <Card className="bg-gray-50 shadow-lg mt-3">
                <CardHeader className="text-center items-center justify-center pb-4">
                    <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-blue-100">
                        <AvatarImage src={profileData?.user?.profile_picture || "/logo/admin.png"} alt="Admin Profile" />
                    </Avatar>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        {fullName || "Admin"}
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                        {profileData.designation}
                    </CardDescription>
                    <div className="flex items-center gap-2 m-auto">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {profileData.user.role}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-700">Name:</span>
                                <span className="text-gray-600">{fullName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Building className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-700">Designation:</span>
                                <span className="text-gray-600">{profileData.designation}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-700">Email:</span>
                                <span className="text-gray-600">{profileData.user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-700">Role:</span>
                                <span className="text-gray-600">{profileData.user.role}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-center pt-6">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" onClick={handleEditOpen}>
                                Edit Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Edit Admin Profile</DialogTitle>
                                <DialogDescription>
                                    Update your admin information. Role cannot be changed.
                                </DialogDescription>
                            </DialogHeader>
                            {editData && (
                                <div className="grid gap-6 py-4">
                                    {saveError && (
                                        <div className="text-sm font-medium text-destructive text-center mb-4">
                                            {saveError}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="first-name" className="text-right font-medium">
                                            First Name
                                        </Label>
                                        <Input
                                            id="first-name"
                                            value={safeString(editData.user.first_name)}
                                            onChange={(e) => handleUserInputChange("first_name", e.target.value)}
                                            className="col-span-3"
                                            placeholder="Enter first name"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="last-name" className="text-right font-medium">
                                            Last Name
                                        </Label>
                                        <Input
                                            id="last-name"
                                            value={safeString(editData.user.last_name)}
                                            onChange={(e) => handleUserInputChange("last_name", e.target.value)}
                                            className="col-span-3"
                                            placeholder="Enter last name"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right font-medium">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            value={safeString(editData.user.email)}
                                            onChange={(e) => handleUserInputChange("email", e.target.value)}
                                            className="col-span-3"
                                            placeholder="Enter email address"
                                            type="email"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="role" className="text-right font-medium">
                                            Role
                                        </Label>
                                        <div className="col-span-3 flex items-center">
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                {editData.user.role}
                                            </Badge>
                                            <span className="text-xs text-gray-500 ml-2">Cannot be changed</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="designation" className="text-right font-medium">
                                            Designation
                                        </Label>
                                        <Input
                                            id="designation"
                                            value={safeString(editData.designation)}
                                            onChange={(e) => handleInputChange("designation", e.target.value)}
                                            className="col-span-3"
                                            placeholder="Enter designation"
                                        />
                                    </div>
                                </div>
                            )}

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                    {loading ? "Saving..." : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        </div>
    );
}

// Main component that will be wrapped in Suspense
export default function RoomAdminProfileCard() {
    return <ProfileCardContent />;
}