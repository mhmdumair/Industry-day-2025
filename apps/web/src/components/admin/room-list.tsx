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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface Room {
  roomID: string;
  roomName: string;
  location: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function RoomsListCard() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleAuthError = () => {
    alert("Session expired. Please login again.");
    router.push("/auth/login");
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Room[]>("/room");
        setRooms(data);
        setError(null);
      } catch (e) {
        const axiosError = e as AxiosError;
        if (axiosError.response?.status === 401) {
          handleAuthError();
        } else {
          console.error(e);
          setError("Failed to fetch rooms.");
          setRooms([]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleEditClick = (room: Room) => {
    try {
      setEditingRoom({ ...room });
      setIsDialogOpen(true);
    } catch (e) {
      console.error("Error opening dialog:", e);
    }
  };

  const handleDialogClose = () => {
    try {
      setEditingRoom(null);
      setIsDialogOpen(false);
    } catch (e) {
      console.error("Error closing dialog:", e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!editingRoom) return;
      const { name, value } = e.target;
      setEditingRoom((prev) => ({
        ...prev!,
        [name]: value,
      }));
    } catch (e) {
      console.error("Error updating input:", e);
    }
  };

  const handleSelectChange = (value: string) => {
    try {
      if (!editingRoom) return;
      setEditingRoom((prev) => ({
        ...prev!,
        isActive: value === "true",
      }));
    } catch (e) {
      console.error("Error updating select:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    try {
      setUpdateLoading(true);

      const payload = {
        roomName: editingRoom.roomName,
        location: editingRoom.location,
        isActive: editingRoom.isActive,
      };

      await api.patch(`/room/${editingRoom.roomID}`, payload);

      setRooms((prev) =>
        prev.map((r) =>
          r.roomID === editingRoom.roomID ? editingRoom : r
        )
      );

      handleDialogClose();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        handleAuthError();
      } else {
        console.error("Update failed:", error);
        alert("Failed to update room");
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (roomID: string) => {
    try {
      await api.delete(`/room/${roomID}`);
      console.log(roomID);
      
      setRooms((prev) => prev.filter((r) => r.roomID !== roomID));
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        handleAuthError();
      } else {
        console.error("Delete failed:", error);
      }
    }
  };

  const exportRoomInfo = () => {
    setExporting(true);
    try {
      const headers = [
        "Room Name",
        "Location",
        "Status",
        "Created At",
      ];

      const rows = rooms.map(room => [
        room.roomName,
        room.location,
        room.isActive ? "Active" : "Inactive",
        room.createdAt ? new Date(room.createdAt).toLocaleString() : "N/A",
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
      const filename = `room-list-${timestamp}.csv`;

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export room list.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-transparent shadow-md rounded-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="text-xl leading-tight">Room List</CardTitle>
            <CardDescription>Fetched from database</CardDescription>
        </div>
        <Button
          onClick={exportRoomInfo}
          disabled={exporting || rooms.length === 0}
          className="rounded-none"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Download Room List
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="p-4 text-center">Loading rooms...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-600 dark:text-red-300">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.length ? (
                rooms.map((r) => (
                  <TableRow key={r.roomID}>
                    <TableCell>{r.roomName}</TableCell>
                    <TableCell>{r.location}</TableCell>
                    <TableCell className="justify-center">
                      <Badge
                        variant={r.isActive ? "default" : "secondary"}
                        className=""
                      >
                        {r.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-between">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditClick(r)}
                          className="rounded-none"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-200 rounded-none"
                          onClick={() => handleDelete(r.roomID)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No rooms found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-none dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>

          {editingRoom && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Room Name"
                  name="roomName"
                  value={editingRoom.roomName}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Location"
                  name="location"
                  value={editingRoom.location}
                  onChange={handleInputChange}
                />
                <div>
                  <Label>Status</Label>
                  <Select
                    value={editingRoom.isActive ? "true" : "false"}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger className="rounded-none dark:bg-gray-700 dark:text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none dark:bg-gray-800 dark:text-gray-100">
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
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
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input name={name} value={value} onChange={onChange} className="rounded-none dark:bg-gray-700 dark:text-gray-100" />
    </div>
  );
}