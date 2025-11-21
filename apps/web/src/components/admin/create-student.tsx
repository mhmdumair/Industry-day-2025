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
import { Upload, CheckCircle2, XCircle } from "lucide-react";

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
    const [cvFile, setCvFile] = useState<File | null>(null);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (file && file.type !== 'application/pdf') {
            setApiError('Only PDF files are allowed for CV.');
            setCvFile(null);
            return;
        }
        setApiError(null);
        setCvFile(file);
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

            const dataToSend = new FormData();
            
            // Add student data as JSON string (always required)
            const jsonPayload = JSON.stringify(formData);
            dataToSend.append('createStudentDto', jsonPayload);
            
            // Add CV file only if provided
            if (cvFile) {
                dataToSend.append('cv_file', cvFile);
            }

            // Log what we're sending for debugging
            console.log('Sending data:', {
                hasFile: !!cvFile,
                formData: formData
            });

            await api.post("/student", dataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert("Student created successfully!");

            // Reset form
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
            setCvFile(null);

            // Clear file input
            const fileInput = document.getElementById('cv_file') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (error) {
            const err = error as AxiosError;
            console.error("Error creating student:", err);
            console.error("Error response:", err.response?.data);
            console.error("Error status:", err.response?.status);

            if (err.response?.status === 400) {
                const errorMessage = (err.response.data as { message?: string })?.message || "Invalid data submitted.";
                setApiError(errorMessage);
            } else if (err.response?.status === 500) {
                const errorData = err.response.data as { message?: string };
                const errorMessage = errorData?.message || "Server error occurred. Please check server logs for details.";
                setApiError(errorMessage);
                console.error("Server error details:", errorData);
            } else {
                setApiError("Failed to create student. Please check your data and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-white dark:bg-black shadow-md mt-3 mb-3 max-w-[75%] mx-auto rounded-none">
            <CardHeader>
                <CardTitle className="text-xl leading-4 dark:text-white">Create Student</CardTitle>
                <CardDescription className="dark:text-gray-400">Register new user and student details</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {apiError && (
                        <div className="text-red-500 dark:text-red-400 text-center p-2 border border-red-500 dark:border-red-400 rounded-none">
                            {apiError}
                        </div>
                    )}

                    {/* User Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label className="mb-1 dark:text-gray-300" htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.user.email}
                                onChange={(e) => handleInputChange(e, "user")}
                                required
                                className="rounded-none dark:bg-black dark:text-white dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <Label className="mb-1 dark:text-gray-300" htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                name="first_name"
                                value={formData.user.first_name}
                                onChange={(e) => handleInputChange(e, "user")}
                                required
                                className="rounded-none dark:bg-black dark:text-white dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <Label className="mb-1 dark:text-gray-300" htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                value={formData.user.last_name}
                                onChange={(e) => handleInputChange(e, "user")}
                                required
                                className="rounded-none dark:bg-black dark:text-white dark:border-gray-700"
                            />
                        </div>
                    </div>

                    {/* Student Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                            <Label className="mb-1 dark:text-gray-300" htmlFor="regNo">Registration Number</Label>
                            <Input
                                id="regNo"
                                name="regNo"
                                value={formData.student.regNo}
                                onChange={(e) => handleInputChange(e, "student")}
                                required
                                className="rounded-none dark:bg-black dark:text-white dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <Label className="mb-1 dark:text-gray-300" htmlFor="nic">NIC</Label>
                            <Input
                                id="nic"
                                name="nic"
                                value={formData.student.nic}
                                onChange={(e) => handleInputChange(e, "student")}
                                required
                                className="rounded-none dark:bg-black dark:text-white dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <Label className="mb-1 dark:text-gray-300" htmlFor="linkedin">LinkedIn (optional)</Label>
                            <Input
                                id="linkedin"
                                name="linkedin"
                                value={formData.student.linkedin}
                                onChange={(e) => handleInputChange(e, "student")}
                                className="rounded-none dark:bg-black dark:text-white dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <Label className="mb-1 dark:text-gray-300" htmlFor="contact">Contact</Label>
                            <Input
                                id="contact"
                                name="contact"
                                value={formData.student.contact}
                                onChange={(e) => handleInputChange(e, "student")}
                                required
                                className="rounded-none dark:bg-black dark:text-white dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <Label className="mb-1 dark:text-gray-300" htmlFor="group">Group</Label>
                            <Input
                                id="group"
                                name="group"
                                value={formData.student.group}
                                onChange={(e) => handleInputChange(e, "student")}
                                required
                                className="rounded-none dark:bg-black dark:text-white dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <Label className="mb-1 dark:text-gray-300" htmlFor="level">Level</Label>
                            <Select
                                value={formData.student.level}
                                onValueChange={(val) =>
                                    handleSelectChange("student", "level", val)
                                }
                            >
                                <SelectTrigger className="rounded-none dark:bg-black dark:text-white dark:border-gray-700">
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none dark:bg-black dark:text-white dark:border-gray-700">
                                    {studentLevels.map((level) => (
                                        <SelectItem key={level} value={level}>
                                            {level.toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* CV Upload Section - Moved to bottom */}
                    <div className="space-y-3 pt-2">
                        <Label htmlFor="cv_file" className="dark:text-gray-300">
                            Upload CV (PDF Only) - Optional
                        </Label>

                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-none p-6 bg-gray-50 dark:bg-gray-900/50 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                            <div className="flex flex-col items-center justify-center space-y-3">
                                <div className="p-3 rounded-none">
                                    <Upload className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                                </div>

                                <div className="text-center">
                                    <Label htmlFor="cv_file" className="cursor-pointer">
                                        <span className="text-sm font-medium underline text-gray-700 dark:text-gray-300">
                                            Click to upload
                                        </span>
                                    </Label>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        PDF files only (Max 5MB)
                                    </p>
                                </div>

                                <Input
                                    id="cv_file"
                                    name="cv_file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {cvFile && (
                            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-none">
                                <div className="flex-shrink-0">
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                        File selected
                                    </p>
                                    <p className="text-xs text-green-700 dark:text-green-300 truncate">
                                        {cvFile.name}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setCvFile(null);
                                        setApiError(null);
                                        const fileInput = document.getElementById('cv_file') as HTMLInputElement;
                                        if (fileInput) fileInput.value = '';
                                    }}
                                    className="rounded-none text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 hover:bg-green-100 dark:hover:bg-green-900/40"
                                >
                                    <XCircle className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <Button type="submit" className="w-full mt-4 rounded-none dark:bg-white dark:text-black dark:hover:bg-gray-200" disabled={loading}>
                        {loading ? "Creating..." : "Create Student"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}