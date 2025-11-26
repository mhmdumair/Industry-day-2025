"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

// --- 1. Define Constants & Zod Schema ---

const companySponsorships = ["GOLD", "SILVER", "BRONZE"] as const;

const formSchema = z.object({
  user: z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.literal("company"),
  }),
  company: z.object({
    companyName: z.string().min(1, "Company name is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    sponsership: z.enum(companySponsorships),
    contactPersonName: z.string().min(1, "Contact person is required"),
    contactPersonDesignation: z.string().min(1, "Designation is required"),
    contactNumber: z.string().min(1, "Contact number is required"), // You can add regex here for phone validation
    location: z.string().min(1, "Location is required"),
    companyWebsite: z.string().url("Invalid URL").optional().or(z.literal("")),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateCompany() {
  // --- 2. Setup React Hook Form ---
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  });

  // File state remains manual as it's often cleaner than RHF for simple file inputs
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  // --- 3. Form Submission Handler ---
  const onSubmit = async (values: FormValues) => {
    setApiError(null);
    setSuccess(null);

    // Construct payload
    const jsonPayload = {
      user: values.user,
      company: {
        ...values.company,
        // Only include website if it has a value
        ...(values.company.companyWebsite ? { companyWebsite: values.company.companyWebsite } : {}),
      },
    };

    const data = new FormData();
    if (logoFile) {
      data.append("logo", logoFile);
    }
    data.append("data", JSON.stringify(jsonPayload));

    try {
      await api.post("/company", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Company created successfully!");
      
      // Reset Form
      reset(); 
      setLogoFile(null);
      // Manually reset file input visual
      const fileInput = document.getElementById("logo") as HTMLInputElement;
      if(fileInput) fileInput.value = "";

    } catch (err) {
      if (isAxiosError(err)) {
        const message = err.response?.data?.message || "An API error occurred.";
        setApiError(message);
      } else {
        setApiError("An unexpected error occurred.");
      }
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input 
                {...register("company.companyName")} 
                placeholder="e.g., Tech Solutions Inc." 
                className="rounded-none" 
              />
              {errors.company?.companyName && <p className="text-red-500 text-sm">{errors.company.companyName.message}</p>}
            </div>

            {/* Sponsorship - Using Controller for Select */}
            <div className="space-y-2">
              <Label>Sponsorship *</Label>
              <Controller
                control={control}
                name="company.sponsership"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="rounded-none">
                      <SelectValue placeholder="Select sponsorship" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {companySponsorships.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.company?.sponsership && <p className="text-red-500 text-sm">{errors.company.sponsership.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input 
                {...register("user.email")} 
                type="email" 
                placeholder="e.g., contact@company.com" 
                className="rounded-none" 
              />
              {errors.user?.email && <p className="text-red-500 text-sm">{errors.user.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input 
                {...register("user.password")} 
                type="password" 
                placeholder="Enter a secure password" 
                className="rounded-none" 
              />
              {errors.user?.password && <p className="text-red-500 text-sm">{errors.user.password.message}</p>}
            </div>

            {/* Contact Person */}
            <div className="space-y-2">
              <Label htmlFor="contactPersonName">Contact Person *</Label>
              <Input 
                {...register("company.contactPersonName")} 
                placeholder="Full Name" 
                className="rounded-none" 
              />
              {errors.company?.contactPersonName && <p className="text-red-500 text-sm">{errors.company.contactPersonName.message}</p>}
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <Label htmlFor="contactPersonDesignation">Designation *</Label>
              <Input 
                {...register("company.contactPersonDesignation")} 
                placeholder="e.g., HR Manager" 
                className="rounded-none" 
              />
              {errors.company?.contactPersonDesignation && <p className="text-red-500 text-sm">{errors.company.contactPersonDesignation.message}</p>}
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number *</Label>
              <Input 
                {...register("company.contactNumber")} 
                placeholder="e.g., +1234567890" 
                className="rounded-none" 
              />
              {errors.company?.contactNumber && <p className="text-red-500 text-sm">{errors.company.contactNumber.message}</p>}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input 
                {...register("company.location")} 
                placeholder="e.g., New York, USA" 
                className="rounded-none" 
              />
              {errors.company?.location && <p className="text-red-500 text-sm">{errors.company.location.message}</p>}
            </div>

            {/* Company Website */}
            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Company Website</Label>
              <Input 
                {...register("company.companyWebsite")} 
                type="url" 
                placeholder="https://www.company.com" 
                className="rounded-none" 
              />
              {errors.company?.companyWebsite && <p className="text-red-500 text-sm">{errors.company.companyWebsite.message}</p>}
            </div>

            {/* Logo File (Manual Handler) */}
            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="logo"
                  name="logo"
                  type="file"
                  onChange={handleFileChange}
                  className="rounded-none"
                />
              </div>
            </div>

          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              {...register("company.description")}
              rows={4}
              placeholder="A brief description of your company..."
              className="rounded-none"
            />
            {errors.company?.description && <p className="text-red-500 text-sm">{errors.company.description.message}</p>}
          </div>

          {/* Global API Errors / Success */}
          {apiError && (
            <p className="text-red-500 text-sm text-center">{apiError}</p>
          )}
          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}

          <Button
            type="submit"
            className="w-full mt-4 rounded-none"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Creating..." : "Create Company"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}