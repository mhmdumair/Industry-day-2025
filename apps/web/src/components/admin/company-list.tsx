"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import type { ComponentProps } from 'react';
import { Download, Loader2, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

// --- 1. Interfaces & Schema ---

interface User {
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
}

interface Company {
  companyID: string;
  companyName: string;
  sponsership: string;
  contactPersonName: string;
  contactPersonDesignation: string;
  contactNumber: string;
  location: string;
  companyWebsite: string;
  logo?: string;
  user: User;
  description: string;
}

// --- 2. Validation Schema ---

// URL Regex: Allows http/https OR www. OR plain domain
const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Phone Regex: Allows digits, +, -, and spaces
const phoneRegex = /^[+]?[\d\s-]+$/;

const formSchema = z.object({
  companyName: z.string().min(2, "Company Name must be at least 2 characters"),
  sponsership: z.string().min(1, "Sponsorship is required"),
  contactPersonName: z.string().min(2, "Contact Person must be at least 2 characters"),
  contactPersonDesignation: z.string().min(2, "Designation is required"),
  
  // Contact Number: Min 9 chars + Regex check
  contactNumber: z.string()
    .min(9, "Contact number must be at least 9 digits")
    .regex(phoneRegex, "Invalid phone number format"),

  location: z.string().min(2, "Location is required"),
  
  // Website: Regex + Optional logic
  companyWebsite: z.string()
    .regex(urlRegex, { message: "Invalid URL format (e.g., www.example.com)" })
    .optional()
    .or(z.literal("")),

  description: z.string().min(10, "Description must be at least 10 characters"),

  // User Validation
  user: z.object({
    email: z.string().email("Invalid email address"),
    first_name: z.string().min(2, "First Name must be at least 2 characters"),
    last_name: z.string().min(2, "Last Name must be at least 2 characters"),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Td = ({ children, ...rest }: ComponentProps<"td">) => (
  <td
    className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
    {...rest}
  >
    {children}
  </td>
);

// --- 3. Main Component ---

export default function CompanyList() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit State
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      sponsership: "",
      contactPersonName: "",
      contactPersonDesignation: "",
      contactNumber: "",
      location: "",
      companyWebsite: "",
      description: "",
      user: { email: "", first_name: "", last_name: "" },
    },
  });

  const handleAuthError = () => {
    alert("Session expired. Please login again.");
    router.push("/auth/login");
  };

  // Fetch Data
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Company[]>("/company");
        setCompanies(data);
        setError(null);
      } catch (e) {
        const axiosError = e as AxiosError;
        if (axiosError.response?.status === 401) {
          handleAuthError();
        } else {
          console.error(e);
          setError("Failed to fetch companies.");
          setCompanies([]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Populate Form on Edit Click
  useEffect(() => {
    if (editingCompany) {
      reset({
        companyName: editingCompany.companyName,
        sponsership: editingCompany.sponsership,
        contactPersonName: editingCompany.contactPersonName,
        contactPersonDesignation: editingCompany.contactPersonDesignation,
        contactNumber: editingCompany.contactNumber,
        location: editingCompany.location,
        companyWebsite: editingCompany.companyWebsite,
        description: editingCompany.description,
        user: {
          email: editingCompany.user.email,
          first_name: editingCompany.user.first_name,
          last_name: editingCompany.user.last_name,
        },
      });
      setLogoFile(null);
    }
  }, [editingCompany, reset]);

  const handleEditClick = (company: Company) => {
    setEditingCompany(company);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditingCompany(null);
    setLogoFile(null);
    setIsDialogOpen(false);
    reset();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    } else {
      setLogoFile(null);
    }
  };

  const handleResetPassword = async () => {
    if (!editingCompany) return;
    const confirmed = window.confirm(
      `Are you sure you want to reset the password for ${editingCompany.companyName}?`
    );
    if (!confirmed) return;

    try {
      setResetPasswordLoading(true);
      await api.patch(`/company/reset-password/${editingCompany.companyID}`);
      alert("Password reset successfully.");
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        handleAuthError();
      } else {
        console.error("Password reset failed:", error);
        alert("Failed to reset password");
      }
    } finally {
      setResetPasswordLoading(false);
    }
  };

  // --- Submit Handler ---
  const onSubmit = async (values: FormValues) => {
    if (!editingCompany) return;

    try {
      const dataPayload = values;

      const formData = new FormData();
      formData.append('data', JSON.stringify(dataPayload));

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await api.patch(`/company/${editingCompany.companyID}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedCompany = response.data;

      setCompanies((prev) =>
        prev.map((c) =>
          c.companyID === updatedCompany.companyID ? updatedCompany : c
        )
      );

      handleDialogClose();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        handleAuthError();
      } else {
        console.error("Update failed:", error);
        alert("Failed to update company");
      }
    }
  };
  
  const exportCompanyInfo = () => {
    setExporting(true);
    try {
      const headers = ["Company", "Sponsorship", "Contact", "Email", "Location"];
      const rows = companies.map(c => [
        c.companyName, c.sponsership, c.contactPersonName, c.user.email, c.location
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${String(cell || "").replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `company-list-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card className="h-full shadow-md rounded-none dark:bg-black">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Company List</CardTitle>
          <CardDescription>Fetched from database</CardDescription>
        </div>
        <Button
          onClick={exportCompanyInfo}
          disabled={exporting || companies.length === 0}
          className="rounded-none"
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
          Download Company Info
        </Button>
      </CardHeader>
      
      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="p-4 text-center">Loading companies...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {["Company", "Email", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companies.length ? (
                companies.map((c) => (
                  <tr
                    key={c.companyID}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <Td>{c.companyName}</Td>
                    <Td>{c.user.email}</Td>
                    <Td>
                      {/* Edit Icon */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-500 hover:text-black"
                        onClick={() => handleEditClick(c)}
                        title="Edit Company"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={3}>No companies found.</Td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] rounded-none bg-background flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>

          {editingCompany && (
            <div className="flex flex-col flex-1 min-h-0">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
                <div className="overflow-y-auto flex-1 pr-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Company Info */}
                    <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input {...register("companyName")} className="rounded-none" />
                        {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="sponsership">Sponsorship</Label>
                        <Input {...register("sponsership")} className="rounded-none" />
                        {errors.sponsership && <p className="text-red-500 text-xs">{errors.sponsership.message}</p>}
                    </div>
                    
                    <div>
                        <Label htmlFor="contactPersonName">Contact Person</Label>
                        <Input {...register("contactPersonName")} className="rounded-none" />
                        {errors.contactPersonName && <p className="text-red-500 text-xs">{errors.contactPersonName.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="contactPersonDesignation">Designation</Label>
                        <Input {...register("contactPersonDesignation")} className="rounded-none" />
                        {errors.contactPersonDesignation && <p className="text-red-500 text-xs">{errors.contactPersonDesignation.message}</p>}
                    </div>
                    
                    <div>
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input {...register("contactNumber")} className="rounded-none" />
                        {errors.contactNumber && <p className="text-red-500 text-xs">{errors.contactNumber.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="location">Location</Label>
                        <Input {...register("location")} className="rounded-none" />
                        {errors.location && <p className="text-red-500 text-xs">{errors.location.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="companyWebsite">Website</Label>
                        <Input {...register("companyWebsite")} className="rounded-none" />
                        {errors.companyWebsite && <p className="text-red-500 text-xs">{errors.companyWebsite.message}</p>}
                    </div>
                    
                    {/* File Upload */}
                    <div className="col-span-1">
                        <Label htmlFor="logo-upload">Company Logo</Label>
                        <Input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="rounded-none file:text-foreground"
                        />
                        {logoFile && (
                            <p className="text-xs text-green-500 mt-1">Selected: {logoFile.name}</p>
                        )}
                    </div>

                    {/* User Info (Nested) */}
                    <div>
                        <Label htmlFor="user.email">Email</Label>
                        <Input {...register("user.email")} className="rounded-none" />
                        {errors.user?.email && <p className="text-red-500 text-xs">{errors.user.email.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="user.first_name">First Name</Label>
                        <Input {...register("user.first_name")} className="rounded-none" />
                        {errors.user?.first_name && <p className="text-red-500 text-xs">{errors.user.first_name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="user.last_name">Last Name</Label>
                        <Input {...register("user.last_name")} className="rounded-none" />
                        {errors.user?.last_name && <p className="text-red-500 text-xs">{errors.user.last_name.message}</p>}
                    </div>
                    
                    <div className="sm:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                            {...register("description")} 
                            className="rounded-none resize-y" 
                        />
                        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                    </div>
                  </div>
                </div>
                
                {/* Footer Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    type="submit"
                    className="flex-1 rounded-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="destructive"
                    className="rounded-none"
                    onClick={handleResetPassword}
                    disabled={resetPasswordLoading || isSubmitting}
                  >
                    {resetPasswordLoading ? "Resetting..." : "Reset Password"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none"
                    onClick={handleDialogClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}