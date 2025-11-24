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
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Globe, Phone, User, Building, Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

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

export interface CompanyProfile {
  companyID: string;
  userID: string;
  companyName: string;
  description: string;
  contactPersonName: string;
  contactPersonDesignation: string;
  contactNumber: string;
  logo: string;
  sponsership: string;
  location: string;
  companyWebsite: string;
  user: User;
}

const safeString = (value: string | null | undefined): string => {
  return value || '';
};

export default function ProfileCard() {
  const router = useRouter();
  
  // Profile state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editData, setEditData] = useState<CompanyProfile | null>(null);

  // Password state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const companyRes = await api.get<CompanyProfile>(`/company/by-user`);

        const sanitizedData = {
          ...companyRes.data,
          companyName: safeString(companyRes.data.companyName),
          description: safeString(companyRes.data.description),
          contactPersonName: safeString(companyRes.data.contactPersonName),
          contactPersonDesignation: safeString(companyRes.data.contactPersonDesignation),
          contactNumber: safeString(companyRes.data.contactNumber),
          logo: safeString("/logo/c.png"),
          location: safeString(companyRes.data.location),
          companyWebsite: safeString(companyRes.data.companyWebsite),
        };
        
        setProfileData(sanitizedData);
        setEditData(sanitizedData);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 401) {
          router.push('/auth/login');
        } else {
          console.error("Fetch error:", err);
          setError("Failed to fetch company profile.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  // Profile edit handlers
  const handleInputChange = <K extends keyof CompanyProfile>(
    field: K,
    value: CompanyProfile[K]
  ) => {
    setEditData((prev) =>
      prev ? { ...prev, [field]: value } : prev
    );
  };

  const handleEditOpen = () => {
    if (profileData) {
      setEditData({
        ...profileData,
        companyName: safeString(profileData.companyName),
        description: safeString(profileData.description),
        contactPersonName: safeString(profileData.contactPersonName),
        contactPersonDesignation: safeString(profileData.contactPersonDesignation),
        contactNumber: safeString(profileData.contactNumber),
        logo: safeString(profileData.logo),
        location: safeString(profileData.location),
        companyWebsite: safeString(profileData.companyWebsite),
      });
    }
    setSaveError(null);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editData || !profileData) return;

    if (!editData.companyName.trim()) {
      setSaveError("Company Name is required.");
      return;
    }
    if (!editData.contactPersonName.trim()) {
      setSaveError("Contact Person Name is required.");
      return;
    }
    
    setSaveError(null);
    setLoading(true);

    try {
      const updatePayload = {
        companyName: editData.companyName,
        description: editData.description,
        contactPersonName: editData.contactPersonName,
        contactPersonDesignation: editData.contactPersonDesignation,
        contactNumber: editData.contactNumber,
        location: editData.location,
        companyWebsite: editData.companyWebsite,
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(updatePayload));

      await api.patch(`/company/${profileData.companyID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfileData((prev) =>
        prev ? { ...prev, ...updatePayload } : prev
      );

      setIsDialogOpen(false);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error("Save error:", e);
      if (e instanceof AxiosError && e.response?.data?.message) {
        setSaveError(`Failed to save: ${e.response.data.message}`);
      } else {
        setSaveError("Failed to save due to an unexpected error. Please try again.");
      }
    }
  };

  // Password update handlers
  const handlePasswordDialogOpen = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsPasswordDialogOpen(true);
  };

  const handlePasswordUpdate = async () => {
    setPasswordError(null);

    if (!currentPassword.trim()) {
      setPasswordError("Current password is required.");
      return;
    }
    if (!newPassword.trim()) {
      setPasswordError("New password is required.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      // Fixed: Send as JSON with proper Content-Type header
      await api.patch('/company/password', {
        currentPassword,
        newPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setIsPasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password updated successfully!");
    } catch (e) {
      console.error("Password update error:", e);
      if (e instanceof AxiosError && e.response?.data?.message) {
        setPasswordError(e.response.data.message);
      } else if (e instanceof AxiosError && e.response?.status === 400) {
        setPasswordError("Invalid request. Please check your current password.");
      } else {
        setPasswordError("Failed to update password. Please try again.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive text-center">
          <h2 className="text-2xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground text-center">
          <h2 className="text-2xl font-semibold mb-2">No Data</h2>
          <p>No company data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 w-[65vh] mx-auto p-4 bg-blue-900/40 min-h-[80vh] flex items-center justify-center">
      <Card className="bg-gray-50 dark:bg-black shadow-lg rounded-none w-full mx-10 border border-gray-200 dark:border-gray-700">
        <CardHeader className="text-left">
          <CardTitle className="text-4xl font-bold text-gray-800 dark:text-gray-100 leading-5 pt-3">
            {profileData.contactPersonName}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {profileData.user.email}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-foreground mb-3">About Company</h3>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {profileData.description}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                <span className="text-gray-600 dark:text-gray-400">{profileData.contactNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Website:</span>
                <a href={profileData.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {profileData.companyWebsite}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                <span className="text-gray-600 dark:text-gray-400">{profileData.location}</span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Card footer with buttons */}
        <CardFooter className="justify-center pt-6 rounded-none border-t border-gray-200 dark:border-gray-700 flex-col gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button type="submit" className="rounded-none" onClick={handleEditOpen}>
                Edit Profile
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto rounded-none dark:bg-black dark:text-gray-100">
              <DialogHeader>
                <DialogTitle>Edit Company Profile</DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  Update your company information.
                </DialogDescription>
              </DialogHeader>

              {editData && (
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company-name" className="text-right font-medium dark:text-gray-300">
                      Company Name
                    </Label>
                    <Input
                      id="company-name"
                      value={safeString(editData.companyName)}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact-person" className="text-right font-medium dark:text-gray-300">
                      Contact Person
                    </Label>
                    <Input
                      id="contact-person"
                      value={safeString(editData.contactPersonName)}
                      onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter contact person name"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="designation" className="text-right font-medium dark:text-gray-300">
                      Designation
                    </Label>
                    <Input
                      id="designation"
                      value={safeString(editData.contactPersonDesignation)}
                      onChange={(e) => handleInputChange("contactPersonDesignation", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter designation"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact-number" className="text-right font-medium dark:text-gray-300">
                      Contact Number
                    </Label>
                    <Input
                      id="contact-number"
                      value={safeString(editData.contactNumber)}
                      onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter contact number"
                      type="tel"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right font-medium dark:text-gray-300">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={safeString(editData.location)}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter company location"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="website" className="text-right font-medium dark:text-gray-300">
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={safeString(editData.companyWebsite)}
                      onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="https://www.company.com"
                      type="url"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right font-medium dark:text-gray-300 mt-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={safeString(editData.description)}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100 min-h-[120px]"
                      placeholder="Enter company description"
                    />
                  </div>
                </div>
              )}

              {saveError && (
                <div className="text-red-500 text-sm">{saveError}</div>
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

          {/* Password update dialog */}
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={handlePasswordDialogOpen}
                className="text-sm text-blue-500 hover:underline cursor-pointer"
              >
                Update Password
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px] rounded-none dark:bg-black dark:text-gray-100">
              <DialogHeader>
                <DialogTitle>Update Password</DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  Change your account password.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password" className="font-medium dark:text-gray-300">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="rounded-none dark:bg-gray-800 dark:text-gray-100 pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="new-password" className="font-medium dark:text-gray-300">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="rounded-none dark:bg-gray-800 dark:text-gray-100 pr-10"
                      placeholder="Enter new password (min 8 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirm-password" className="font-medium dark:text-gray-300">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-none dark:bg-gray-800 dark:text-gray-100 pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {passwordError && (
                <div className="text-red-500 text-sm">{passwordError}</div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none dark:border-gray-600 dark:text-gray-300"
                  onClick={() => setIsPasswordDialogOpen(false)}
                  disabled={passwordLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePasswordUpdate}
                  className="rounded-none"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}