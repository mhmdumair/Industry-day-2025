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
import { Trash2, Download, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default function RoomadminList() {
  const [roomAdmins, setRoomAdmins] = useState<RoomAdmin[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomsError, setRoomsError] = useState<string | null>(null);
  const [editingRoomAdmin, setEditingRoomAdmin] = useState<RoomAdmin | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingRoomAdminId, setDeletingRoomAdminId] = useState<string | null>(
    null
  );
  const [exporting, setExporting] = useState(false);

  // --- Data Fetching ---
  useEffect(() => {
    Promise.all([fetchRoomAdmins(), fetchRooms()]);
  }, []);

  const fetchRoomAdmins = async () => {
    try {
      setError(null);
      const { data } = await api.get<RoomAdmin[]>("/room-admin");
      setRoomAdmins(data);
    } catch (e: any) {
      console.error("Error fetching room admins:", e);
      const errorMessage =
        e.response?.data?.message ||
        e.response?.data?.error ||
        "Failed to fetch room admins. Please try again.";
      setError(errorMessage);
      setRoomAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setRoomsError(null);
      const { data } = await api.get<Room[]>("/room");
      setRooms(data.filter((room: Room) => room.isActive));
    } catch (e: any) {
      console.error("Error fetching rooms:", e);
      const errorMessage =
        e.response?.data?.message ||
        e.response?.data?.error ||
        "Failed to fetch rooms for editing.";
      setRoomsError(errorMessage);
      setRooms([]);
    }
  };

  // --- Dialog Handlers ---
  const handleEditClick = (roomAdmin: RoomAdmin) => {
    try {
      setUpdateError(null);
      setEditingRoomAdmin({ ...roomAdmin });
      setIsDialogOpen(true);
      if (roomsError) {
        fetchRooms();
      }
    } catch (e) {
      console.error("Error opening dialog:", e);
    }
  };

  const handleDialogClose = () => {
    try {
      setEditingRoomAdmin(null);
      setIsDialogOpen(false);
      setUpdateError(null);
    } catch (e) {
      console.error("Error closing dialog:", e);
    }
  };

  // --- Input Change Handlers ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: "user" | "roomAdmin"
  ) => {
    try {
      if (!editingRoomAdmin) return;
      const { name, value } = e.target;
      if (section === "user") {
        setEditingRoomAdmin((prev) => ({
          ...prev!,
          user: {
            ...prev!.user,
            [name]: value,
          },
        }));
      } else {
        setEditingRoomAdmin((prev) => ({
          ...prev!,
          [name]: value,
        }));
      }
    } catch (e) {
      console.error("Error updating input:", e);
    }
  };

  // --- Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoomAdmin) return;

    try {
      setUpdateLoading(true);
      setUpdateError(null);

      const payload = {
        user: {
          email: editingRoomAdmin.user.email,
          first_name: editingRoomAdmin.user.first_name,
          last_name: editingRoomAdmin.user.last_name,
        },
      };
      console.log(editingRoomAdmin.roomAdminID);

      await api.patch(`/room-admin/${editingRoomAdmin.roomAdminID}`, payload);

      setRoomAdmins((prev) =>
        prev.map((ra) =>
          ra.roomAdminID === editingRoomAdmin.roomAdminID ? editingRoomAdmin : ra
        )
      );

      handleDialogClose();
    } catch (error: any) {
      console.error("Update failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update room admin. Please try again.";
      setUpdateError(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  // --- Delete Handler ---
  const handleDelete = async (roomAdminID: string) => {
    if (
      !confirm("Are you sure you want to permanently delete this room admin?")
    )
      return;

    try {
      setDeletingRoomAdminId(roomAdminID);
      setDeleteError(null);

      console.log("Permanently deleting room admin:", roomAdminID);

      await api.delete(`/room-admin/${roomAdminID}`);

      setRoomAdmins((prev) =>
        prev.filter((ra) => ra.roomAdminID !== roomAdminID)
      );

      console.log("Room admin permanently deleted successfully");
    } catch (error: any) {
      console.error("Delete failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to permanently delete room admin. Please try again.";
      setDeleteError(errorMessage);
    } finally {
      setDeletingRoomAdminId(null);
    }
  };

  // --- Utility Functions ---
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
  
  // --- CSV Export Logic ---
  const exportRoomAdminInfo = () => {
    setExporting(true);
    try {
      const headers = [
        "First Name",
        "Last Name",
        "Email",
        "Designation",
        "Room Name",
        "Room Location",
        "User Role",
      ];

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
      const filename = `room-admin-list-${timestamp}.csv`;

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
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

  // --- Render Component ---
  return (
    <Card className="rounded-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Room Admin List</CardTitle>
            <CardDescription>
              Manage room administrators in the system
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {error && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetryFetch}
                disabled={loading}
                className="rounded-none"
              >
                {loading ? "Loading..." : "Retry"}
              </Button>
            )}
            <Button
              onClick={exportRoomAdminInfo}
              disabled={exporting || roomAdmins.length === 0}
              className="rounded-none"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download Data
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {/* Delete Error Message */}
        {deleteError && (
          <Alert variant="destructive" className="rounded-none mb-4">
            <AlertTitle>Delete Error</AlertTitle>
            <AlertDescription>
              {deleteError}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteError(null)}
                className="ml-2 h-auto p-1"
              >
                ×
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="p-4 text-center">Loading room admins...</div>
        ) : error ? (
          <div className="p-4 text-center">
            <div className="text-destructive mb-2">{error}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryFetch}
              className="rounded-none"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {["Name", "Email", "Designation", "Room", "Actions"].map(
                  (h) => (
                    <TableHead key={h}>{h}</TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomAdmins.length ? (
                roomAdmins.map((ra, i) => (
                  <TableRow key={ra.roomAdminID || i}>
                    <TableCell>{getFullName(ra.user)}</TableCell>
                    <TableCell>{ra.user.email}</TableCell>
                    <TableCell>{ra.designation}</TableCell>
                    <TableCell>{ra.room?.location}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditClick(ra)}
                          disabled={deletingRoomAdminId === ra.roomAdminID}
                          className="rounded-none"
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(ra.roomAdminID)}
                          disabled={deletingRoomAdminId === ra.roomAdminID}
                          className="rounded-none"
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
                  <TableCell colSpan={5} className="text-center">
                    No room admins found.
                  </TableCell>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Email"
                  name="email"
                  value={editingRoomAdmin.user.email}
                  onChange={handleInputChange}
                  section="user"
                />
                <InputField
                  label="First Name"
                  name="first_name"
                  value={editingRoomAdmin.user.first_name}
                  onChange={handleInputChange}
                  section="user"
                />
                <InputField
                  label="Last Name"
                  name="last_name"
                  value={editingRoomAdmin.user.last_name}
                  onChange={handleInputChange}
                  section="user"
                />

                {/* Read-only fields */}
                <div>
                  <Label>Designation (Read-only)</Label>
                  <Input
                    value={editingRoomAdmin.designation}
                    disabled
                    className="rounded-none"
                  />
                </div>

                <div>
                  <Label>Assigned Room (Read-only)</Label>
                  <Input
                    value={getRoomName(editingRoomAdmin.roomID)}
                    disabled
                    className="rounded-none"
                  />
                </div>
              </div>

              {updateError && (
                <Alert variant="destructive" className="rounded-none">
                  <AlertTitle>Update Error</AlertTitle>
                  <AlertDescription>{updateError}</AlertDescription>
                </Alert>
              )}

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
                  onClick={handleDialogClose}
                  disabled={updateLoading}
                  className="rounded-none"
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
    section: "user" | "roomAdmin"
  ) => void;
  section: "user" | "roomAdmin";
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        name={name}
        value={value}
        onChange={(e) => onChange(e, section)}
        className="rounded-none"
      />
    </div>
  );
}