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
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/axios";
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
    adminID: string;
    userID: string;
    designation: string;
    user: User;
}

const safeString = (value: string | null | undefined): string => {
    return value || '';
};

export default function AdminProfileCard() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [profileData, setProfileData] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editData, setEditData] = useState<AdminProfile | null>(null);

    useEffect(() => {
        setLoading(true);
        api
            .get<AdminProfile>(`/admin/by-user`)
            .then((res) => {
                const adminProfile = res.data;
                if (adminProfile) {
                    const sanitizedData = {
                        ...adminProfile,
                        designation: safeString(adminProfile.designation),
                        user: {
                            ...adminProfile.user,
                            first_name: safeString(adminProfile.user.first_name),
                            last_name: safeString(adminProfile.user.last_name),
                            email: safeString(adminProfile.user.email),
                            profile_picture: safeString(adminProfile.user.profile_picture),
                        }
                    };
                    setProfileData(sanitizedData);
                    setEditData(sanitizedData);
                } else {
                    setError("No admin profile data found.");
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch admin profile.");
                setLoading(false);
            });
    }, []);

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
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!editData || !profileData?.adminID) {
            console.error("Missing edit data or admin ID.");
            return;
        }

        setLoading(true);
        
        const nestedPayload = {
            admin: {
                designation: editData.designation,
            },
            user: {
                first_name: editData.user.first_name,
                last_name: editData.user.last_name,
                email: editData.user.email,
                profile_picture: editData.user.profile_picture,
                role: editData.user.role, 
            },
        };

        try {
            await api.patch(`/admin/${profileData.adminID}`, nestedPayload);

            setProfileData((prev) =>
                prev ? {
                    ...prev,
                    designation: editData.designation,
                    user: {
                        ...prev.user,
                        first_name: editData.user.first_name,
                        last_name: editData.user.last_name,
                        email: editData.user.email,
                        profile_picture: editData.user.profile_picture,
                    },
                } : prev
            );

            setIsDialogOpen(false);
            alert("Profile updated successfully!");

        } catch (error) {
            const apiError = error as AxiosError;
            console.error("Save error:", apiError.response?.data || apiError.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Spinner className="h-8 w-8" /></div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
    if (!profileData) return <div className="text-center p-4">No admin data found.</div>;

    const fullName = `${profileData.user.first_name} ${profileData.user.last_name}`.trim();

    return (
       <div className="mt-3 w-[65vh] mx-auto p-4 bg-green-900/40 min-h-[80vh] flex items-center justify-center">
            <Card className="bg-gray-50 dark:bg-black shadow-lg rounded-none w-full mx-10 border border-gray-200 dark:border-gray-700">
  <CardHeader className="text-center items-center justify-center pb-4">
    <div className="flex items-center gap-2 mx-auto mb-3">
      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
        {profileData.user.role}
      </Badge>
    </div>

    <Avatar className="h-24 w-24 mx-auto mb-4 ring-2 ring-blue-100/50 dark:ring-blue-900/50">
      <AvatarImage
        src={profileData?.user?.profile_picture || "/logo/admin.png"}
        alt="Admin Profile"
      />
    </Avatar>

    <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
      {fullName || "Admin"}
    </CardTitle>
    <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
      {profileData.designation}
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
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
          <span className="text-gray-600 dark:text-gray-400">{profileData.user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="font-medium text-gray-700 dark:text-gray-300">Role:</span>
          <span className="text-gray-600 dark:text-gray-400">{profileData.user.role}</span>
        </div>
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
          <DialogTitle>Edit Admin Profile</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Update your admin information. Role cannot be changed.
          </DialogDescription>
        </DialogHeader>

        {editData && (
          <div className="grid gap-6 py-4">
            {/* First Name */}
            <div className="grid grid-cols-4 items-center gap-4">
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
            <div className="grid grid-cols-4 items-center gap-4">
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
            <div className="grid grid-cols-4 items-center gap-4">
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

            {/* Role */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right font-medium dark:text-gray-300">
                Role
              </Label>
              <div className="col-span-3 rounded-none flex items-center">
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  {editData.user.role}
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Cannot be changed</span>
              </div>
            </div>

            {/* Designation */}
            <div className="grid grid-cols-4 items-center gap-4">
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

            {/* Profile Picture */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="profile-picture" className="text-right font-medium dark:text-gray-300">
                Profile Picture
              </Label>
              <Input
                id="profile-picture"
                value={safeString(editData.user.profile_picture)}
                onChange={(e) => handleUserInputChange("profile_picture", e.target.value)}
                className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter profile picture URL (Optional)"
                type="url"
              />
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
