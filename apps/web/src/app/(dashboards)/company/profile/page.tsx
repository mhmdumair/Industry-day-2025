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
import { AxiosError } from "axios";

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
  sponsership: string;
  location: string;
  companyWebsite: string;
  user: User;
}

// Helper function to ensure string values are never null
const safeString = (value: string | null | undefined): string => {
  return value || '';
};

// Helper function for URL validation
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export default function ProfileCard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId");

  // For editing—use a copy so user cancels don't affect display
  const [editData, setEditData] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    if (!companyId) {
      setError("Company ID is missing from URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .get<CompanyProfile>(`/company/${companyId}`)
      .then((res) => {
        // Ensure all string fields are not null
        const sanitizedData = {
          ...res.data,
          companyName: safeString(res.data.companyName),
          description: safeString(res.data.description),
          contactPersonName: safeString(res.data.contactPersonName),
          contactPersonDesignation: safeString(res.data.contactPersonDesignation),
          contactNumber: safeString(res.data.contactNumber),
          logo: safeString(res.data.logo),
          location: safeString(res.data.location),
          companyWebsite: safeString(res.data.companyWebsite),
        };
        setProfileData(sanitizedData);
        setEditData(sanitizedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
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

  // When opening dialog, copy latest data and ensure no null values
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
    if (!editData) return;

    // Front-end validation before sending to API
    if (!editData.companyName.trim()) {
      setSaveError("Company Name is required.");
      return;
    }
    if (!editData.contactPersonName.trim()) {
      setSaveError("Contact Person Name is required.");
      return;
    }
    if (editData.companyWebsite.trim() && !isValidUrl(editData.companyWebsite.trim())) {
      setSaveError("Please enter a valid website URL.");
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
        logo: editData.logo,
        location: editData.location,
        companyWebsite: editData.companyWebsite,
      };

      console.log("Sending payload:", updatePayload);
      await api.patch(`/company/${companyId}`, updatePayload);

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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-lg text-muted-foreground">Loading...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-destructive text-center">
            <h2 className="text-2xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    if (!profileData) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-muted-foreground text-center">
            <h2 className="text-2xl font-semibold mb-2">No Data</h2>
            <p>No company data found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 bg-card">
            <CardHeader className="text-center pb-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-primary/10">
                  <AvatarImage
                    src={profileData?.user?.profile_picture || profileData.logo || "/logo/c.png"}
                    alt="Company Logo"
                    className="object-cover"
                  />
                </Avatar>
                <div className="space-y-2">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                    {profileData.contactPersonName}
                  </CardTitle>
                  <CardDescription className="text-base sm:text-lg text-muted-foreground">
                    {profileData.companyName}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Description */}
              <div className="bg-muted/50 rounded-lg p-4 sm:p-6">
                <h3 className="font-semibold text-foreground mb-3">About Company</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {profileData.description}
                </p>
              </div>

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground mb-4 pb-2 border-b border-border">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <User className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Contact Person
                        </div>
                        <div className="text-sm font-medium text-foreground break-words">
                          {profileData.contactPersonName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <Building className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Designation
                        </div>
                        <div className="text-sm font-medium text-foreground break-words">
                          {profileData.contactPersonDesignation}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Phone
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          <a href={`tel:${profileData.contactNumber}`} className="hover:text-primary transition-colors">
                            {profileData.contactNumber}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground mb-4 pb-2 border-b border-border">
                    Company Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Location
                        </div>
                        <div className="text-sm font-medium text-foreground break-words">
                          {profileData.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <Globe className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Website
                        </div>
                        <div className="text-sm font-medium">
                          <a
                            href={profileData.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors break-all"
                          >
                            {profileData.companyWebsite}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="justify-center pt-6 pb-8">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleEditOpen}
                    className="w-full sm:w-auto px-8"
                  >
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto mx-4">
                  <DialogHeader>
                    <DialogTitle>Edit Company Profile</DialogTitle>
                    <DialogDescription>
                      Update your company information. All fields are required unless marked optional.
                    </DialogDescription>
                  </DialogHeader>
                  {editData && (
                    <div className="grid gap-6 py-4">
                      {saveError && (
                        <div className="text-sm font-medium text-destructive text-center mb-4">
                          {saveError}
                        </div>
                      )}

                      {/* Company Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                        <Label htmlFor="company-name" className="font-medium sm:text-right">
                          Company Name
                        </Label>
                        <Input
                          id="company-name"
                          value={safeString(editData.companyName)}
                          onChange={(e) => handleInputChange("companyName", e.target.value)}
                          className="sm:col-span-3"
                          placeholder="Enter company name"
                        />
                      </div>

                      {/* Contact Person Name */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                        <Label htmlFor="contact-person" className="font-medium sm:text-right">
                          Contact Person
                        </Label>
                        <Input
                          id="contact-person"
                          value={safeString(editData.contactPersonName)}
                          onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                          className="sm:col-span-3"
                          placeholder="Enter contact person name"
                        />
                      </div>

                      {/* Contact Person Designation */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                        <Label htmlFor="designation" className="font-medium sm:text-right">
                          Designation
                        </Label>
                        <Input
                          id="designation"
                          value={safeString(editData.contactPersonDesignation)}
                          onChange={(e) => handleInputChange("contactPersonDesignation", e.target.value)}
                          className="sm:col-span-3"
                          placeholder="Enter designation"
                        />
                      </div>

                      {/* Contact Number */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                        <Label htmlFor="contact-number" className="font-medium sm:text-right">
                          Contact Number
                        </Label>
                        <Input
                          id="contact-number"
                          value={safeString(editData.contactNumber)}
                          onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                          className="sm:col-span-3"
                          placeholder="Enter contact number"
                          type="tel"
                        />
                      </div>

                      {/* Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                        <Label htmlFor="location" className="font-medium sm:text-right">
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={safeString(editData.location)}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          className="sm:col-span-3"
                          placeholder="Enter company location"
                        />
                      </div>

                      {/* Company Website */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                        <Label htmlFor="website" className="font-medium sm:text-right">
                          Website
                        </Label>
                        <Input
                          id="website"
                          value={safeString(editData.companyWebsite)}
                          onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                          className="sm:col-span-3"
                          placeholder="https://www.company.com"
                          type="url"
                        />
                      </div>

                      {/* Description */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="font-medium sm:text-right mt-2">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={safeString(editData.description)}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          className="sm:col-span-3 min-h-[120px]"
                          placeholder="Enter company description"
                        />
                      </div>
                    </div>
                  )}

                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                    <Button type="submit" onClick={handleSave} className="w-full sm:w-auto">
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  };

  return <>{renderContent()}</>;
}