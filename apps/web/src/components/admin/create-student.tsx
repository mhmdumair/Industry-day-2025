"use client";

import React, { useState } from "react";
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
import { AxiosError } from "axios";

const studentLevels = [
    "level_1", "level_2", "level_3", "level_4",
];

export default function CreateStudent() {
    const [formData, setFormData] = useState({
        user: {
            email: "",
            first_name: "",
            last_name: "",
            role: "student",
        },
        student: {
            regNo: "",
            nic: "",
            linkedin: "",
            contact: "",
            group: "", 
            level: "level_3",
        },
    });
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        section: "user" | "student"
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value,
            },
        }));
    };

    const handleSelectChange = (
        section: "student",
        name: "level",
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setApiError(null);

        try {
            // Check for required fields
            if (!formData.user.email || !formData.user.first_name || !formData.user.last_name ||
                !formData.student.regNo || !formData.student.nic || !formData.student.contact || !formData.student.group) {
                setApiError("All required fields must be filled.");
                return;
            }

            await api.post("/student", formData);
            alert("Student created successfully!");
            setFormData({
                user: {
                    email: "",
                    first_name: "",
                    last_name: "",
                    role: "student",
                },
                student: {
                    regNo: "",
                    nic: "",
                    linkedin: "",
                    contact: "",
                    group: "",
                    level: "level_3",
                },
            });
        } catch (error) {
            const err = error as AxiosError;
            console.error("Error creating student:", err);
            
            // Fixed the TypeScript error by using optional chaining and providing a fallback message
            if (err.response?.status === 400) {
                const errorMessage = (err.response.data as { message?: string })?.message || "Invalid data submitted.";
                setApiError(errorMessage);
            } else {
                setApiError("Failed to create student. Please check your data and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-white shadow-md mt-3 mb-3 max-w-[75%] mx-auto">
            <CardHeader>
                <CardTitle>Create Student</CardTitle>
                <CardDescription>Register new user and student details</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {apiError && (
                        <div className="text-red-500 text-center p-2 border border-red-500 rounded-md">
                            {apiError}
                        </div>
                    )}
                    {/* User Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.user.email}
                                onChange={(e) => handleInputChange(e, "user")}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                name="first_name"
                                value={formData.user.first_name}
                                onChange={(e) => handleInputChange(e, "user")}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                value={formData.user.last_name}
                                onChange={(e) => handleInputChange(e, "user")}
                                required
                            />
                        </div>
                    </div>

                    {/* Student Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                            <Label htmlFor="regNo">Registration Number</Label>
                            <Input
                                id="regNo"
                                name="regNo"
                                value={formData.student.regNo}
                                onChange={(e) => handleInputChange(e, "student")}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="nic">NIC</Label>
                            <Input
                                id="nic"
                                name="nic"
                                value={formData.student.nic}
                                onChange={(e) => handleInputChange(e, "student")}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="linkedin">LinkedIn (optional)</Label>
                            <Input
                                id="linkedin"
                                name="linkedin"
                                value={formData.student.linkedin}
                                onChange={(e) => handleInputChange(e, "student")}
                            />
                        </div>
                        <div>
                            <Label htmlFor="contact">Contact</Label>
                            <Input
                                id="contact"
                                name="contact"
                                value={formData.student.contact}
                                onChange={(e) => handleInputChange(e, "student")}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="group">Group</Label>
                            <Input
                                id="group"
                                name="group"
                                value={formData.student.group}
                                onChange={(e) => handleInputChange(e, "student")}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="level">Level</Label>
                            <Select
                                value={formData.student.level}
                                onValueChange={(val) =>
                                    handleSelectChange("student", "level", val)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {studentLevels.map((level) => (
                                        <SelectItem key={level} value={level}>
                                            {level.toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button type="submit" className="w-full mt-4" disabled={loading}>
                        {loading ? "Creating..." : "Create Student"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
