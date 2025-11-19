"use client";

import React, { useEffect, useState } from "react";
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
import type { ComponentProps } from 'react';

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
  contactNumber: string;
  location: string;
  companyWebsite: string;
  logo?: string;
  user: User;
}

const Td = ({ children, ...rest }: ComponentProps<"td">) => (
  <td
    className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
    {...rest}
  >
    {children}
  </td>
);

function InputField({
  label,
  name,
  value,
  onChange,
  section,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    section: "user" | "company"
  ) => void;
  section: "user" | "company";
}) {
  return (
    <div>
      <Label htmlFor={`${section}-${name}`}>{label}</Label>
      <Input
        id={`${section}-${name}`}
        name={name}
        value={value}
        onChange={(e) => onChange(e, section)}
        className="rounded-none"
      />
    </div>
  );
}


export default function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // --- Data Fetching ---
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Company[]>("/company");
        setCompanies(data);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch companies.");
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- Dialog Handlers ---
  const handleEditClick = (company: Company) => {
    try {
      setEditingCompany({ ...company });
      setLogoFile(null);
      setIsDialogOpen(true);
    } catch (e) {
      console.error("Error opening dialog:", e);
    }
  };

  const handleDialogClose = () => {
    try {
      setEditingCompany(null);
      setLogoFile(null);
      setIsDialogOpen(false);
    } catch (e) {
      console.error("Error closing dialog:", e);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: "user" | "company"
  ) => {
    try {
      if (!editingCompany) return;
      const { name, value } = e.target;
      if (section === "user") {
        setEditingCompany((prev) => ({
          ...prev!,
          user: {
            ...prev!.user,
            [name]: value,
          },
        }));
      } else {
        setEditingCompany((prev) => ({
          ...prev!,
          [name]: value,
        }));
      }
    } catch (e) {
      console.error("Error updating input:", e);
    }
  };

  // --- File Change Handler ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    } else {
      setLogoFile(null);
    }
  };

  // --- Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;

    try {
      setUpdateLoading(true);

      // 1. Prepare JSON payload for the 'data' field
      const dataPayload = {
        companyName: editingCompany.companyName,
        sponsership: editingCompany.sponsership,
        contactPersonName: editingCompany.contactPersonName,
        contactNumber: editingCompany.contactNumber,
        location: editingCompany.location,
        companyWebsite: editingCompany.companyWebsite,
        
        user: {
          email: editingCompany.user.email,
          first_name: editingCompany.user.first_name,
          last_name: editingCompany.user.last_name,
        },
      };

      // 2. Create FormData object
      const formData = new FormData();
      formData.append('data', JSON.stringify(dataPayload));

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await api.patch(`/company/${editingCompany.companyID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedCompany = response.data;

      setCompanies((prev) =>
        prev.map((c) =>
          c.companyID === updatedCompany.companyID ? updatedCompany : c
        )
      );

      handleDialogClose();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update company");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Card className="h-full shadow-md rounded-none">
      <CardHeader>
        <CardTitle>Company List</CardTitle>
        <CardDescription>Fetched from database</CardDescription>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="p-4 text-center">Loading companies...</div>
        ) : error ? (
          <div className="p-4 text-center text-destructive">{error}</div>
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
                companies.map((c, i) => (
                  <tr
                    key={i}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <Td>{c.companyName}</Td>
                    <Td>{c.user.email}</Td>
                    <Td>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-none"
                        onClick={() => handleEditClick(c)}
                      >
                        Edit
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-none bg-background">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>

          {editingCompany && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* COMPANY FIELDS */}
                <InputField
                  label="Company Name"
                  name="companyName"
                  value={editingCompany.companyName}
                  onChange={handleInputChange}
                  section="company"
                />
                <InputField
                  label="Sponsership"
                  name="sponsership"
                  value={editingCompany.sponsership}
                  onChange={handleInputChange}
                  section="company"
                />
                <InputField
                  label="Contact Person Name"
                  name="contactPersonName"
                  value={editingCompany.contactPersonName}
                  onChange={handleInputChange}
                  section="company"
                />
                <InputField
                  label="Contact Number"
                  name="contactNumber"
                  value={editingCompany.contactNumber}
                  onChange={handleInputChange}
                  section="company"
                />
                <InputField
                  label="Location"
                  name="location"
                  value={editingCompany.location}
                  onChange={handleInputChange}
                  section="company"
                />
                <InputField
                  label="Company Website"
                  name="companyWebsite"
                  value={editingCompany.companyWebsite}
                  onChange={handleInputChange}
                  section="company"
                />
                
                {/* File Uploader */}
                <div className="col-span-1">
                  <Label htmlFor="logo-upload">Company Logo </Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="rounded-none file:text-foreground"
                  />
                  {/* Display current logo or selected file name */}
                  {(editingCompany.logo && !logoFile) && (
                    <p className="text-xs text-muted-foreground mt-1">Current: <a href={editingCompany.logo} target="_blank" rel="noopener noreferrer" className="underline truncate">{editingCompany.logo.substring(0, 50)}...</a></p>
                  )}
                  {logoFile && (
                    <p className="text-xs text-green-500 mt-1">Selected new file: {logoFile.name}</p>
                  )}
                </div>

                {/* USER FIELDS */}
                <InputField
                  label="Email"
                  name="email"
                  value={editingCompany.user.email}
                  onChange={handleInputChange}
                  section="user"
                />
                <InputField
                  label="First Name"
                  name="first_name"
                  value={editingCompany.user.first_name}
                  onChange={handleInputChange}
                  section="user"
                />
                <InputField
                  label="Last Name"
                  name="last_name"
                  value={editingCompany.user.last_name}
                  onChange={handleInputChange}
                  section="user"
                />

              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 rounded-none"
                  disabled={updateLoading}
                >
                  {updateLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none"
                  onClick={handleDialogClose}
                  disabled={updateLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}