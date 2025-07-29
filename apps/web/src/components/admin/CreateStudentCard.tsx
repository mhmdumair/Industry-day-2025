"use client";

import React, { useState } from "react";
import axios from "axios";
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

// Enum values
const studentGroups = [
    "ZL", "BT", "CH", "MT", "BMS", "ST", "GL", "CS", "DS",
    "ML", "BL", "MB", "CM", "AS", "ES", "SOR",
];

const studentLevels = [
    "level_1", "level_2", "level_3", "level_4",
];

export default function CreateStudentCard() {
    const [formData, setFormData] = useState({
        user: {
            email: "",
            password: "",
            first_name: "",
            last_name: "",
        },
        student: {
            regNo: "",
            nic: "",
            linkedin: "",
            contact: "",
            group: "CS",
            level: "level_3",
        },
    });

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
        name: "group" | "level",
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
        try {
            await axios.post("http://localhost:3001/api/student", formData);
            alert("Student created successfully!");
            // Optional: Reset form
            setFormData({
                user: {
                    email: "",
                    password: "",
                    first_name: "",
                    last_name: "",
                },
                student: {
                    regNo: "",
                    nic: "",
                    linkedin: "",
                    contact: "",
                    group: "CS",
                    level: "level_3",
                },
            });
        } catch (error) {
            console.error("Error creating student:", error);
            alert("Failed to create student.");
        }
    };

    return (
        <Card className="bg-white shadow-md">
            <CardHeader>
                <CardTitle>Create Student</CardTitle>
                <CardDescription>Register new user and student details</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* User Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Email</Label>
                            <Input
                                name="email"
                                value={formData.user.email}
                                onChange={(e) => handleInputChange(e, "user")}
                                required
                            />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input
                                name="password"
                                type="password"
                                value={formData.user.password}
                                onChange={(e) => handleInputChange(e, "user")}
                                required
                            />
                        </div>
                        <div>
                            <Label>First Name</Label>
                            <Input
                                name="first_name"
                                value={formData.user.first_name}
                                onChange={(e) => handleInputChange(e, "user")}
                                required
                            />
                        </div>
                        <div>
                            <Label>Last Name</Label>
                            <Input
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
                            <Label>Registration Number</Label>
                            <Input
                                name="regNo"
                                value={formData.student.regNo}
                                onChange={(e) => handleInputChange(e, "student")}
                                required
                            />
                        </div>
                        <div>
                            <Label>NIC</Label>
                            <Input
                                name="nic"
                                value={formData.student.nic}
                                onChange={(e) => handleInputChange(e, "student")}
                                required
                            />
                        </div>
                        <div>
                            <Label>LinkedIn (optional)</Label>
                            <Input
                                name="linkedin"
                                value={formData.student.linkedin}
                                onChange={(e) => handleInputChange(e, "student")}
                            />
                        </div>
                        <div>
                            <Label>Contact</Label>
                            <Input
                                name="contact"
                                value={formData.student.contact}
                                onChange={(e) => handleInputChange(e, "student")}
                                required
                            />
                        </div>
                        <div>
                            <Label>Group</Label>
                            <Select
                                value={formData.student.group}
                                onValueChange={(val) =>
                                    handleSelectChange("student", "group", val)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {studentGroups.map((group) => (
                                        <SelectItem key={group} value={group}>
                                            {group}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Level</Label>
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

                    <Button type="submit" className="w-full mt-4">
                        Create Student
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
