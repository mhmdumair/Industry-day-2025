"use client";

import React, { useState } from 'react';
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    MapPin, Phone, User, Building, SquareMousePointer
} from 'lucide-react';

export default function ProfileCard() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        companyName: "Aayu Technologies",
        description:
            "Aayu Technologies is a US based company which conducts its technical operations from Sri Lanka since 2020. We mostly develop and host Software as a Service (SaaS) products and provide software that integrates Business to Business (B2B) electronic commerce and messaging systems, using technologies such as EDI and AS2, on cloud services such as Amazon (AWS), Google (GCP) and Azure platforms. We use Angular, TypeScript, NodeJS, Java, Firebase, and Serverless technologies such as Lambda functions, S3, DynamoDB and Firestore. We offer internships in software engineering, software quality assurance and UI/UX engineering.",
        contactPersonName: "Udith Gunaratna",
        contactPersonDesignation: "CTO",
        contactNumber: "0779460639",
        logo: "https://github.com/shadcn.png",
        stream: "CS",
        location: "Colombo, Sri Lanka",
        companyWebsite: "https://aayutechnologies.com/"
    });

    const handleSave = () => {
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
        <div className="mt-3 w-full max-w-3xl mx-auto p-4">
            <Card className="bg-gray-50 shadow-lg mt-3">
                <CardHeader className="text-center items-center justify-center pb-4">
                    <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-blue-100">
                        <AvatarImage src={profileData.logo} alt="Company Logo" />
                    </Avatar>
                    <CardTitle className="text-2xl font-bold text-gray-800">{profileData.contactPersonName}</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">{profileData.companyName}</CardDescription>
                    <div className="flex items-center gap-2 justify-center mt-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {profileData.stream}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {profileData.description}
                    </p>

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
                                <SquareMousePointer className="h-4 w-4 text-gray-500" />
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
                            <Button type="button">Edit Profile</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Edit Company Profile</DialogTitle>
                                <DialogDescription>
                                    Update your company information. All fields are required unless marked optional.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-6 py-4">
                                {[
                                    ['companyName', 'Company Name', 'text'],
                                    ['stream', 'Company Stream', 'text'],
                                    ['contactPersonName', 'Contact Person', 'text'],
                                    ['contactPersonDesignation', 'Designation', 'text'],
                                    ['contactNumber', 'Contact Number', 'tel'],
                                    ['location', 'Location', 'text'],
                                    ['companyWebsite', 'Website', 'url'],
                                    ['logo', 'Logo URL (optional)', 'url']
                                ].map(([field, label, type]) => (
                                    <div key={field} className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor={field} className="text-right font-medium">
                                            {label}
                                        </Label>
                                        <Input
                                            id={field}
                                            value={profileData[field]}
                                            onChange={(e) => handleInputChange(field, e.target.value)}
                                            className="col-span-3"
                                            placeholder={`Enter ${label.toLowerCase()}`}
                                            type={type}
                                        />
                                    </div>
                                ))}
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
