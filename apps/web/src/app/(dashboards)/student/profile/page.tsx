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
import { Globe, Phone, User, Building, Mail, GraduationCap, Users, CreditCard } from "lucide-react";
import api from "@/lib/axios";
import { AxiosError } from "axios";

export enum StudentGroup {
  ZL = 'ZL', BT = 'BT', CH = 'CH', MT = 'MT', BMS = 'BMS', ST = 'ST', GL = 'GL', CS = 'CS', DS = 'DS', ML = 'ML', BL = 'BL', MB = 'MB', CM = 'CM', AS = 'AS', ES = 'ES', SOR = 'SOR',
}

export enum StudentLevel {
  LEVEL_1 = 'level_1', LEVEL_2 = 'level_2', LEVEL_3 = 'level_3', LEVEL_4 = 'level_4',
}

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

export interface StudentProfile {
  studentID: string;
  userID: string;
  regNo: string;
  nic: string;
  linkedin: string | null;
  contact: string;
  group: string;
  level: string;
  created_at: string;
  updated_at: string;
  user: User;
}

const safeString = (value: string | null | undefined): string => {
  return value || '';
};

export default function StudentProfileCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editData, setEditData] = useState<StudentProfile | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get<StudentProfile>(`/student/by-user`)
      .then((res) => {
        const studentProfile = res.data;
        if (studentProfile) {
          const sanitizedData = {
            ...studentProfile,
            regNo: safeString(studentProfile.regNo),
            nic: safeString(studentProfile.nic),
            contact: safeString(studentProfile.contact),
            linkedin: safeString(studentProfile.linkedin),
            group: safeString(studentProfile.group),
            level: safeString(studentProfile.level),
            user: {
              ...studentProfile.user,
              first_name: safeString(studentProfile.user.first_name),
              last_name: safeString(studentProfile.user.last_name),
              email: safeString(studentProfile.user.email),
              profile_picture: safeString(studentProfile.user.profile_picture),
            }
          };
          setProfileData(sanitizedData);
          setEditData(sanitizedData);
        } else {
          setError("No student profile data found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch student profile.");
        setLoading(false);
      });
  }, []);

  const handleInputChange = <K extends keyof StudentProfile>(
    field: K,
    value: StudentProfile[K]
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
        regNo: safeString(profileData.regNo),
        nic: safeString(profileData.nic),
        contact: safeString(profileData.contact),
        linkedin: safeString(profileData.linkedin),
        group: safeString(profileData.group),
        level: safeString(profileData.level),
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
    if (!editData || !profileData?.studentID) {
      console.error("Missing edit data or student ID.");
      return;
    }

    setLoading(true);

    const nestedPayload = {
      student: {
        regNo: editData.regNo,
        nic: editData.nic,
        contact: editData.contact,
        linkedin: editData.linkedin || null,
        group: editData.group,
        level: editData.level,
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
      await api.patch(`/student/${profileData.studentID}`, nestedPayload);

      setProfileData((prev) =>
        prev ? {
          ...prev,
          regNo: editData.regNo,
          nic: editData.nic,
          contact: editData.contact,
          linkedin: editData.linkedin,
          group: editData.group,
          level: editData.level,
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

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!profileData) return <div className="text-center p-4">No student data found.</div>;

  const fullName = `${profileData.user.first_name} ${profileData.user.last_name}`.trim();
  const levelDisplay = profileData.level.replace('level_', 'Level ');

  return (
    <div className="mt-3 w-full max-w-[65vh] mx-auto p-4 bg-teal-900/40 flex items-center justify-center">
      <Card className="bg-gray-50 dark:bg-black shadow-lg rounded-none w-full mx-10 border border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center items-center justify-center pb-4">
          <div className="flex items-center gap-2 mx-auto mb-3">
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {profileData.user.role}
            </Badge>
          </div>

          <Avatar className="h-24 w-24 mx-auto mb-4 ring-2 ring-blue-100/50 dark:ring-blue-900/50">
            <AvatarImage
              src={profileData?.user?.profile_picture || "/baurs.png"}
              alt="Student Profile"
            />
          </Avatar>

          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {fullName || "Student"}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
            {profileData.regNo} • {levelDisplay} • {profileData.group}
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
                <GraduationCap className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Reg No:</span>
                <span className="text-gray-600 dark:text-gray-400">{profileData.regNo}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">NIC:</span>
                <span className="text-gray-600 dark:text-gray-400">{profileData.nic}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Group:</span>
                <span className="text-gray-600 dark:text-gray-400">{profileData.group}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                <span className="text-gray-600 dark:text-gray-400">{profileData.user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Contact:</span>
                <span className="text-gray-600 dark:text-gray-400">{profileData.contact}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">LinkedIn:</span>
                {profileData.linkedin ? (
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                  >
                    View Profile
                  </a>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">—</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Level:</span>
                <span className="text-gray-600 dark:text-gray-400">{levelDisplay}</span>
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
                <DialogTitle>Edit Student Profile</DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  Update your student information. Role cannot be changed.
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

                  {/* Registration Number */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="regNo" className="text-right font-medium dark:text-gray-300">
                      Reg No
                    </Label>
                    <Input
                      id="regNo"
                      value={safeString(editData.regNo)}
                      onChange={(e) => handleInputChange("regNo", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter registration number"
                    />
                  </div>

                  {/* NIC */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nic" className="text-right font-medium dark:text-gray-300">
                      NIC
                    </Label>
                    <Input
                      id="nic"
                      value={safeString(editData.nic)}
                      onChange={(e) => handleInputChange("nic", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter NIC"
                    />
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-4 items-center gap-4">
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

                  {/* Group */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="group" className="text-right font-medium dark:text-gray-300">
                      Group
                    </Label>
                    <Input
                      id="group"
                      value={safeString(editData.group)}
                      onChange={(e) => handleInputChange("group", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter group"
                    />
                  </div>

                  {/* Level */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="level" className="text-right font-medium dark:text-gray-300">
                      Level
                    </Label>
                    <Input
                      id="level"
                      value={safeString(editData.level)}
                      onChange={(e) => handleInputChange("level", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter level"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="linkedin" className="text-right font-medium dark:text-gray-300">
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={safeString(editData.linkedin)}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
                      className="col-span-3 rounded-none dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter LinkedIn URL (Optional)"
                      type="url"
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

                  {/* Role (read-only) */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right font-medium dark:text-gray-300">
                      Role
                    </Label>
                    <div className="col-span-3 rounded-none flex items-center">
                      <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
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
