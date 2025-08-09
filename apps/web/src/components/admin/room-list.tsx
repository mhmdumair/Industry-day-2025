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

interface Room {
  roomID: string;
  roomName: string;
  location: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function RoomsListCard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Room[]>("/room");
        setRooms(data);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch rooms.");
        setRooms([]);
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
      console.error("Update failed:", error);
      alert("Failed to update room");
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
      console.error("Delete failed:", error);
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle>Room List</CardTitle>
        <CardDescription>Fetched from database</CardDescription>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="p-4 text-center">Loading rooms...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">{error}</div>
        ) : (
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {["Room Name", "Location", "Status", "Actions"].map((h) => (
                  <th key={h} className="border px-2 py-1">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.length ? (
                rooms.map((r, i) => (
                  <tr key={i}>
                    <Td>{r.roomName}</Td>
                    <Td>{r.location}</Td>
                    <Td>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          r.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {r.isActive ? "Active" : "Inactive"}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditClick(r)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(r.roomID)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan={4}>No rooms found.</Td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={updateLoading}
                >
                  {updateLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
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
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input name={name} value={value} onChange={onChange} />
    </div>
  );
}
