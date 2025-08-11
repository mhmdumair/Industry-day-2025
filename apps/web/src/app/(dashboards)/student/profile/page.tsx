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

export enum StudentGroup {
  ZL = 'ZL',
  BT = 'BT',
  CH = 'CH',
  MT = 'MT',
  BMS = 'BMS',
  ST = 'ST',
  GL = 'GL',
  CS = 'CS',
  DS = 'DS',
  ML = 'ML',
  BL = 'BL',
  MB = 'MB',
  CM = 'CM',
  AS = 'AS',
  ES = 'ES',
  SOR = 'SOR',
}

export enum StudentLevel {
  LEVEL_1 = 'level_1',
  LEVEL_2 = 'level_2',
  LEVEL_3 = 'level_3',
  LEVEL_4 = 'level_4',
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

export default function StudentProfileCard() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");

  const [profileData, setProfileData] = useState<StudentProfile | null>(null);
  const [editData, setEditData] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch student data
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

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("user.")) {
      const userField = field.split(".")[1];
      setEditData(prev => prev ? { ...prev, user: { ...prev.user, [userField]: value } } : prev);
    } else {
      setEditData(prev => prev ? { ...prev, [field]: value } : prev);
    }
  };

  const handleEditOpen = () => {
    setEditData(profileData);
    setIsDialogOpen(true);
  };

  // Form validation
  const validateForm = (data: StudentProfile): string[] => {
    const errors: string[] = [];
    
    if (!data.user.first_name?.trim()) errors.push("First name is required");
    if (!data.user.last_name?.trim()) errors.push("Last name is required");
    if (!data.user.email?.trim()) errors.push("Email is required");
    if (!data.regNo?.trim()) errors.push("Registration number is required");
    if (!data.nic?.trim()) errors.push("NIC is required");
    if (!data.contact?.trim()) errors.push("Contact number is required");
    if (!data.level) errors.push("Level is required");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.user.email && !emailRegex.test(data.user.email)) {
      errors.push("Please enter a valid email address");
    }
    
    if (data.linkedin && data.linkedin.trim() && !data.linkedin.includes('linkedin.com')) {
      errors.push("Please enter a valid LinkedIn URL");
    }
    
    return errors;
  };

  const handleSave = async () => {
  if (!editData || !studentId) return;
  
  const validationErrors = validateForm(editData);
  if (validationErrors.length > 0) {
    alert(`Please fix the following errors:\n${validationErrors.join('\n')}`);
    return;
  }
  
  try {
    setSaving(true);

    // Helper function to clean and include non-empty values
    const addIfValid = (obj: any, key: string, value: string | null | undefined) => {
      if (value && value.trim()) {
        obj[key] = value.trim();
      }
    };

    // Build payload
    const updatePayload: any = {};
    addIfValid(updatePayload, 'regNo', editData.regNo);
    addIfValid(updatePayload, 'nic', editData.nic);
    addIfValid(updatePayload, 'linkedin', editData.linkedin);
    addIfValid(updatePayload, 'contact', editData.contact);
    addIfValid(updatePayload, 'level', editData.level);

    // Handle user data
    if (editData.user) {
      const userPayload: any = {};
      addIfValid(userPayload, 'email', editData.user.email);
      addIfValid(userPayload, 'first_name', editData.user.first_name);
      addIfValid(userPayload, 'last_name', editData.user.last_name);
      
      // Handle profile picture (can be cleared with empty string)
      if (editData.user.profile_picture !== null && editData.user.profile_picture !== undefined) {
        userPayload.profile_picture = editData.user.profile_picture.trim() || null;
      }
      
      if (Object.keys(userPayload).length > 0) {
        updatePayload.user = userPayload;
      }
    }

    console.log('Update payload:', updatePayload);

    const response = await api.patch(`/student/${studentId}`, updatePayload);
    setProfileData(response.data || editData);
    setIsDialogOpen(false);
    setSaving(false);
    
  } catch (error: any) {
    setSaving(false);
    console.error("Save error:", error);
    
    const errorMsg = error.response?.data?.message || 
                    error.response?.data?.errors?.map((err: any) => err.message || err).join(', ') || 
                    "Failed to save. Please check your input and try again.";
    alert(errorMsg);
  }
};

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mx-auto w-80% mt-4">
      <strong>Error:</strong> {error}
    </div>
  );
  if (!profileData) return <div className="text-center mt-8">No student data found.</div>;

  return (
    <div className="mt-3 w-80% mx-auto p-4">
      <Card className="bg-gray-50 shadow-lg mt-3">
        <CardHeader className="text-center items-center justify-center pb-4">
          <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-blue-100">
            <AvatarImage src={profileData.user.profile_picture ?? "baurs.png"} alt="Student picture" />
          </Avatar>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {profileData.user.first_name} {profileData.user.last_name}
          </CardTitle>
          <div className="flex items-center gap-2 m-auto">
            <Badge variant="outline" className="border-gray-300">
              {profileData.level.replace('level_', 'Level ')}
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
                <span className="font-medium text-gray-700">LinkedIn:</span>
                {profileData.linkedin ? (
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View Profile
                  </a>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
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
                      required
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
                      required
                    />
                  </div>

                  {/* Level Dropdown */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="level" className="text-right font-medium">Level</Label>
                    <select
                      id="level"
                      value={editData.level}
                      onChange={e => handleInputChange('level', e.target.value)}
                      className="col-span-3 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="" disabled>Select level</option>
                      {Object.values(StudentLevel).map(level => (
                        <option key={level} value={level}>{level.replace('level_', 'Level ')}</option>
                      ))}
                    </select>
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
                      required
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
                      required
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
                      required
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="linkedin" className="text-right font-medium">
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={editData.linkedin ?? ""}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
                      className="col-span-3"
                      placeholder="https://www.linkedin.com/in/username"
                      type="url"
                    />
                  </div>

                  {/* Profile Picture URL */}
                </div>
              )}

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}