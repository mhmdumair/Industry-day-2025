"use client";

import React, { useState } from "react";
import api from "@/lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { isAxiosError } from "axios";

const companySponsorships = ["GOLD", "SILVER", "BRONZE"];

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange?: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  isSelect?: boolean;
  isFile?: boolean;
  onFileChange?: (file: File | null) => void;
}


export default function CreateCompany() {
  const [formData, setFormData] = useState({
    user: {
      email: "",
      password: "",
      role: "company",
    },
    company: {
      companyName: "",
      description: "",
      sponsership: "GOLD",
      contactPersonName: "",
      contactPersonDesignation: "",
      contactNumber: "",
      location: "",
      companyWebsite: "",
    },
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: "user" | "company",
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [section]: { ...p[section], [name]: value } }));
  };

  const handleFileChange = (file: File | null) => {
    setLogoFile(file);
  };

  const handleSponsorshipSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      company: { ...prev.company, sponsership: value },
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // 1. Construct the JSON part of the payload (excluding the file)
    const jsonPayload = {
      user: {
        email: formData.user.email,
        password: formData.user.password,
        role: formData.user.role,
      },
      company: {
        companyName: formData.company.companyName,
        description: formData.company.description,
        sponsership: formData.company.sponsership,
        contactPersonName: formData.company.contactPersonName,
        contactPersonDesignation: formData.company.contactPersonDesignation,
        contactNumber: formData.company.contactNumber,
        location: formData.company.location,
        // Since logo is uploaded as a file, we remove the string field here,
        // but include companyWebsite if present.
        ...(formData.company.companyWebsite && {
          companyWebsite: formData.company.companyWebsite,
        }),
      },
    };

    // 2. Use FormData for file and JSON submission
    const data = new FormData();

    // Append the file using the key 'logo'
    if (logoFile) {
      data.append("logo", logoFile);
    }
    
    // Append the JSON DTO payload as a string under the key 'data'
    data.append('data', JSON.stringify(jsonPayload));


    try {
      // 3. Target the secured single creation route /company
      await api.post("/company", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Crucial for file uploads
        },
      });

      setSuccess("Company created successfully!");
      
      // Reset form and file state
      setFormData({
        user: { email: "", password: "", role: "company" },
        company: {
          companyName: "",
          description: "",
          sponsership: "GOLD",
          contactPersonName: "",
          contactPersonDesignation: "",
          contactNumber: "",
          location: "",
          companyWebsite: "",
        },
      });
      setLogoFile(null);

    } catch (err) {
      if (isAxiosError(err)) {
        console.error("Error details:", err.response?.data);
        const message = err.response?.data?.message || "An API error occurred.";
        setError(message);
      } else {
        console.error("An unexpected error occurred:", err);
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full mx-auto shadow-lg rounded-none">
      <CardHeader>
        <CardTitle>Create Company (Internal)</CardTitle>
        <CardDescription>
          Register a new company profile with user credentials and upload a logo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Company Name *"
              name="companyName"
              value={formData.company.companyName}
              onChange={(e) => handleInputChange(e, "company")}
              placeholder="e.g., Tech Solutions Inc."
            />
            <Field
              label="Sponsorship *"
              name="sponsership"
              value={formData.company.sponsership}
              isSelect={true}
              onSelectChange={handleSponsorshipSelect}
            />
            <Field
              label="Email *"
              name="email"
              type="email"
              value={formData.user.email}
              onChange={(e) => handleInputChange(e, "user")}
              placeholder="e.g., contact@company.com"
            />
            <Field
              label="Password *"
              name="password"
              type="password"
              value={formData.user.password}
              onChange={(e) => handleInputChange(e, "user")}
              placeholder="Enter a secure password"
            />
            <Field
              label="Contact Person *"
              name="contactPersonName"
              value={formData.company.contactPersonName}
              onChange={(e) => handleInputChange(e, "company")}
              placeholder="Full Name"
            />
            <Field
              label="Designation *"
              name="contactPersonDesignation"
              value={formData.company.contactPersonDesignation}
              onChange={(e) => handleInputChange(e, "company")}
              placeholder="e.g., HR Manager"
            />
            <Field
              label="Contact Number *"
              name="contactNumber"
              value={formData.company.contactNumber}
              onChange={(e) => handleInputChange(e, "company")}
              placeholder="e.g., +1234567890"
            />
            <Field
              label="Location *"
              name="location"
              value={formData.company.location}
              onChange={(e) => handleInputChange(e, "company")}
              placeholder="e.g., New York, USA"
            />
            <Field
              label="Company Website"
              name="companyWebsite"
              type="url"
              value={formData.company.companyWebsite}
              onChange={(e) => handleInputChange(e, "company")}
              required={false}
              placeholder="https://www.company.com"
            />
            
            <Field
              label="Company Logo"
              name="logo"
              isFile={true}
              value={logoFile ? logoFile.name : ""}
              onFileChange={handleFileChange}
              required={false}
              placeholder="Upload Logo Image"
            />

          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">
              Description *
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.company.description}
              onChange={(e) => handleInputChange(e, "company")}
              required
              rows={4}
              placeholder="A brief description of your company..."
              className="rounded-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}

          <Button
            type="submit"
            className="w-full mt-4 rounded-none"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Creating..." : "Create Company"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


function Field({
  label,
  name,
  value,
  onChange,
  onSelectChange,
  onFileChange,
  type = "text",
  required = true,
  placeholder = "",
  isSelect = false,
  isFile = false,
}: FieldProps) {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFileChange) {
      const file = e.target.files?.[0] || null;
      onFileChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-gray-700">{label}</Label>
      {isSelect ? (
        <Select value={value} onValueChange={onSelectChange}>
          <SelectTrigger className="rounded-none">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            {companySponsorships.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : isFile ? (
        <div className="flex items-center space-x-2">
          <Input
            id={name}
            name={name}
            type="file"
            onChange={handleFileChange}
            required={required}
            className="rounded-none"
          />
        </div>
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="rounded-none"
        />
      )}
    </div>
  );
}