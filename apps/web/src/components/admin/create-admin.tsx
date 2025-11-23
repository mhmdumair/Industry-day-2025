"use client";

import React, { useState } from "react";
import api from "@/lib/axios"; 
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
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

interface AdminFormData {
    user: {
        email: string;
        first_name: string;
        last_name: string;
        role: "admin"; 
    };
    admin: {
        designation: string;
    };
}

export default function CreateAdmin() {
    const [formData, setFormData] = useState<AdminFormData>({
        user: {
            email: "",
            first_name: "",
            last_name: "",
            role: "admin",
        },
        admin: {
            designation: "",
        },
    });
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);

    // --- Input Handlers ---
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        section: "user" | "admin"
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value,
            },
        }));
        setApiError(null);
        setApiSuccess(null);
    };

    // --- Form Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setApiError(null);
        setApiSuccess(null);

        if (!formData.user.email || !formData.user.first_name || !formData.admin.designation) {
            setApiError("Please fill in all required fields (Email, Name, Designation).");
            setLoading(false);
            return;
        }

        try {
            await api.post("/admin", formData);

            setApiSuccess("Admin user created successfully!");
            
            // Reset form
            setFormData({
                user: { email: "", first_name: "", last_name: "", role: "admin" },
                admin: { designation: "" },
            });
            
        } catch (error) {
            const err = error as AxiosError;
            const message = (err.response?.data as { message?: string | string[] })?.message;

            if (Array.isArray(message)) {
                setApiError(message.join(', '));
            } else {
                setApiError(message || "Failed to create admin. Please check your inputs.");
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Render Component ---
    return (
        <Card className="bg-white dark:bg-black shadow-md mt-3 mb-3 max-w-[75%] mx-auto rounded-none">
            <CardHeader>
                <CardTitle className="text-xl leading-4 dark:text-white">Create New Room Admin</CardTitle>
                <CardDescription className="dark:text-gray-400">
                    Register a new user with administrative privileges.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Status Messages */}
                    {apiError && (
                        <div className="text-red-600 dark:text-red-400 text-center p-3 border border-red-600 dark:border-red-400 rounded-none bg-red-50 dark:bg-red-900/10">
                            {apiError}
                        </div>
                    )}
                    {apiSuccess && (
                        <div className="text-green-600 dark:text-green-400 text-center p-3 border border-green-600 dark:border-green-400 rounded-none bg-green-50 dark:bg-green-900/10">
                            {apiSuccess}
                        </div>
                    )}

                    {/* User Account Details */}
                    <h3 className="text-lg font-semibold border-b pb-2 dark:text-gray-200">User Account Details</h3>
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
                        <div className="sm:col-span-2">
                            <Label className="mb-1 dark:text-gray-300" htmlFor="last_name">Last Name (Optional)</Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                value={formData.user.last_name}
                                onChange={(e) => handleInputChange(e, "user")}
                                className="rounded-none dark:bg-black dark:text-white dark:border-gray-700"
                            />
                        </div>
                    </div>

                    {/* Admin Role Details */}
                    <h3 className="text-lg font-semibold border-b pb-2 pt-4 dark:text-gray-200">Admin Role Details</h3>
                    <div>
                        <Label className="mb-1 dark:text-gray-300" htmlFor="designation">Designation / Role Title</Label>
                        <Input
                            id="designation"
                            name="designation"
                            value={formData.admin.designation}
                            onChange={(e) => handleInputChange(e, "admin")}
                            required
                            placeholder="e.g., Room Admin, Event Coordinator"
                            className="rounded-none dark:bg-black dark:text-white dark:border-gray-700"
                        />
                    </div>

                    <Button type="submit" className="w-full mt-6 rounded-none dark:bg-white dark:text-black dark:hover:bg-gray-200" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Admin...
                            </>
                        ) : (
                            "Create Room Admin"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}