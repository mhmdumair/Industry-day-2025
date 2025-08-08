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

// Enum values matching backend DTOs
const companyStreams = [
  "ZL", "BT", "CH", "MT", "BMS", "ST", "GL", "CS", "DS",
  "ML", "BL", "MB", "CM", "AS", "ES", "SOR"
];

// Make sure these match your CompanySponsership enum values exactly
const companySponsorships = ["GOLD", "SILVER", "BRONZE"];

export default function CreateCompany() {
  const [formData, setFormData] = useState({
    user: {
      email: "",
      first_name: "",
      last_name: "",
      role: "company"
    },
    company: {
      companyName: "",
      description: "",
      sponsership: "GOLD",
      stream: "CS",
      contactPersonName: "",
      contactPersonDesignation: "",
      contactNumber: "",
      location: "",
      companyWebsite: "",
      logo: "",
    },
  });

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: "user" | "company",
  ) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [section]: { ...p[section], [name]: value } }));
  };

  const handleSelect = (
    name: "stream" | "sponsership",
    value: string,
  ) => setFormData(p => ({ ...p, company: { ...p.company, [name]: value } }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Function to prepare data matching DTO requirements
    const prepareUserData = (data: any) => {
      const prepared: any = {
        email: data.email,
        role: data.role
      };
      
      // Only include optional fields if they have values
      if (data.first_name && data.first_name.trim() !== "") {
        prepared.first_name = data.first_name;
      }
      if (data.last_name && data.last_name.trim() !== "") {
        prepared.last_name = data.last_name;
      }
      
      return prepared;
    };

    const prepareCompanyData = (data: any) => {
      const prepared: any = {
        companyName: data.companyName,
        description: data.description,
        sponsership: data.sponsership,
        contactPersonName: data.contactPersonName,
        contactPersonDesignation: data.contactPersonDesignation,
        contactNumber: data.contactNumber,
        stream: data.stream,
        location: data.location
      };
      
      // Only include optional fields if they have values
      if (data.logo && data.logo.trim() !== "") {
        prepared.logo = data.logo;
      }
      if (data.companyWebsite && data.companyWebsite.trim() !== "") {
        prepared.companyWebsite = data.companyWebsite;
      }
      
      return prepared;
    };

    const payload = {
      user: prepareUserData(formData.user),
      company: prepareCompanyData(formData.company)
    };

    try {
      console.log("Payload:", payload);

      await api.post("/company", payload);
      alert("Company created!");
      setFormData({
        user: { email: "", first_name: "", last_name: "", role: "company" },
        company: {
          companyName: "",
          description: "",
          sponsership: "GOLD",
          stream: "CS",
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
      alert(`Failed to create company: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle>Create Company</CardTitle>
        <CardDescription>Register new company profile</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          {/* User Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Email *"
              name="email"
              type="email"
              value={formData.user.email}
              onChange={(e) => handleInput(e, "user")}
              required={true}
            />
            <Field
              label="First Name"
              name="first_name"
              value={formData.user.first_name}
              onChange={(e) => handleInput(e, "user")}
              required={false}
            />
            <Field
              label="Last Name"
              name="last_name"
              value={formData.user.last_name}
              onChange={(e) => handleInput(e, "user")}
              required={false}
            />
          </div>
          
          <hr/>
          
          {/* Company Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Field
              label="Company Name *"
              name="companyName"
              value={formData.company.companyName}
              onChange={(e) => handleInput(e, "company")}
              required={true}
            />
            <Field
              label="Description *"
              name="description"
              value={formData.company.description}
              onChange={(e) => handleInput(e, "company")}
              required={true}
            />
            <Field
              label="Contact Person *"
              name="contactPersonName"
              value={formData.company.contactPersonName}
              onChange={(e) => handleInput(e, "company")}
              required={true}
            />
            <Field
              label="Designation *"
              name="contactPersonDesignation"
              value={formData.company.contactPersonDesignation}
              onChange={(e) => handleInput(e, "company")}
              required={true}
            />
            <Field
              label="Contact Number *"
              name="contactNumber"
              value={formData.company.contactNumber}
              onChange={(e) => handleInput(e, "company")}
              required={true}
            />
            <Field
              label="Location *"
              name="location"
              value={formData.company.location}
              onChange={(e) => handleInput(e, "company")}
              required={true}
            />
            <Field
              label="Company Website"
              name="companyWebsite"
              type="url"
              value={formData.company.companyWebsite}
              onChange={(e) => handleInput(e, "company")}
              required={false}
            />
            <Field
              label="Logo URL"
              name="logo"
              type="url"
              value={formData.company.logo}
              onChange={(e) => handleInput(e, "company")}
              required={false}
            />

            <div>
              <Label>Sponsorship *</Label>
              <Select
                value={formData.company.sponsership}
                onValueChange={(v) => handleSelect("sponsership", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Sponsorship" />
                </SelectTrigger>
                <SelectContent>
                  {companySponsorships.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Stream *</Label>
              <Select
                value={formData.company.stream}
                onValueChange={(v) => handleSelect("stream", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Stream" />
                </SelectTrigger>
                <SelectContent>
                  {companyStreams.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">
            Create Company
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
  type = "text",
  required = true,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}