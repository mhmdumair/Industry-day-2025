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
import { Trash2 } from "lucide-react";

interface User {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  profile_picture?: string;
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
  const [editingRoomAdmin, setEditingRoomAdmin] = useState<RoomAdmin | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingRoomAdminId, setDeletingRoomAdminId] = useState<string | null>(null);

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
      const errorMessage = e.response?.data?.message || 
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
      const errorMessage = e.response?.data?.message || 
                          e.response?.data?.error || 
                          "Failed to fetch rooms for editing.";
      setRoomsError(errorMessage);
      setRooms([]);
    }
  };

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
          profile_picture: editingRoomAdmin.user.profile_picture,
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
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to update room admin. Please try again.";
      setUpdateError(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (roomAdminID: string) => {
    // Simple confirmation using native confirm dialog
    if (!confirm("Are you sure you want to permanently delete this room admin?")) return;

    try {
      setDeletingRoomAdminId(roomAdminID);
      setDeleteError(null);
      
      console.log("Permanently deleting room admin:", roomAdminID);
      
      // Complete deletion from database
      await api.delete(`/room-admin/${roomAdminID}`);
      
      // Remove from local state
      setRoomAdmins((prev) => prev.filter((ra) => ra.roomAdminID !== roomAdminID));
      
      console.log("Room admin permanently deleted successfully");
      
    } catch (error: any) {
      console.error("Delete failed:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to permanently delete room admin. Please try again.";
      setDeleteError(errorMessage);
    } finally {
      setDeletingRoomAdminId(null);
    }
  };

  const handleRetryFetch = () => {
    setLoading(true);
    fetchRoomAdmins();
  };

  const getRoomName = (roomID: string) => {
    const room = rooms.find(r => r.roomID === roomID);
    return room ? `${room.roomName} - ${room.location}` : roomID;
  };

  const getFullName = (user: User) => {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A';
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Room Admin List</CardTitle>
            <CardDescription>Manage room administrators in the system</CardDescription>
          </div>
          {error && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetryFetch}
              disabled={loading}
            >
              {loading ? "Loading..." : "Retry"}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {/* Delete Error Message */}
        {deleteError && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm mb-4">
            {deleteError}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setDeleteError(null)}
              className="ml-2 h-auto p-1 text-red-700 hover:text-red-800"
            >
              ×
            </Button>
          </div>
        )}

        {loading ? (
          <div className="p-4 text-center">Loading room admins...</div>
        ) : error ? (
          <div className="p-4 text-center">
            <div className="text-red-600 mb-2">{error}</div>
            <Button variant="outline" size="sm" onClick={handleRetryFetch}>
              Try Again
            </Button>
          </div>
        ) : (
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {["Name", "Email", "Designation", "Room", "Actions"].map((h) => (
                  <th key={h} className="border px-2 py-1">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roomAdmins.length ? (
                roomAdmins.map((ra, i) => (
                  <tr key={i}>
                    <Td>{getFullName(ra.user)}</Td>
                    <Td>{ra.user.email}</Td>
                    <Td>{ra.designation}</Td>
                    <Td>{getRoomName(ra.roomID)}</Td>
                    <Td>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEditClick(ra)}
                          disabled={deletingRoomAdminId === ra.roomAdminID}
                        >
                          Edit
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(ra.roomAdminID)}
                          disabled={deletingRoomAdminId === ra.roomAdminID}
                        >
                          {deletingRoomAdminId === ra.roomAdminID ? (
                            "Deleting..."
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={5}>No room admins found.</Td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
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
                <InputField 
                  label="Profile Picture URL" 
                  name="profile_picture" 
                  value={editingRoomAdmin.user.profile_picture || ""} 
                  onChange={handleInputChange} 
                  section="user" 
                />
                
                {/* Read-only fields */}
                <div>
                  <Label>Designation (Read-only)</Label>
                  <Input 
                    value={editingRoomAdmin.designation} 
                    disabled 
                    className="bg-gray-100"
                  />
                </div>
                
                <div>
                  <Label>Assigned Room (Read-only)</Label>
                  <Input 
                    value={getRoomName(editingRoomAdmin.roomID)} 
                    disabled 
                    className="bg-gray-100"
                  />
                </div>
              </div>

              {updateError && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {updateError}
                </div>
              )}

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

const Td = ({ children, ...rest }: any) => (
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
    section: "user" | "roomAdmin"
  ) => void;
  section: "user" | "roomAdmin";
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input name={name} value={value} onChange={(e) => onChange(e, section)} />
    </div>
  );
}
