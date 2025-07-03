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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe, Phone, User, Building } from 'lucide-react';

export default function ProfileCard() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        companyName: "Company Name",
        description: "Company description goes here. This should provide a brief overview of the company, its mission, and values.",
        contactPersonName: "John Smith",
        contactPersonDesignation: "HR Manager",
        contactNumber: "+1 (555) 123-4567",
        logo: "https://github.com/shadcn.png",
        stream: "CS",
        location: "San Francisco, CA",
        companyWebsite: "https://www.techcorp.com"
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
        <div className="mt-3">
            <Card className="bg-gray-50 shadow-lg">
                <CardHeader className="text-center items-center justify-center pb-4">
                    <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-blue-100">
                        <AvatarImage src={profileData.logo} alt="Company Logo" />
                    </Avatar>
                    <CardTitle className="text-2xl font-bold text-gray-800">{profileData.companyName}</CardTitle>
                    <div className="flex items-center gap-2 m-auto">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {profileData.stream}
                        </Badge>
                    </div>
                    <CardDescription className="text-gray-600 mt-2">Company Profile</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">{profileData.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-700">Contact Person:</span>
                                <span className="text-gray-600">{profileData.contactPersonName}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <Building className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-700">Designation:</span>
                                <span className="text-gray-600">{profileData.contactPersonDesignation}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-700">Contact:</span>
                                <span className="text-gray-600">{profileData.contactNumber}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-700">Location:</span>
                                <span className="text-gray-600">{profileData.location}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <Globe className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-700">Website:</span>
                                <a
                                    href={profileData.companyWebsite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    {profileData.companyWebsite}
                                </a>
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
                                <DialogTitle>Edit Company Profile</DialogTitle>
                                <DialogDescription>
                                    Update your company information. All fields are required unless marked optional.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-6 py-4">
                                {/* Company Name */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="company-name" className="text-right font-medium">
                                        Company Name
                                    </Label>
                                    <Input
                                        id="company-name"
                                        value={profileData.companyName}
                                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                                        className="col-span-3"
                                        placeholder="Enter company name"
                                    />
                                </div>

                                {/* Company Stream */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="company-stream" className="text-right font-medium">
                                        Company Name
                                    </Label>
                                    <Input
                                        id="company-stream"
                                        value={profileData.stream}
                                        onChange={(e) => handleInputChange('companyStream', e.target.value)}
                                        className="col-span-3"
                                        placeholder="Enter company stream"
                                    />
                                </div>

                                {/* Contact Person Name */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="contact-person" className="text-right font-medium">
                                        Contact Person
                                    </Label>
                                    <Input
                                        id="contact-person"
                                        value={profileData.contactPersonName}
                                        onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                                        className="col-span-3"
                                        placeholder="Enter contact person name"
                                    />
                                </div>

                                {/* Contact Person Designation */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="designation" className="text-right font-medium">
                                        Designation
                                    </Label>
                                    <Input
                                        id="designation"
                                        value={profileData.contactPersonDesignation}
                                        onChange={(e) => handleInputChange('contactPersonDesignation', e.target.value)}
                                        className="col-span-3"
                                        placeholder="Enter designation"
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

                                {/* Company Website */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="website" className="text-right font-medium">
                                        Website
                                    </Label>
                                    <Input
                                        id="website"
                                        value={profileData.companyWebsite}
                                        onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                                        className="col-span-3"
                                        placeholder="https://www.company.com"
                                        type="url"
                                    />
                                </div>

                                {/* Logo URL */}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="logo" className="text-right font-medium">
                                        Logo URL
                                        <span className="text-xs text-gray-500 block">Optional</span>
                                    </Label>
                                    <Input
                                        id="logo"
                                        value={profileData.logo}
                                        onChange={(e) => handleInputChange('logo', e.target.value)}
                                        className="col-span-3"
                                        placeholder="Enter logo URL"
                                        type="url"
                                    />
                                </div>

                                {/* Description */}
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <Label htmlFor="description" className="text-right font-medium mt-2">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={profileData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="col-span-3 min-h-[120px]"
                                        placeholder="Enter company description"
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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