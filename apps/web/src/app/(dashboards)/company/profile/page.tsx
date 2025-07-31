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
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Phone, User, Building } from "lucide-react";
import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";

// Types
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
  stream: string;
  sponsership: string;
  location: string;
  companyWebsite: string;
  user: User;
}

export enum CompanyStream {
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


export default function ProfileCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId");

  // For editing—use a copy so user cancels don't affect display
  const [editData, setEditData] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      setError("No companyId provided in URL.");
      return;
    }
    setLoading(true);
    api
      .get<CompanyProfile>(`/company/${companyId}`)
      .then((res) => {
        setProfileData(res.data);
        setEditData(res.data); // Set editing data as well for dialog
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch company profile.");
        setLoading(false);
      });
  }, [companyId]);

  // Update editData—not profileData!
  const handleInputChange = <K extends keyof CompanyProfile>(
    field: K,
    value: CompanyProfile[K]
  ) => {
    setEditData((prev) =>
      prev ? { ...prev, [field]: value } : prev
    );
  };

  // When opening dialog, copy latest data
  const handleEditOpen = () => {
    setEditData(profileData);
    setIsDialogOpen(true);
  };

 const handleSave = async () => {
  if (!editData) return;
  try {
    setLoading(true);

    const updatePayload = {
        companyName: editData.companyName,
        description: editData.description,
        contactPersonName: editData.contactPersonName,
        contactPersonDesignation: editData.contactPersonDesignation,
        contactNumber: editData.contactNumber,
        logo: editData.logo,
        stream: editData.stream,
        location: editData.location,
        companyWebsite: editData.companyWebsite,
      }

    console.log(updatePayload);
    await api.patch(`/company/${companyId}`, updatePayload);

    setProfileData((prev) =>
      prev ? { ...prev, ...updatePayload } : prev
    );

    setIsDialogOpen(false);
    setLoading(false);
  } catch (e) {
    setLoading(false);
    alert("Failed to save. Please try again.");
    console.error("Save error:", e);
  }
};




  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!profileData) return <div>No company data found.</div>;

  return (
    <div className="mt-3 w-80% mx-auto p-4">
      <Card className="bg-gray-50 shadow-lg mt-3">
        <CardHeader className="text-center items-center justify-center pb-4">
          <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-blue-100">
            <AvatarImage src={profileData?.user?.profile_picture || "/logo/baurs.png"} alt="Company Logo" />
          </Avatar>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {profileData.contactPersonName}
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            {profileData.companyName}
          </CardDescription>
          <div className="flex items-center gap-2 m-auto">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {profileData.stream}
            </Badge>
          </div>
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
              <Button type="button" onClick={handleEditOpen}>
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Company Profile</DialogTitle>
                <DialogDescription>
                  Update your company information. All fields are required unless marked optional.
                </DialogDescription>
              </DialogHeader>
              {editData && (
                <div className="grid gap-6 py-4">
                  {/* Company Name */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company-name" className="text-right font-medium">
                      Company Name
                    </Label>
                    <Input
                      id="company-name"
                      value={editData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      className="col-span-3"
                      placeholder="Enter company name"
                    />
                  </div>

                  {/* Company Stream */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company-stream" className="text-right font-medium">
                        Stream
                    </Label>
                    <select
                        id="company-stream"
                        value={editData?.stream || ""}
                        onChange={(e) => handleInputChange("stream", e.target.value as CompanyStream)}
                        className="col-span-3 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>
                        Select stream
                        </option>
                        {Object.entries(CompanyStream).map(([key, val]) => (
                        <option key={key} value={val}>
                            {val}
                        </option>
                        ))}
                    </select>
                    </div>


                  {/* Contact Person Name */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact-person" className="text-right font-medium">
                      Contact Person
                    </Label>
                    <Input
                      id="contact-person"
                      value={editData.contactPersonName}
                      onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
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
                      value={editData.contactPersonDesignation}
                      onChange={(e) => handleInputChange("contactPersonDesignation", e.target.value)}
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
                      value={editData.contactNumber}
                      onChange={(e) => handleInputChange("contactNumber", e.target.value)}
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
                      value={editData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
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
                      value={editData.companyWebsite}
                      onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                      className="col-span-3"
                      placeholder="https://www.company.com"
                      type="url"
                    />
                  </div>

                  {/* Logo URL */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="logo" className="text-right font-medium">
                      Logo URL <span className="text-xs text-gray-500 block">Optional</span>
                    </Label>
                    <Input
                      id="logo"
                      value={editData.logo}
                      onChange={(e) => handleInputChange("logo", e.target.value)}
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
                      value={editData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="col-span-3 min-h-[120px]"
                      placeholder="Enter company description"
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