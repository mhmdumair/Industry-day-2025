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
import { Badge } from '@/components/ui/badge';
import {Globe, Phone, User, Building } from 'lucide-react';

export default function ProfileCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState( {
    studentID: "STU007",
    userID: "g7h8i9j0-k1l2-3456-7890-123456ghijkl",
    regNo: "2021/MT/034",
    nic: "199965432109",
    linkedin: "https://linkedin.com/in/david-garcia-materials",
    contact: "‪+94767890123‬",
    group: "MT",
    level: "level_4",
    created_at: "2025-07-24T11:36:19.183Z",
    user: {
      userID: "g7h8i9j0-k1l2-3456-7890-123456ghijkl",
      email: "davidgarcia@student.university.edu",
      role: "student",
      first_name: "David",
      last_name: "Garcia",
      profile_picture: "https://github.com/shadcn.png",
      created_at: "2025-07-24T11:36:19.165Z",
      updated_at: "2025-07-24T11:36:19.165Z"
    }
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
      <div className="mt-3 w-80% mx-auto p-4">
        <Card className="bg-gray-50 shadow-lg mt-3">
          <CardHeader className="text-center items-center justify-center pb-4">
            <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-blue-100">
              <AvatarImage src={profileData?.user?.profile_picture ?? undefined} alt="Student picture" />
            </Avatar>
            <CardTitle className="text-2xl font-bold text-gray-800">{profileData.user.first_name+ " " +profileData.user.last_name}</CardTitle>
            <div className="flex items-center gap-2 m-auto">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {profileData.group}
              </Badge>
            </div>
            <CardDescription className="text-gray-600 mt-2">Student Profile</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Registration No:</span>
                  <span className="text-gray-600">{profileData.regNo}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">NIC:</span>
                  <span className="text-gray-600">{profileData.nic}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Contact:</span>
                  <span className="text-gray-600">{profileData.contact}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-600">{profileData.user.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Linkedin:</span>
                  <a
                      href={profileData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {profileData.linkedin}
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
                  <DialogTitle>Edit Student Profile</DialogTitle>
                  <DialogDescription>
                    Update your information. All fields are required unless marked optional.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                  {/* First Name */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="first-name" className="text-right font-medium">
                      First Name
                    </Label>
                    <Input
                        id="first-name"
                        value={profileData.user.first_name}
                        onChange={(e) => handleInputChange('user.first_name', e.target.value)}
                        className="col-span-3"
                        placeholder="Enter first name"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="last-name" className="text-right font-medium">
                      Last Name
                    </Label>
                    <Input
                        id="last-name"
                        value={profileData.user.last_name}
                        onChange={(e) => handleInputChange('user.last_name', e.target.value)}
                        className="col-span-3"
                        placeholder="Enter last name"
                    />
                  </div>

                  {/* Email */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right font-medium">
                      Email
                    </Label>
                    <Input
                        id="email"
                        value={profileData.user.email}
                        onChange={(e) => handleInputChange('user.email', e.target.value)}
                        className="col-span-3"
                        placeholder="Enter email"
                    />
                  </div>

                  {/* Contact Number */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact-number" className="text-right font-medium">
                      Contact Number
                    </Label>
                    <Input
                        id="contact-number"
                        value={profileData.contact}
                        onChange={(e) => handleInputChange('contact', e.target.value)}
                        className="col-span-3"
                        placeholder="Enter contact number"
                        type="tel"
                    />
                  </div>

                  {/* NIC */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nic" className="text-right font-medium">
                      NIC
                    </Label>
                    <Input
                        id="nic"
                        value={profileData.nic}
                        onChange={(e) => handleInputChange('nic', e.target.value)}
                        className="col-span-3"
                        placeholder="Enter nic"
                    />
                  </div>

                  {/* Registration Number */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reg-number" className="text-right font-medium">
                      Registration No
                    </Label>
                    <Input
                        id="reg-number"
                        value={profileData.regNo}
                        onChange={(e) => handleInputChange('regNo', e.target.value)}
                        className="col-span-3"
                        placeholder="S20000"

                    />
                  </div>

                  {/* Student Linkedin */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="linkedin" className="text-right font-medium">
                      Linkedin
                    </Label>
                    <Input
                        id="linkedin"
                        value={profileData.user.email}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        className="col-span-3"
                        placeholder="https://www.linkedin.com"
                        type="url"
                    />
                  </div>

                  {/* Profile Picture URL */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="profile-picture" className="text-right font-medium">
                      Profile Picture
                      <span className="text-xs text-gray-500 block">Optional</span>
                    </Label>
                    <Input
                        id="profile-picture"
                        value={profileData.user.profile_picture}
                        onChange={(e) => handleInputChange('profile_picture', e.target.value)}
                        className="col-span-3"
                        placeholder="Enter Profile Picture URL"
                        type="url"
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