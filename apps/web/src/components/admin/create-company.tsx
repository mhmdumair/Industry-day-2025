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

const companySponsorships = ["GOLD", "SILVER", "BRONZE"];

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
      logo: "",
    },
  });

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

    const payload = {
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
        ...(formData.company.logo && { logo: formData.company.logo }),
        ...(formData.company.companyWebsite && {
          companyWebsite: formData.company.companyWebsite,
        }),
      },
    };

    try {
      await api.post("/company", payload);
      setSuccess("Company created successfully!");
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
          logo: "",
        },
      });
    } catch (err: any) {
      console.error("Error details:", err.response?.data ?? err);
      setError(err.response?.data?.message || "Failed to create company.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Create Company</CardTitle>
        <CardDescription>
          Register a new company profile with user credentials.
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
              label="Logo"
              name="logo"
              type="text"
              value={formData.company.logo}
              onChange={(e) => handleInputChange(e, "company")}
              required={false}
              placeholder="logo"
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
            className="w-full mt-4"
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
  type = "text",
  required = true,
  placeholder = "",
  isSelect = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange?: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  isSelect?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {isSelect ? (
        <Select value={value} onValueChange={onSelectChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {companySponsorships.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}