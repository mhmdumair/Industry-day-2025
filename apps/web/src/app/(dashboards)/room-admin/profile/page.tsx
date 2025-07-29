"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, User } from 'lucide-react';

export default function ProfileCard() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        roomadminName: "P.O Jaywickrama",
        contactNumber: "+1 (555) 123-4567",
        email: "abc@email.com",
        roomID: "room.id",
        location: "MLT",
        logo: "https://github.com/shadcn.png"
    });

    const handleSave = () => {
        // Handle save logic here - send to API
        console.log("Profile updated:", profileData);
        setIsDialogOpen(false);
    };

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="mt-3 mx-auto p-4">
            <Card className="shadow-lg mt-3 w-full mx-auto text-white">
                <CardHeader className="text-center items-center justify-center pb-4">
                    <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-blue-100">
                        <AvatarImage src={profileData.logo} alt="Company Logo" />
                    </Avatar>
                    <CardTitle className="text-2xl font-bold text-gray-800">{profileData.roomadminName}</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">{profileData.location}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-700">Email:</span>
                                <span className="text-gray-600">{profileData.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-700">Room ID:</span>
                                <span className="text-gray-600">{profileData.roomID}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-700">Location:</span>
                                <span className="text-gray-600">{profileData.location}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="justify-center pt-6">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button type="submit">Edit Profile</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>
                                    Update your company information. All fields are required unless marked optional.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-6 py-4">
                                {/* Company Name */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="Name" className="text-right font-medium">
                                        Name
                                    </Label>
                                    <Input
                                        id="Name"
                                        value={profileData.roomadminName}
                                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                                        className="col-span-3"
                                        placeholder="Enter Room-admin name"
                                    />
                                </div>

                                {/* Email */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right font-medium">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        value={profileData.email}
                                        onChange={(e) => handleInputChange('contactPersonEmail', e.target.value)}
                                        className="col-span-3"
                                        placeholder="Enter Email Address"
                                    />
                                </div>

                                {/* Contact Number */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="contact-number" className="text-right font-medium">
                                        Contact Number
                                    </Label>
                                    <Input
                                        id="contact-number"
                                        value={profileData.contactNumber}
                                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                                        className="col-span-3"
                                        placeholder="Enter contact number"
                                        type="tel"
                                    />
                                </div>

                                {/* Location */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="location" className="text-right font-medium">
                                        Location
                                    </Label>
                                    <Input
                                        id="location"
                                        value={profileData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        className="col-span-3"
                                        placeholder="Enter company location"
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="destructive" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        </div>
    );
}