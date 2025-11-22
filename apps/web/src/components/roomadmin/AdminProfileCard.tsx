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
import { User, Building, Mail, Phone, MapPin, Camera } from "lucide-react";
import api from "@/lib/axios";
import { AxiosError } from "axios";

export interface User {
  userID: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  profile_picture_public_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Room {
  roomID: string;
  roomNumber?: string;
  roomName?: string;
  location?: string;
  isActive?: boolean;
}

export interface RoomAdminProfile {
  roomAdminID: string;
  userID: string;
  designation: string;
  contact: string;
  roomID: string;
  created_at: string;
  updated_at: string;
  user: User;
  room?: Room;
}

const safeString = (value: string | null | undefined): string => {
  return value || '';
};

export default function RoomAdminProfileCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  
  const [profileData, setProfileData] = useState<RoomAdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editData, setEditData] = useState<RoomAdminProfile | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get<RoomAdminProfile>(`/room-admin/by-user`)
      .then((res) => {
        const roomAdminProfile = res.data;
        if (roomAdminProfile) {
          const sanitizedData = {
            ...roomAdminProfile,
            designation: safeString(roomAdminProfile.designation),
            contact: safeString(roomAdminProfile.contact),
            user: {
              ...roomAdminProfile.user,
              first_name: safeString(roomAdminProfile.user.first_name),
              last_name: safeString(roomAdminProfile.user.last_name),
              email: safeString(roomAdminProfile.user.email),
              profile_picture: safeString(roomAdminProfile.user.profile_picture),
              profile_picture_public_id: safeString(roomAdminProfile.user.profile_picture_public_id),
            }
          };
          setProfileData(sanitizedData);
          setEditData(sanitizedData);
        } else {
          setError("No room admin profile data found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch room admin profile.");
        setLoading(false);
      });
  }, []);

  const handleInputChange = <K extends keyof RoomAdminProfile>(
    field: K,
    value: RoomAdminProfile[K]
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
        contact: safeString(profileData.contact),
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
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editData || !profileData?.roomAdminID) {
      console.error("Missing edit data or room admin ID.");
      return;
    }

    setLoading(true);

    const correctPayload = {
      designation: editData.designation,
      contact: editData.contact,
      user: {
        first_name: editData.user.first_name,
        last_name: editData.user.last_name,
        email: editData.user.email,
        role: editData.user.role,
      },
    };

    try {
      await api.patch(`/room-admin/${profileData.roomAdminID}`, correctPayload);

      setProfileData((prev) =>
        prev ? {
          ...prev,
          designation: editData.designation,
          contact: editData.contact,
          user: {
            ...prev.user,
            first_name: editData.user.first_name,
            last_name: editData.user.last_name,
            email: editData.user.email,
          },
        } : prev
      );

      setIsDialogOpen(false);
      alert("Profile updated successfully!");

    } catch (error) {
      const apiError = error as AxiosError;
      console.error("Save error:", apiError.response?.data || apiError.message);
      
      const errorData = apiError.response?.data as { message?: string | string[] };
      let errorMessage = apiError.message;
      
      if (errorData?.message) {
        errorMessage = Array.isArray(errorData.message) 
          ? errorData.message.join(', ') 
          : errorData.message;
      }
      
      alert(`Error saving profile: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Profile Picture Handlers ---
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImageFile(e.target.files[0]);
    }
  };

  const handleImageUploadSubmit = async () => {
    if (!profileImageFile) {
      alert("Please select an image file first.");
      return;
    }
    if (!profileData?.roomAdminID) {
      alert("Profile data missing.");
      return;
    }

    setImageUploadLoading(true);
    const formData = new FormData();
    formData.append('file', profileImageFile); 

    try {
      const res = await api.patch('/room-admin/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedData = res.data; 

      setProfileData(prev => prev ? { 
        ...prev, 
        user: { 
          ...prev.user, 
          profile_picture: updatedData.profile_picture,
          profile_picture_public_id: updatedData.profile_picture_public_id,
        } 
      } : null);

      alert("Profile picture updated successfully!");
      setIsImageDialogOpen(false);
      setProfileImageFile(null);

    } catch (error) {
      const apiError = error as AxiosError;
      const errorMessage = (apiError.response?.data as { message: string })?.message || apiError.message;
      alert(`Image update failed: ${errorMessage}`);
    } finally {
      setImageUploadLoading(false);
    }
  };
  // --- End Profile Picture Handlers ---

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!profileData) return <div className="text-center p-4">No room admin data found.</div>;

  const fullName = `${profileData.user.first_name} ${profileData.user.last_name}`.trim();
  const roomDisplay = profileData.room?.roomNumber || profileData.room?.roomName || profileData.roomID;

  return (
    <div className="mt-3 max-w-fit mx-auto p-4 bg-purple-900/40 flex items-center justify-center">
      <Card className="bg-gray-50 dark:bg-black shadow-lg rounded-none w-full px-5 lg:mx-10 border border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center items-center justify-center pb-4">
          <div className="flex items-center gap-2 mx-auto mb-3">
            <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              {profileData.user.role}
            </Badge>
          </div>

          {/* Profile Picture with Camera Icon & Dialog Trigger */}
          <div className="relative mx-auto mb-4">
            <Avatar className="h-24 w-24 ring-4 ring-purple-100/50 dark:ring-purple-900/50">
              <AvatarImage
                src={profileData?.user?.profile_picture || "/logo/admin.png"}
                alt="Room Admin Profile"
              />
            </Avatar>

            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 shadow-md"
                  onClick={() => {
                    setIsImageDialogOpen(true);
                    setProfileImageFile(null);
                  }}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-none dark:bg-black dark:text-gray-100">
                <DialogHeader>
                  <DialogTitle>Update Profile Picture</DialogTitle>
                  <DialogDescription className="dark:text-gray-400">
                    Upload a new image file to replace your current profile picture.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input 
                    id="image-file" 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                  />
                  {profileImageFile && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Selected: {profileImageFile.name}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={handleImageUploadSubmit} 
                    className="rounded-none"
                    disabled={!profileImageFile || imageUploadLoading}
                  >
                    {imageUploadLoading ? "Uploading..." : "Upload & Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {/* End Profile Picture with Camera Icon */}

          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {fullName || "Room Admin"}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
            {profileData.designation} • Room {roomDisplay}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                <span className="text-gray-600 dark:text-gray-400">{fullName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Designation:</span>
                <span className="text-gray-600 dark:text-gray-400">{profileData.designation}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Contact:</span>
                <span className="text-gray-600 dark:text-gray-400">{profileData.contact}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                <span className="text-gray-600 dark:text-gray-400">{profileData.user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Room:</span>
                <span className="text-gray-600 dark:text-gray-400">{roomDisplay}</span>
              </div>
              {profileData.room?.location && (
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                  <span className="text-gray-600 dark:text-gray-400">{profileData.room.location}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-center pt-6 rounded-none border-t border-gray-200 dark:border-gray-700">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button type="submit" className="rounded-none" onClick={handleEditOpen}>
                Edit Profile
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto rounded-none dark:bg-black dark:text-gray-100">
              <DialogHeader>
                <DialogTitle>Edit Room Admin Profile</DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  Update your room admin information. Role and Profile Picture are handled separately.
                </DialogDescription>
              </DialogHeader>

              {editData && (
                <div className="grid gap-6 py-4">
                  {/* First Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 sm:col-span-3 items-center gap-4">
                    <Label htmlFor="first-name" className="text-right font-medium dark:text-gray-300">
                      First Name
                    </Label>
                    <Input
                      id="first-name"
                      value={safeString(editData.user.first_name)}
                      onChange={(e) => handleUserInputChange("first_name", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter first name"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 sm:col-span-3 items-center gap-4">
                    <Label htmlFor="last-name" className="text-right font-medium dark:text-gray-300">
                      Last Name
                    </Label>
                    <Input
                      id="last-name"
                      value={safeString(editData.user.last_name)}
                      onChange={(e) => handleUserInputChange("last_name", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter last name"
                    />
                  </div>

                  {/* Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 sm:col-span-3 items-center gap-4">
                    <Label htmlFor="email" className="text-right font-medium dark:text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={safeString(editData.user.email)}
                      onChange={(e) => handleUserInputChange("email", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter email address"
                      type="email"
                    />
                  </div>

                  {/* Designation */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 sm:col-span-3 items-center gap-4">
                    <Label htmlFor="designation" className="text-right font-medium dark:text-gray-300">
                      Designation
                    </Label>
                    <Input
                      id="designation"
                      value={safeString(editData.designation)}
                      onChange={(e) => handleInputChange("designation", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter designation"
                    />
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 sm:col-span-3 items-center gap-4">
                    <Label htmlFor="contact" className="text-right font-medium dark:text-gray-300">
                      Contact
                    </Label>
                    <Input
                      id="contact"
                      value={safeString(editData.contact)}
                      onChange={(e) => handleInputChange("contact", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter contact number"
                      type="tel"
                    />
                  </div>

                  {/* Role (read-only) */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 sm:col-span-3 items-center gap-4">
                    <Label htmlFor="role" className="text-right font-medium dark:text-gray-300">
                      Role
                    </Label>
                    <div className="col-span-3 rounded-none flex items-center">
                      <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                        {editData.user.role}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Cannot be changed</span>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none dark:border-gray-600 dark:text-gray-300"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleSave}
                  className="rounded-none"
                  disabled={loading}
                >
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