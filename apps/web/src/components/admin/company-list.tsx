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
import { Textarea } from "../ui/textarea";
import type { ComponentProps } from 'react';
import { Download, Loader2 } from "lucide-react";

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

function TextareaField({
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
        e: React.ChangeEvent<HTMLTextAreaElement>,
        section: "user" | "company"
    ) => void;
    section: "user" | "company";
}) {
    return (
        <div>
            <Label htmlFor={`${section}-${name}`}>{label}</Label>
            <Textarea
                id={`${section}-${name}`}
                name={name}
                value={value}
                onChange={(e) => onChange(e, section)}
                className="rounded-none resize-y"
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
  const [exporting, setExporting] = useState(false);

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

  const handleCompanyDetailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    } else {
      setLogoFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;

    try {
      setUpdateLoading(true);

      const dataPayload = {
        companyName: editingCompany.companyName,
        sponsership: editingCompany.sponsership,
        contactPersonName: editingCompany.contactPersonName,
        contactPersonDesignation: editingCompany.contactPersonDesignation,
        contactNumber: editingCompany.contactNumber,
        location: editingCompany.location,
        companyWebsite: editingCompany.companyWebsite,
        
        user: {
          email: editingCompany.user.email,
          first_name: editingCompany.user.first_name,
          last_name: editingCompany.user.last_name,
        },
        description: editingCompany.description,
      };

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
  
  const exportCompanyInfo = () => {
    setExporting(true);
    try {
      const headers = [
        "Company Name",
        "Sponsership",
        "Contact Person",
        "Contact Person Designation",
        "Contact Number",
        "Location",
        "Website",
        "Account Email",
        "User First Name",
        "User Last Name",
        "Description",
      ];

      const rows = companies.map(company => [
        company.companyName,
        company.sponsership,
        company.contactPersonName,
        company.contactPersonDesignation,
        company.contactNumber,
        company.location,
        company.companyWebsite,
        company.user.email,
        company.user.first_name,
        company.user.last_name,
        company.description,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row =>
          row.map(cell => {
            const cellStr = String(cell || "").replace(/"/g, '""');
            if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
              return `"${cellStr}"`;
            }
            return cellStr;
          }).join(",")
        )
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `company-list-report-${timestamp}.csv`;

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export company info.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card className="h-full shadow-md rounded-none">
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
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Download Company Info
        </Button>
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
                    key={c.companyID}
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
                <InputField
                  label="Company Name"
                  name="companyName"
                  value={editingCompany.companyName}
                  onChange={handleCompanyDetailChange}
                  section="company"
                />
                <InputField
                  label="Sponsership"
                  name="sponsership"
                  value={editingCompany.sponsership}
                  onChange={handleCompanyDetailChange}
                  section="company"
                />
                
                <InputField
                  label="Contact Person Name"
                  name="contactPersonName"
                  value={editingCompany.contactPersonName}
                  onChange={handleCompanyDetailChange}
                  section="company"
                />
                <InputField
                  label="Contact Person Designation"
                  name="contactPersonDesignation"
                  value={editingCompany.contactPersonDesignation}
                  onChange={handleCompanyDetailChange}
                  section="company"
                />
                
                <InputField
                  label="Contact Number"
                  name="contactNumber"
                  value={editingCompany.contactNumber}
                  onChange={handleCompanyDetailChange}
                  section="company"
                />
                <InputField
                  label="Location"
                  name="location"
                  value={editingCompany.location}
                  onChange={handleCompanyDetailChange}
                  section="company"
                />
                <InputField
                  label="Company Website"
                  name="companyWebsite"
                  value={editingCompany.companyWebsite}
                  onChange={handleCompanyDetailChange}
                  section="company"
                />
                
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
                  {(editingCompany.logo && !logoFile) && (
                    <p className="text-xs text-muted-foreground mt-1">Current: <a href={editingCompany.logo} target="_blank" rel="noopener noreferrer" className="underline truncate">{editingCompany.logo.substring(0, 50)}...</a></p>
                  )}
                  {logoFile && (
                    <p className="text-xs text-green-500 mt-1">Selected new file: {logoFile.name}</p>
                  )}
                </div>

                <InputField
                  label="Email"
                  name="email"
                  value={editingCompany.user.email}
                  onChange={handleCompanyDetailChange}
                  section="user"
                />
                <InputField
                  label="First Name"
                  name="first_name"
                  value={editingCompany.user.first_name}
                  onChange={handleCompanyDetailChange}
                  section="user"
                />
                <InputField
                  label="Last Name"
                  name="last_name"
                  value={editingCompany.user.last_name}
                  onChange={handleCompanyDetailChange}
                  section="user"
                />
                
                <div className="sm:col-span-2">
                    <TextareaField
                        label="Description"
                        name="description"
                        value={editingCompany.description}
                        onChange={handleCompanyDetailChange}
                        section="company"
                    />
                </div>

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