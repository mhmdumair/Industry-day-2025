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
  companyID : string;
  companyName: string;
  sponsership: string;
  stream: string;
  contactPersonName: string;
  contactNumber: string;
  location: string;
  companyWebsite: string;
  logo?: string;
  user: User;
}

export default function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

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
      setIsDialogOpen(true);
    } catch (e) {
      console.error("Error opening dialog:", e);
    }
  };

  const handleDialogClose = () => {
    try {
      setEditingCompany(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;

    try {
      setUpdateLoading(true);

      const payload = {
        companyName: editingCompany.companyName,
        sponsership: editingCompany.sponsership,
        stream: editingCompany.stream,
        contactPersonName: editingCompany.contactPersonName,
        contactNumber: editingCompany.contactNumber,
        location: editingCompany.location,
        companyWebsite: editingCompany.companyWebsite,
        logo: editingCompany.logo,
        user: {
          email: editingCompany.user.email,
          first_name: editingCompany.user.first_name,
          last_name: editingCompany.user.last_name,
          profile_picture: editingCompany.user.profile_picture,
        },
      };

      await api.patch(`/company/${editingCompany.companyID}`, payload);

      setCompanies((prev) =>
        prev.map((c) =>
          c.companyName === editingCompany.companyName ? editingCompany : c
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
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle>Company List</CardTitle>
        <CardDescription>Fetched from database</CardDescription>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="p-4 text-center">Loading companies...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">{error}</div>
        ) : (
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {["Company", "Stream", "Email", "Actions"].map((h) => (
                  <th key={h} className="border px-2 py-1">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companies.length ? (
                companies.map((c, i) => (
                  <tr key={i}>
                    <Td>{c.companyName}</Td>
                    <Td>{c.stream}</Td>
                    <Td>{c.user.email}</Td>
                    <Td>
                      <Button size="sm" variant="ghost" onClick={() => handleEditClick(c)}>
                        Edit
                      </Button>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={4}>No companies found.</Td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>

          {editingCompany && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Company Name" name="companyName" value={editingCompany.companyName} onChange={handleInputChange} section="company" />
                <InputField label="Stream" name="stream" value={editingCompany.stream} onChange={handleInputChange} section="company" />
                <InputField label="Sponsership" name="sponsership" value={editingCompany.sponsership} onChange={handleInputChange} section="company" />
                <InputField label="Contact Person Name" name="contactPersonName" value={editingCompany.contactPersonName} onChange={handleInputChange} section="company" />
                <InputField label="Contact Number" name="contactNumber" value={editingCompany.contactNumber} onChange={handleInputChange} section="company" />
                <InputField label="Location" name="location" value={editingCompany.location} onChange={handleInputChange} section="company" />
                <InputField label="Company Website" name="companyWebsite" value={editingCompany.companyWebsite} onChange={handleInputChange} section="company" />
                <InputField label="Logo URL" name="logo" value={editingCompany.logo || ""} onChange={handleInputChange} section="company" />
                <InputField label="Email" name="email" value={editingCompany.user.email} onChange={handleInputChange} section="user" />
                <InputField label="First Name" name="first_name" value={editingCompany.user.first_name} onChange={handleInputChange} section="user" />
                <InputField label="Last Name" name="last_name" value={editingCompany.user.last_name} onChange={handleInputChange} section="user" />
                <InputField label="Profile Picture URL" name="profile_picture" value={editingCompany.user.profile_picture || ""} onChange={handleInputChange} section="user" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={updateLoading}>
                  {updateLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={handleDialogClose} disabled={updateLoading}>
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

const Td = ({ children, ...rest }: ComponentProps<'td'>) => (
    <td className="border px-2 py-1" {...rest}>
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
      <Label>{label}</Label>
      <Input name={name} value={value} onChange={(e) => onChange(e, section)} />
    </div>
  );
}
