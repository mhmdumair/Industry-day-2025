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
} from "@/components/ui/select";

const studentGroups = [
    "ZL", "BT", "CH", "MT", "BMS", "ST", "GL", "CS", "DS",
    "ML", "BL", "MB", "CM", "AS", "ES", "SOR",
];

const studentLevels = [
    "level_1", "level_2", "level_3", "level_4",
];

interface Student {
    studentID: string;
    regNo: string;
    nic: string | null;
    contact: string;
    linkedin?: string | null;
    group: string;
    level: string;
}

interface User {
    userID: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_picture?: string | null;
}

interface StudentResponse {
    student: Student;
    user: User;
}

export default function StudentListCard() {
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingStudent, setEditingStudent] = useState<StudentResponse | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/student");
            
            const formatted: StudentResponse[] = Array.isArray(data)
                ? data.filter((s: any) => s && s.user && s.studentID)
                    .map((s: any) => ({
                        student: {
                            studentID: s.studentID,
                            regNo: s.regNo || '',
                            nic: s.nic,
                            contact: s.contact || '',
                            linkedin: s.linkedin,
                            group: s.group || '',
                            level: s.level || '',
                        },
                        user: {
                            userID: s.user.userID,
                            email: s.user.email || '',
                            first_name: s.user.first_name || '',
                            last_name: s.user.last_name || '',
                            profile_picture: s.user.profile_picture,
                        },
                    }))
                : [];
            
            setStudents(formatted);
            setError(null);
        } catch (e) {
            setError("Failed to fetch students");
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (student: StudentResponse) => {
        setEditingStudent({ ...student });
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setEditingStudent(null);
        setIsDialogOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: "user" | "student") => {
        if (!editingStudent) return;
        
        const { name, value } = e.target;
        setEditingStudent(prev => ({
            ...prev!,
            [section]: {
                ...prev![section],
                [name]: value,
            },
        }));
    };

    const handleSelectChange = (name: "group" | "level", value: string) => {
        if (!editingStudent) return;
        
        setEditingStudent(prev => ({
            ...prev!,
            student: {
                ...prev!.student,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStudent) return;

        try {
            setUpdateLoading(true);

            const payload = {
                regNo: editingStudent.student.regNo,
                nic: editingStudent.student.nic,
                linkedin: editingStudent.student.linkedin,
                contact: editingStudent.student.contact,
                group: editingStudent.student.group,
                level: editingStudent.student.level,
                user: {
                    email: editingStudent.user.email,
                    first_name: editingStudent.user.first_name,
                    last_name: editingStudent.user.last_name,
                    profile_picture: editingStudent.user.profile_picture,
                }
            };

            await api.patch(`/student/${editingStudent.student.studentID}`, payload);
            
            // Update the local state
            setStudents(prev => prev.map(s => 
                s.student.studentID === editingStudent.student.studentID 
                    ? editingStudent 
                    : s
            ));
            
            handleDialogClose();
            
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update student");
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) return <div className="p-4 text-center">Loading students...</div>;
    if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

    return (
        <Card className="bg-white shadow-md">
            <CardHeader>
                <CardTitle>Student List</CardTitle>
                <CardDescription>Fetched from database</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Reg No</th>
                            <th className="border px-2 py-1">Name</th>
                            <th className="border px-2 py-1">Email</th>
                            <th className="border px-2 py-1">Group</th>
                            <th className="border px-2 py-1">Level</th>
                            <th className="border px-2 py-1">Contact</th>
                            <th className="border px-2 py-1">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length ? (
                            students.map((s, i) => (
                                <tr key={s.student.studentID || i}>
                                    <td className="border px-2 py-1">{s.student.regNo}</td>
                                    <td className="border px-2 py-1">
                                        {s.user.first_name} {s.user.last_name}
                                    </td>
                                    <td className="border px-2 py-1">{s.user.email}</td>
                                    <td className="border px-2 py-1">{s.student.group}</td>
                                    <td className="border px-2 py-1">{s.student.level}</td>
                                    <td className="border px-2 py-1">{s.student.contact}</td>
                                    <td className="border px-2 py-1 text-center">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleEditClick(s)}
                                        >
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="px-2 py-2 text-center" colSpan={7}>
                                    No students found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Student</DialogTitle>
                    </DialogHeader>
                    
                    {editingStudent && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Registration Number</Label>
                                    <Input 
                                        name="regNo" 
                                        value={editingStudent.student.regNo} 
                                        onChange={(e) => handleInputChange(e, "student")} 
                                        disabled={updateLoading}
                                    />
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input 
                                        name="email" 
                                        value={editingStudent.user.email} 
                                        onChange={(e) => handleInputChange(e, "user")} 
                                        disabled={updateLoading}
                                    />
                                </div>
                                <div>
                                    <Label>First Name</Label>
                                    <Input 
                                        name="first_name" 
                                        value={editingStudent.user.first_name} 
                                        onChange={(e) => handleInputChange(e, "user")} 
                                        disabled={updateLoading}
                                    />
                                </div>
                                <div>
                                    <Label>Last Name</Label>
                                    <Input 
                                        name="last_name" 
                                        value={editingStudent.user.last_name} 
                                        onChange={(e) => handleInputChange(e, "user")} 
                                        disabled={updateLoading}
                                    />
                                </div>
                                <div>
                                    <Label>NIC</Label>
                                    <Input 
                                        name="nic" 
                                        value={editingStudent.student.nic || ""} 
                                        onChange={(e) => handleInputChange(e, "student")} 
                                        disabled={updateLoading}
                                    />
                                </div>
                                <div>
                                    <Label>Contact</Label>
                                    <Input 
                                        name="contact" 
                                        value={editingStudent.student.contact} 
                                        onChange={(e) => handleInputChange(e, "student")} 
                                        disabled={updateLoading}
                                    />
                                </div>
                                <div>
                                    <Label>LinkedIn</Label>
                                    <Input 
                                        name="linkedin" 
                                        value={editingStudent.student.linkedin || ""} 
                                        onChange={(e) => handleInputChange(e, "student")} 
                                        disabled={updateLoading}
                                    />
                                </div>
                                <div>
                                    <Label>Profile Picture URL</Label>
                                    <Input 
                                        name="profile_picture" 
                                        value={editingStudent.user.profile_picture || ""} 
                                        onChange={(e) => handleInputChange(e, "user")} 
                                        disabled={updateLoading}
                                    />
                                </div>
                                <div>
                                    <Label>Group</Label>
                                    <Select
                                        value={editingStudent.student.group}
                                        onValueChange={(val) => handleSelectChange("group", val)}
                                        disabled={updateLoading}
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
                                        value={editingStudent.student.level}
                                        onValueChange={(val) => handleSelectChange("level", val)}
                                        disabled={updateLoading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {studentLevels.map((level) => (
                                                <SelectItem key={level} value={level}>
                                                    {level.replace('_', ' ').toUpperCase()}
                                                </SelectItem>
                                            ))}
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