"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod"; 
import * as z from "zod"; 
import api from "../../lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// 1. Define the Zod Schema
const formSchema = z.object({
  user: z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    role: z.literal("room_admin"), 
  }),
  roomAdmin: z.object({
    designation: z.string().min(2, "Designation is required"),
    contact: z
      .string()
      .min(10, "Contact number must be at least 10 digits")
      .regex(/^[+]?[\d\s-]+$/, "Invalid contact number format"),
    roomID: z.string().min(1, "Please select a room"),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface Room {
  roomID: string;
  roomName: string;
  location: string;
  isActive: boolean;
}

export default function CreateRoomadmin() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 2. Initialize React Hook Form
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: {
        email: "",
        first_name: "",
        last_name: "",
        role: "room_admin",
      },
      roomAdmin: {
        designation: "",
        contact: "",
        roomID: "",
      },
    },
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setRoomsLoading(true);
      setRoomsError(null);
      const response = await api.get("/room");
      setRooms(response.data.filter((room: Room) => room.isActive));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch rooms.";
      setRoomsError(errorMessage);
      setRooms([]);
    } finally {
      setRoomsLoading(false);
    }
  };

  // 3. Handle Form Submission
  const onSubmit = async (data: FormValues) => {
    setGlobalError(null);
    setSuccess(false);

    try {
      await api.post("/room-admin", data);
      setSuccess(true);
      reset();
    } catch (error: any) {
      console.error("Error creating room admin:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create room admin.";
      setGlobalError(errorMessage);
    }
  };

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Create Room Admin</CardTitle>
        <CardDescription>
          Register new user and room admin details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Pass handleSubmit from hook form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Email Field */}
            <div>
              <Label>Email</Label>
              <Input
                {...register("user.email")}
                type="email"
                className="rounded-none"
              />
              {errors.user?.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.user.email.message}
                </p>
              )}
            </div>

            {/* First Name */}
            <div>
              <Label>First Name</Label>
              <Input
                {...register("user.first_name")}
                className="rounded-none"
              />
              {errors.user?.first_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.user.first_name.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <Label>Last Name</Label>
              <Input
                {...register("user.last_name")}
                className="rounded-none"
              />
              {errors.user?.last_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.user.last_name.message}
                </p>
              )}
            </div>

            {/* Contact */}
            <div>
              <Label>Contact</Label>
              <Input
                {...register("roomAdmin.contact")}
                placeholder="e.g., +94 77 123 4567"
                className="rounded-none"
              />
              {errors.roomAdmin?.contact && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.roomAdmin.contact.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Designation */}
            <div>
              <Label>Designation</Label>
              <Input
                {...register("roomAdmin.designation")}
                placeholder="e.g., Room Manager"
                className="rounded-none"
              />
              {errors.roomAdmin?.designation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.roomAdmin.designation.message}
                </p>
              )}
            </div>

            {/* Room Select - Using Controller */}
            <div className="sm:col-span-2">
              <Label>Assigned Room</Label>
              {roomsError ? (
                <div className="space-y-2">
                  <Alert variant="destructive" className="rounded-none">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{roomsError}</AlertDescription>
                  </Alert>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fetchRooms}
                    disabled={roomsLoading}
                    className="rounded-none"
                  >
                    {roomsLoading ? "Retrying..." : "Retry"}
                  </Button>
                </div>
              ) : (
                <Controller
                  control={control}
                  name="roomAdmin.roomID"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={roomsLoading || rooms.length === 0}
                    >
                      <SelectTrigger className="rounded-none">
                        <SelectValue
                          placeholder={
                            roomsLoading
                              ? "Loading rooms..."
                              : rooms.length === 0
                              ? "No active rooms available"
                              : "Select room"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        {rooms.map((room) => (
                          <SelectItem key={room.roomID} value={room.roomID}>
                            {room.roomName} - {room.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
              {errors.roomAdmin?.roomID && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.roomAdmin.roomID.message}
                </p>
              )}
            </div>
          </div>

          {/* Global Form Errors */}
          {globalError && (
            <Alert variant="destructive" className="rounded-none">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{globalError}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="default" className="rounded-none">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Room Admin created successfully!
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full mt-4 rounded-none"
            disabled={
              isSubmitting ||
              roomsLoading ||
              (rooms.length === 0 && !roomsError)
            }
          >
            {isSubmitting ? "Creating..." : "Create Room Admin"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}