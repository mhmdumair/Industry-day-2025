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
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Download, Loader2, Edit, Trash2, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

// --- Interfaces ---

interface User {
  userID: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Admin {
  adminID: string;
  designation: string;
  user: User;
}

// --- Helper Components ---

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
    section: "user" | "admin"
  ) => void;
  section: "user" | "admin";
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

// --- Edit Dialog Component ---

interface EditAdminDialogProps {
  admin: Admin;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedAdmin: Admin) => void;
  onAuthError: () => void;
}

const EditAdminDialog: React.FC<EditAdminDialogProps> = ({ admin, isOpen, onClose, onUpdate, onAuthError }) => {
  const [formData, setFormData] = useState<Admin>(admin);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(admin);
    setApiError(null);
  }, [admin, isOpen]);

  const handleDetailChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: "user" | "admin"
  ) => {
    const { name, value } = e.target;
    if (section === "user") {
      setFormData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);

    try {
      const payload = {
        user: {
          email: formData.user.email,
          first_name: formData.user.first_name,
          last_name: formData.user.last_name,
        },
        designation: formData.designation,
      };
      
      const response = await api.patch(`/admin/${admin.adminID}`, payload);
      const updatedAdmin = response.data;

      onUpdate(updatedAdmin);
      onClose();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        onAuthError();
      } else {
        console.error("Update failed:", error);
        const message = (error as any).response?.data?.message || "Failed to update admin details.";
        setApiError(Array.isArray(message) ? message.join(', ') : message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-none bg-background">
        <DialogHeader>
          <DialogTitle>Edit Admin: {admin.user.first_name}</DialogTitle>
        </DialogHeader>

        {apiError && (
          <div className="text-red-600 border border-red-600 p-2 rounded-none">{apiError}</div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-1">Admin Details</h3>
          <InputField
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={handleDetailChange}
            section="admin"
          />

          <h3 className="text-lg font-semibold border-b pb-1 pt-4">User Account Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Email"
              name="email"
              value={formData.user.email}
              onChange={handleDetailChange}
              section="user"
            />
            <InputField
              label="First Name"
              name="first_name"
              value={formData.user.first_name}
              onChange={handleDetailChange}
              section="user"
            />
            <InputField
              label="Last Name"
              name="last_name"
              value={formData.user.last_name || ''}
              onChange={handleDetailChange}
              section="user"
            />
          </div>
          
          <DialogFooter>
            <Button
              type="submit"
              className="flex-1 rounded-none"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-none"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Main Component ---

export default function AdminList() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  const handleAuthError = () => {
    alert("Session expired. Please login again.");
    router.push("/auth/login");
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Admin[]>("/admin");
      const formattedData = data.map(admin => ({
        ...admin,
        user: {
          ...admin.user,
          last_name: admin.user.last_name || '', 
        }
      }));
      setAdmins(formattedData);
      setError(null);
    } catch (e) {
      const axiosError = e as AxiosError;
      if (axiosError.response?.status === 401) {
        handleAuthError();
      } else {
        console.error(e);
        setError("Failed to fetch admin list.");
        setAdmins([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const exportAdminList = () => {
    setExporting(true);
    try {
      const headers = ["Email", "First Name", "Last Name", "Designation"];
      const rows = admins.map(admin => [
        admin.user.email,
        admin.user.first_name,
        admin.user.last_name || 'N/A', 
        admin.designation,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row =>
          row.map(cell => `"${String(cell || "").replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `admin-list-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export admin list.");
    } finally {
      setExporting(false);
    }
  };

  const handleEditClick = (admin: Admin) => {
    setEditingAdmin(admin);
  };

  const handleUpdateAdmin = (updatedAdmin: Admin) => {
    setAdmins(prev => 
      prev.map(a => (a.adminID === updatedAdmin.adminID ? updatedAdmin : a))
    );
  };

  const handleDeleteClick = async (adminID: string) => {
    if (!confirm("Are you sure you want to delete this admin user? This action cannot be undone.")) {
      return;
    }

    setDeletingId(adminID);

    try {
      await api.delete(`/admin/${adminID}`);
      setAdmins(prev => prev.filter(admin => admin.adminID !== adminID));
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        handleAuthError();
      } else {
        console.error("Delete failed:", error);
        alert("Failed to delete admin. Check console for details.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="max-w-[75%] dark:bg-black h-full shadow-md rounded-none mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl leading-tight">Admin List</CardTitle>
          <CardDescription>All users with administrative privileges.</CardDescription>
        </div>
        <Button
          onClick={exportAdminList}
          disabled={exporting || admins.length === 0}
          className="rounded-none "
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Download Admin List
        </Button>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="p-4 text-center">Loading admins...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">{error}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Email</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Full Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Designation</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length ? (
                admins.map((admin) => (
                  <tr
                    key={admin.adminID}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{admin.user.email}</td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{`${admin.user.first_name} ${admin.user.last_name || ''}`}</td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{admin.designation}</td>
                    <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                      <div className="flex gap-1">
                        {/* EDIT ICON */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditClick(admin)}
                          className="h-8 w-8 text-gray-500 hover:text-black"
                          title="Edit Admin"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        {/* DELETE ICON (RED) */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteClick(admin.adminID)}
                          disabled={deletingId === admin.adminID}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete Admin"
                        >
                          {deletingId === admin.adminID ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0" colSpan={4}>No admins found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </CardContent>
      
      {editingAdmin && (
        <EditAdminDialog
          admin={editingAdmin}
          isOpen={!!editingAdmin}
          onClose={() => setEditingAdmin(null)}
          onUpdate={handleUpdateAdmin}
          onAuthError={handleAuthError}
        />
      )}
    </Card>
  );
}