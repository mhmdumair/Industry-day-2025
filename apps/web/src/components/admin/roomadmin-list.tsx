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
import { Trash2, Download, Loader2, Edit } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

// --- 1. Interfaces & Schema ---

interface User {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface Room {
  roomID: string;
  roomName: string;
  location: string;
  isActive: boolean;
}

interface RoomAdmin {
  roomAdminID: string;
  designation: string;
  roomID: string;
  user: User;
  room?: Room;
}

// Define Validation Schema
const formSchema = z.object({
  user: z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    first_name: z.string().min(1, "First Name is required"),
    last_name: z.string().min(1, "Last Name is required"),
  }),
});

type FormValues = z.infer<typeof formSchema>;

// --- 2. Main Component ---

export default function RoomadminList() {
  const router = useRouter();
  const [roomAdmins, setRoomAdmins] = useState<RoomAdmin[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Editing State
  const [editingRoomAdmin, setEditingRoomAdmin] = useState<RoomAdmin | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingRoomAdminId, setDeletingRoomAdminId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: { email: "", first_name: "", last_name: "" },
    },
  });

  const handleAuthError = () => {
    alert("Session expired. Please login again.");
    router.push("/auth/login");
  };

  useEffect(() => {
    Promise.all([fetchRoomAdmins(), fetchRooms()]);
  }, []);

  // Reset form when editingRoomAdmin changes
  useEffect(() => {
    if (editingRoomAdmin) {
      reset({
        user: {
          email: editingRoomAdmin.user.email,
          first_name: editingRoomAdmin.user.first_name,
          last_name: editingRoomAdmin.user.last_name,
        },
      });
    }
  }, [editingRoomAdmin, reset]);

  const fetchRoomAdmins = async () => {
    try {
      setError(null);
      const { data } = await api.get<RoomAdmin[]>("/room-admin");
      setRoomAdmins(data);
    } catch (e: any) {
      const axiosError = e as AxiosError;
      if (axiosError.response?.status === 401) {
        handleAuthError();
      } else {
        console.error("Error fetching room admins:", e);
        const errorMessage = e.response?.data?.message || "Failed to fetch room admins.";
        setError(errorMessage);
        setRoomAdmins([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const { data } = await api.get<Room[]>("/room");
      setRooms(data.filter((room: Room) => room.isActive));
    } catch (e: any) {
      console.error("Error fetching rooms:", e);
    }
  };

  const handleEditClick = (roomAdmin: RoomAdmin) => {
    setUpdateError(null);
    setEditingRoomAdmin(roomAdmin);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditingRoomAdmin(null);
    setIsDialogOpen(false);
    setUpdateError(null);
    reset();
  };

  // --- Submit Handler ---
  const onSubmit = async (values: FormValues) => {
    if (!editingRoomAdmin) return;

    try {
      setUpdateError(null);

      // Payload structure matches the schema structure exactly
      const payload = {
        user: values.user,
      };

      await api.patch(`/room-admin/${editingRoomAdmin.roomAdminID}`, payload);

      // Update local state
      setRoomAdmins((prev) =>
        prev.map((ra) =>
          ra.roomAdminID === editingRoomAdmin.roomAdminID 
            ? { ...ra, user: { ...ra.user, ...values.user } } 
            : ra
        )
      );

      handleDialogClose();
    } catch (error: any) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        handleAuthError();
      } else {
        console.error("Update failed:", error);
        const errorMessage = error.response?.data?.message || "Failed to update room admin.";
        setUpdateError(errorMessage);
      }
    }
  };

  const handleDelete = async (roomAdminID: string) => {
    if (!confirm("Are you sure you want to permanently delete this room admin?")) return;

    try {
      setDeletingRoomAdminId(roomAdminID);
      setDeleteError(null);
      await api.delete(`/room-admin/${roomAdminID}`);
      setRoomAdmins((prev) => prev.filter((ra) => ra.roomAdminID !== roomAdminID));
    } catch (error: any) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        handleAuthError();
      } else {
        console.error("Delete failed:", error);
        setDeleteError("Failed to delete room admin.");
      }
    } finally {
      setDeletingRoomAdminId(null);
    }
  };

  const handleRetryFetch = () => {
    setLoading(true);
    fetchRoomAdmins();
  };

  const getRoomName = (roomID: string) => {
    const room = rooms.find((r) => r.roomID === roomID);
    return room ? `${room.roomName} - ${room.location}` : "";
  };

  const getFullName = (user: User) => {
    return `${user.first_name || ""} ${user.last_name || ""}`.trim() || "N/A";
  };
  
  const exportRoomAdminInfo = () => {
    setExporting(true);
    try {
      const headers = ["First Name", "Last Name", "Email", "Designation", "Room Name", "Room Location", "User Role"];
      const rows = roomAdmins.map(ra => [
        ra.user.first_name,
        ra.user.last_name,
        ra.user.email,
        ra.designation,
        ra.room?.roomName || getRoomName(ra.roomID).split(" - ")[0] || "N/A",
        ra.room?.location || getRoomName(ra.roomID).split(" - ")[1] || "N/A",
        ra.user.role,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${String(cell || "").replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `room-admin-list-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export room admin data.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card className="rounded-none shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Room Admin List</CardTitle>
            <CardDescription>Manage room administrators</CardDescription>
          </div>
          <div className="flex gap-2">
            {error && (
              <Button variant="outline" size="sm" onClick={handleRetryFetch} disabled={loading} className="rounded-none">
                {loading ? "Loading..." : "Retry"}
              </Button>
            )}
            <Button onClick={exportRoomAdminInfo} disabled={exporting || roomAdmins.length === 0} className="rounded-none">
              {exporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              Download Data
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {deleteError && (
          <Alert variant="destructive" className="rounded-none mb-4">
            <AlertTitle>Delete Error</AlertTitle>
            <AlertDescription>
              {deleteError}
              <Button variant="ghost" size="sm" onClick={() => setDeleteError(null)} className="ml-2 h-auto p-1">×</Button>
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="p-4 text-center">Loading room admins...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {["Name", "Email", "Designation", "Room", "Actions"].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomAdmins.length ? (
                roomAdmins.map((ra) => (
                  <TableRow key={ra.roomAdminID}>
                    <TableCell>{getFullName(ra.user)}</TableCell>
                    <TableCell>{ra.user.email}</TableCell>
                    <TableCell>{ra.designation}</TableCell>
                    <TableCell>{ra.room?.location || getRoomName(ra.roomID)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {/* EDIT ICON */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditClick(ra)}
                          disabled={deletingRoomAdminId === ra.roomAdminID}
                          className="h-8 w-8 text-gray-500 hover:text-black"
                          title="Edit Room Admin"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {/* DELETE ICON */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(ra.roomAdminID)}
                          disabled={deletingRoomAdminId === ra.roomAdminID}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete Room Admin"
                        >
                          {deletingRoomAdminId === ra.roomAdminID ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No room admins found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-none">
          <DialogHeader>
            <DialogTitle>Edit Room Admin</DialogTitle>
          </DialogHeader>

          {editingRoomAdmin && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Email */}
                <div>
                    <Label>Email</Label>
                    <Input {...register("user.email")} className="rounded-none" />
                    {errors.user?.email && <p className="text-red-500 text-xs">{errors.user.email.message}</p>}
                </div>

                {/* First Name */}
                <div>
                    <Label>First Name</Label>
                    <Input {...register("user.first_name")} className="rounded-none" />
                    {errors.user?.first_name && <p className="text-red-500 text-xs">{errors.user.first_name.message}</p>}
                </div>

                {/* Last Name */}
                <div>
                    <Label>Last Name</Label>
                    <Input {...register("user.last_name")} className="rounded-none" />
                    {errors.user?.last_name && <p className="text-red-500 text-xs">{errors.user.last_name.message}</p>}
                </div>

                {/* Read-only Fields */}
                <div>
                  <Label>Designation (Read-only)</Label>
                  <Input value={editingRoomAdmin.designation} disabled className="rounded-none bg-gray-100" />
                </div>

                <div>
                  <Label>Assigned Room (Read-only)</Label>
                  <Input value={getRoomName(editingRoomAdmin.roomID)} disabled className="rounded-none bg-gray-100" />
                </div>
              </div>

              {updateError && (
                <Alert variant="destructive" className="rounded-none">
                  <AlertTitle>Update Error</AlertTitle>
                  <AlertDescription>{updateError}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" className="flex-1 rounded-none" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={handleDialogClose} disabled={isSubmitting} className="rounded-none">
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