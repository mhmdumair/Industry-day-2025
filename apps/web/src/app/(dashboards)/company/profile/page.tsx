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
import { Globe, Phone, User, Building } from "lucide-react";
import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";


// Types: define interfaces according to your student data structure
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


export default function StudentProfileCard() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId"); // Adjust your query param name as needed

  const [profileData, setProfileData] = useState<StudentProfile | null>(null);
  const [editData, setEditData] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch student data on mount or when studentId changes
  useEffect(() => {
    if (!studentId) {
      setError("No studentId provided in URL.");
      setLoading(false);
      return;
    }
    setLoading(true);
    api.get<StudentProfile>(`/student/${studentId}`)
      .then((res) => {
        setProfileData(res.data);
        setEditData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch student profile.");
        setLoading(false);
      });
  }, [studentId]);

  // Update editData; supports nested user fields like 'user.first_name'
  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("user.")) {
      const userField = field.split(".")[1];
      setEditData(prev => prev ? { ...prev, user: { ...prev.user, [userField]: value } } : prev);
    } else {
      setEditData(prev => prev ? { ...prev, [field]: value } : prev);
    }
  };

  // Open edit dialog and copy latest profileData to editData
  const handleEditOpen = () => {
    setEditData(profileData);
    setIsDialogOpen(true);
  };

  // Save updated student data to API (PATCH)
  const handleSave = async () => {
    if (!editData || !studentId) return;

    try {
      setLoading(true);

      // Prepare the data payload, omit immutable IDs
      const updatePayload = {
        regNo: editData.regNo,
        nic: editData.nic,
        linkedin: editData.linkedin,
        contact: editData.contact,
        group: editData.group,
        level: editData.level,
        user: {
          email: editData.user.email,
          role: editData.user.role,
          first_name: editData.user.first_name,
          last_name: editData.user.last_name,
          profile_picture: editData.user.profile_picture,
        },
      };

      await api.patch(`/student/${studentId}`, updatePayload);

      setProfileData(editData);
      setIsDialogOpen(false);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      alert("Failed to save. Please try again.");
      console.error("Save error:", e);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!profileData) return <div>No student data found.</div>;

  return (
    <div className="mt-3 w-80% mx-auto p-4">
      <Card className="bg-gray-50 shadow-lg mt-3">
        <CardHeader className="text-center items-center justify-center pb-4">
          <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-blue-100">
            <AvatarImage src={profileData.user.profile_picture ?? undefined} alt="Student picture" />
          </Avatar>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {profileData.user.first_name} {profileData.user.last_name}
          </CardTitle>
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
                  href={profileData.linkedin ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {profileData.linkedin ?? "—"}
                </a>
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
                <DialogTitle>Edit Student Profile</DialogTitle>
                <DialogDescription>
                  Update your information. All fields are required unless marked optional.
                </DialogDescription>
              </DialogHeader>

              {editData && (
                <div className="grid gap-6 py-4">
                  {/* First Name */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="first-name" className="text-right font-medium">First Name</Label>
                    <Input
                      id="first-name"
                      value={editData.user.first_name}
                      onChange={(e) => handleInputChange("user.first_name", e.target.value)}
                      className="col-span-3"
                      placeholder="Enter first name"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="last-name" className="text-right font-medium">Last Name</Label>
                    <Input
                      id="last-name"
                      value={editData.user.last_name}
                      onChange={(e) => handleInputChange("user.last_name", e.target.value)}
                      className="col-span-3"
                      placeholder="Enter last name"
                    />
                  </div>

                  {/* Email */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right font-medium">Email</Label>
                    <Input
                      id="email"
                      value={editData.user.email}
                      onChange={(e) => handleInputChange("user.email", e.target.value)}
                      className="col-span-3"
                      placeholder="Enter email"
                    />
                  </div>

                  {/* Contact Number */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact-number" className="text-right font-medium">Contact Number</Label>
                    <Input
                      id="contact-number"
                      value={editData.contact}
                      onChange={(e) => handleInputChange("contact", e.target.value)}
                      className="col-span-3"
                      placeholder="Enter contact number"
                      type="tel"
                    />
                  </div>

                  {/* NIC */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nic" className="text-right font-medium">NIC</Label>
                    <Input
                      id="nic"
                      value={editData.nic}
                      onChange={(e) => handleInputChange("nic", e.target.value)}
                      className="col-span-3"
                      placeholder="Enter NIC"
                    />
                  </div>

                  {/* Registration Number */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reg-number" className="text-right font-medium">Registration No</Label>
                    <Input
                      id="reg-number"
                      value={editData.regNo}
                      onChange={(e) => handleInputChange("regNo", e.target.value)}
                      className="col-span-3"
                      placeholder="S20000"
                    />
                  </div>

                  {/* Linkedin */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="linkedin" className="text-right font-medium">Linkedin</Label>
                    <Input
                      id="linkedin"
                      value={editData.linkedin ?? ""}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
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
                      value={editData.user.profile_picture ?? ""}
                      onChange={(e) => handleInputChange("user.profile_picture", e.target.value)}
                      className="col-span-3"
                      placeholder="Enter Profile Picture URL"
                      type="url"
                    />
                  </div>
                </div>
              )}

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
