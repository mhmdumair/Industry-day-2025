"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Loader2, Edit, Trash2, MapPin, Box } from "lucide-react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

// --- 1. Types & Schema ---

interface Room {
  roomID: string;
  roomName: string;
  location: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Validation Schema
const formSchema = z.object({
  roomName: z.string().min(1, "Room Name is required"),
  location: z.string().min(1, "Location is required"),
  isActive: z.string().refine((val) => val === "true" || val === "false", {
    message: "Status must be either 'Active' or 'Inactive'",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// --- 2. Main Component ---

export default function RoomsListCard() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for editing
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Setup React Hook Form
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomName: "",
      location: "",
      isActive: "true",
    },
  });

  const handleAuthError = () => {
    alert("Session expired. Please login again.");
    router.push("/auth/login");
  };

  // Fetch Rooms
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

  // Reset form when editingRoom changes
  useEffect(() => {
    if (editingRoom) {
      reset({
        roomName: editingRoom.roomName,
        location: editingRoom.location,
        isActive: editingRoom.isActive ? "true" : "false",
      });
    }
  }, [editingRoom, reset]);

  // Search Logic
  const filteredRooms = useMemo(() => {
    if (!searchQuery) return rooms;
    const lowerQuery = searchQuery.toLowerCase();
    return rooms.filter(
      (r) =>
        r.roomName.toLowerCase().includes(lowerQuery) ||
        r.location.toLowerCase().includes(lowerQuery)
    );
  }, [rooms, searchQuery]);

  const handleEditClick = (room: Room) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditingRoom(null);
    setIsDialogOpen(false);
    reset();
  };

  // Submit Handler (Zod Validated)
  const onSubmit = async (values: FormValues) => {
    if (!editingRoom) return;

    try {
      const payload = {
        roomName: values.roomName,
        location: values.location,
        isActive: values.isActive === "true", // Convert string back to boolean
      };

      await api.patch(`/room/${editingRoom.roomID}`, payload);

      setRooms((prev) =>
        prev.map((r) =>
          r.roomID === editingRoom.roomID ? { ...r, ...payload } : r
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
    }
  };

  const handleDelete = async (roomID: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      await api.delete(`/room/${roomID}`);
      setRooms((prev) => prev.filter((r) => r.roomID !== roomID));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const exportRoomInfo = () => {
    setExporting(true);
    try {
      const headers = ["Room Name", "Location", "Status", "Created At"];
      const rows = rooms.map(room => [
        room.roomName,
        room.location,
        room.isActive ? "Active" : "Inactive",
        room.createdAt ? new Date(room.createdAt).toLocaleString() : "N/A",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row =>
          row.map(cell => `"${String(cell || "").replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `room-list-${new Date().toISOString().split('T')[0]}.csv`;
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
    <Card className="bg-white dark:bg-black shadow-md w-full mx-auto rounded-none border border-gray-200 dark:border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <CardTitle className="text-xl leading-4 dark:text-white">Room List</CardTitle>
          <CardDescription className="dark:text-gray-400">Manage rooms and locations</CardDescription>
        </div>
        <Button
          onClick={exportRoomInfo}
          disabled={exporting || rooms.length === 0}
          className="rounded-none bg-white text-black border border-gray-300 hover:bg-gray-100 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-sm"
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
          Export CSV
        </Button>
      </CardHeader>

      <CardContent className="pt-6">
        {/* --- Filter --- */}
        <div className="mb-6">
          <Label className="mb-1 dark:text-gray-300 text-sm" htmlFor="search">Search</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by room name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-none border-gray-300 dark:border-gray-700 focus:ring-0 focus:border-black dark:focus:border-white dark:bg-black dark:text-white text-base"
          />
        </div>

        {/* --- List View Container --- */}
        <div className="border-t border-gray-200 dark:border-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mb-2" />
              <p className="text-sm">Loading rooms...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 dark:text-red-400 border-b border-gray-200 dark:border-gray-800">
              {error}
            </div>
          ) : (
            <div className="w-full">
              {/* Header Row */}
              <div className="hidden md:flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-[10px] uppercase tracking-wider text-gray-500 font-medium">
                <div className="w-[40%] pl-12">Room Info</div>
                <div className="w-[30%]">Location</div>
                <div className="w-[20%]">Status</div>
                <div className="w-[10%] text-right">Actions</div>
              </div>

              {filteredRooms.length > 0 ? (
                filteredRooms.map((r) => (
                  <div
                    key={r.roomID}
                    className="group flex flex-col md:flex-row md:items-center justify-between p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    {/* Column 1: Room Info */}
                    <div className="md:w-[40%] flex items-center gap-3 mb-2 md:mb-0">
                      {/* Smaller Icon Avatar */}
                      <div className="h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black">
                        <Box className="h-3 w-3" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                          {r.roomName}
                        </h4>
                        
                      </div>
                    </div>

                    {/* Column 2: Location */}
                    <div className="md:w-[30%] mb-2 md:mb-0 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <MapPin className="h-3 w-3" />
                      <span className="text-sm">{r.location}</span>
                    </div>

                    {/* Column 3: Status */}
                    <div className="md:w-[20%] mb-2 md:mb-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide border ${r.isActive
                          ? "bg-black text-white border-black dark:bg-white dark:text-black"
                          : "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                        }`}>
                        {r.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>

                    {/* Column 4: Actions */}
                    <div className="md:w-[10%] flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(r)}
                        className="text-gray-400 hover:text-black hover:bg-transparent dark:hover:text-white h-8 w-8"
                        title="Edit Room"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {/* RED Delete Icon */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(r.roomID)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8"
                        title="Delete Room"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-gray-500 border-b border-gray-200 dark:border-gray-800">
                  <Box className="h-8 w-8 mx-auto mb-3 opacity-20" />
                  <p className="text-xs">No rooms found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* Edit Dialog with Zod Validation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-none dark:bg-black dark:text-white dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit Room</DialogTitle>
          </DialogHeader>

          {editingRoom && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                {/* Room Name */}
                <div>
                  <Label className="dark:text-gray-300 text-xs uppercase text-gray-500 font-semibold mb-1 block">Room Name</Label>
                  <Input
                    {...register("roomName")}
                    className="rounded-none border-gray-300 dark:border-gray-700 dark:bg-black dark:text-white"
                  />
                  {errors.roomName && <p className="text-red-500 text-xs mt-1">{errors.roomName.message}</p>}
                </div>

                {/* Location */}
                <div>
                  <Label className="dark:text-gray-300 text-xs uppercase text-gray-500 font-semibold mb-1 block">Location</Label>
                  <Input
                    {...register("location")}
                    className="rounded-none border-gray-300 dark:border-gray-700 dark:bg-black dark:text-white"
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                </div>

                {/* Status */}
                <div>
                  <Label className="dark:text-gray-300 text-xs uppercase text-gray-500 font-semibold mb-1 block">Status</Label>
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="rounded-none border-gray-300 dark:border-gray-700 dark:bg-black dark:text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none dark:bg-black dark:text-white dark:border-gray-700">
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.isActive && <p className="text-red-500 text-xs mt-1">{errors.isActive.message}</p>}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 mt-2">
                <Button
                  type="submit"
                  className="flex-1 rounded-none bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  disabled={isSubmitting}
                  className="rounded-none border-gray-300 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
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