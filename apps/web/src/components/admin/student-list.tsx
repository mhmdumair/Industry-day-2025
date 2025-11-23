"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";

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

enum Preference {
    BT = "BT",
    ZL = "ZL",
    CH = "CH",
    MT = "MT",
    BMS = "BMS",
    ST = "ST",
    GL = "GL",
    CS = "CS",
    DS = "DS",
    ML = "ML",
    CM = "CM",
    ES = "ES",
    MB = "MB",
    PH = "PH",
    ALL = "ALL"
}

export default function StudentReport() {
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingStudent, setEditingStudent] = useState<StudentResponse | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    // --- State for search and filter ---
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedGroup, setSelectedGroup] = useState<Preference | "ALL">(Preference.ALL);

    // --- Pagination state ---
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 20;

    // --- Data Fetching ---
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
            console.error("Error fetching students:", e);
            setError("Failed to fetch students");
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    // --- Filtering and Searching ---
    const filteredStudents = useMemo(() => {
        let filtered = students;

        if (selectedGroup !== Preference.ALL) {
            filtered = filtered.filter(s => s.student.group.includes(selectedGroup));
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                s.student.regNo.toLowerCase().includes(query) ||
                s.user.first_name.toLowerCase().includes(query) ||
                s.user.last_name.toLowerCase().includes(query) ||
                s.user.email.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [students, searchQuery, selectedGroup]);

    // --- Pagination Logic ---
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // --- Dialog Handlers ---
    const handleEditClick = (student: StudentResponse) => {
        try {
            setEditingStudent({ ...student });
            setIsDialogOpen(true);
        } catch (e) {
            console.error("Error opening dialog:", e);
        }
    };

    const handleDialogClose = () => {
        try {
            setEditingStudent(null);
            setIsDialogOpen(false);
        } catch (e) {
            console.error("Error closing dialog:", e);
        }
    };

    // --- Input Change Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: "user" | "student") => {
        try {
            if (!editingStudent) return;

            const { name, value } = e.target;
            setEditingStudent(prev => ({
                ...prev!,
                [section]: {
                    ...prev![section],
                    [name]: value,
                },
            }));
        } catch (e) {
            console.error("Error updating input:", e);
        }
    };

    const handleSelectChange = (name: "level", value: string) => {
        try {
            if (!editingStudent) return;

            setEditingStudent(prev => ({
                ...prev!,
                student: {
                    ...prev!.student,
                    [name]: value,
                },
            }));
        } catch (e) {
            console.error("Error updating select:", e);
        }
    };

    // --- Form Submission ---
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

    // --- CSV Export Logic ---
    const exportStudentInfo = () => {
        setExporting(true);
        try {
            const headers = [
                "Registration Number", // studentID removed
                "NIC",
                "First Name",
                "Last Name",
                "Email",
                "Contact Number",
                "Group",
                "Level",
                "LinkedIn",
            ];

            const rows = students.map(s => [
                s.student.regNo, // studentID removed
                s.student.nic || "N/A",
                s.user.first_name,
                s.user.last_name,
                s.user.email,
                s.student.contact,
                s.student.group,
                s.student.level,
                s.student.linkedin || "N/A",
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
            const filename = `student-report-${timestamp}.csv`;

            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export student report.");
        } finally {
            setExporting(false);
        }
    };

    // --- Render Component ---
    return (
        <Card className="bg-white dark:bg-black shadow-md w-full rounded-none">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl leading-4 dark:text-white">Student List</CardTitle>
                    <CardDescription className="dark:text-gray-400">Fetched from database</CardDescription>
                </div>
                <Button
                    onClick={exportStudentInfo}
                    disabled={exporting || students.length === 0}
                    className="rounded-none dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                    {exporting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <Download className="h-4 w-4 mr-2" />
                    )}
                    Download Student Report
                </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                {/* Search and Filter Section */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <Label className="mb-1 dark:text-gray-300" htmlFor="search">Search</Label>
                        <Input
                            id="search"
                            type="text"
                            placeholder="Search by name, registration number, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="rounded-none dark:bg-black dark:text-white dark:border-gray-700 dark:placeholder:text-gray-500"
                        />
                    </div>
                    <div className="w-full sm:w-1/3">
                        <Label className="mb-1 dark:text-gray-300" htmlFor="group-filter">Group</Label>
                        <Select onValueChange={(value: Preference | "ALL") => setSelectedGroup(value as Preference | "ALL")} value={selectedGroup}>
                            <SelectTrigger id="group-filter" className="rounded-none dark:bg-black dark:text-white dark:border-gray-700">
                                <SelectValue placeholder="Select a group" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none dark:bg-black dark:text-white dark:border-gray-700">
                                <SelectItem value={Preference.ALL}>All Groups</SelectItem>
                                {Object.values(Preference).filter(p => p !== Preference.ALL).map((group) => (
                                    <SelectItem key={group} value={group}>
                                        {group}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {loading ? (
                    <div className="p-4 text-center dark:text-gray-300">Loading students...</div>
                ) : error ? (
                    <div className="p-4 text-center text-red-600 dark:text-red-400">{error}</div>
                ) : (
                    <>
                        <table className="w-full text-sm border-collapse border border-gray-300 dark:border-gray-700">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-black">
                                    <th className="border px-2 py-1 dark:border-gray-700 dark:text-gray-300">Reg No</th>
                                    <th className="border px-2 py-1 dark:border-gray-700 dark:text-gray-300">Name</th>
                                    <th className="border px-2 py-1 dark:border-gray-700 dark:text-gray-300">Email</th>
                                    <th className="border px-2 py-1 dark:border-gray-700 dark:text-gray-300">Group</th>
                                    <th className="border px-2 py-1 dark:border-gray-700 dark:text-gray-300">Level</th>
                                    <th className="border px-2 py-1 dark:border-gray-700 dark:text-gray-300">Contact</th>
                                    <th className="border px-2 py-1 dark:border-gray-700 dark:text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentStudents.length ? (
                                    currentStudents.map((s, i) => (
                                        <tr key={s.student.studentID || i} className="dark:hover:bg-gray-900">
                                            <td className="border px-2 py-1 dark:border-gray-700 dark:text-gray-300">{s.student.regNo}</td>
                                            <td className="border px-2 py-1 dark:border-gray-700 dark:text-gray-300">
                                                {s.user.first_name} {s.user.last_name}
                                            </td>
                                            <td className="border px-2 py-1 dark:border-gray-700 dark:text-gray-300">{s.user.email}</td>
                                            <td className="border px-2 py-1 dark:border-gray-700 dark:text-gray-300">{s.student.group}</td>
                                            <td className="border px-2 py-1 dark:border-gray-700 dark:text-gray-300">{s.student.level}</td>
                                            <td className="border px-2 py-1 dark:border-gray-700 dark:text-gray-300">{s.student.contact}</td>
                                            <td className="border px-2 py-1 text-center dark:border-gray-700">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditClick(s)}
                                                    className="rounded-none dark:text-gray-300 dark:hover:bg-gray-800"
                                                >
                                                    Edit
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="px-2 py-2 text-center dark:text-gray-300" colSpan={7}>
                                            No students found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {/* Pagination Controls */}
                        {filteredStudents.length > studentsPerPage && (
                            <div className="flex justify-between items-center mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="rounded-none dark:bg-black dark:text-white dark:border-gray-700 dark:hover:bg-gray-800"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Previous
                                </Button>
                                <span className="text-sm dark:text-gray-300">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="rounded-none dark:bg-black dark:text-white dark:border-gray-700 dark:hover:bg-gray-800"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl rounded-none dark:bg-black dark:text-white dark:border-gray-700">
                    <DialogHeader>
                        <DialogTitle className="dark:text-white">Edit Student</DialogTitle>
                    </DialogHeader>

                    {editingStudent && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="Registration Number" name="regNo" value={editingStudent.student.regNo} onChange={handleInputChange} section="student" />
                                <InputField label="Email" name="email" value={editingStudent.user.email} onChange={handleInputChange} section="user" />
                                <InputField label="First Name" name="first_name" value={editingStudent.user.first_name} onChange={handleInputChange} section="user" />
                                <InputField label="Last Name" name="last_name" value={editingStudent.user.last_name} onChange={handleInputChange} section="user" />
                                <InputField label="NIC" name="nic" value={editingStudent.student.nic || ""} onChange={handleInputChange} section="student" />
                                <InputField label="Contact" name="contact" value={editingStudent.student.contact} onChange={handleInputChange} section="student" />
                                <InputField label="LinkedIn" name="linkedin" value={editingStudent.student.linkedin || ""} onChange={handleInputChange} section="student" />
                                <InputField label="Profile Picture URL" name="profile_picture" value={editingStudent.user.profile_picture || ""} onChange={handleInputChange} section="user" />

                                <InputField label="Group" name="group" value={editingStudent.student.group} onChange={handleInputChange} section="student" />

                                <SelectField label="Level" value={editingStudent.student.level} options={studentLevels.map(l => ({ label: l.replace("_", " ").toUpperCase(), value: l }))} onChange={(val) => handleSelectChange("level", val)} />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1 rounded-none dark:bg-white dark:text-black dark:hover:bg-gray-200" disabled={updateLoading}>
                                    {updateLoading ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button type="button" variant="outline" onClick={handleDialogClose} disabled={updateLoading} className="rounded-none dark:bg-black dark:text-white dark:border-gray-700 dark:hover:bg-gray-800">
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

function InputField({ label, name, value, onChange, section }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>, section: "user" | "student") => void, section: "user" | "student" }) {
    return (
        <div>
            <Label className="dark:text-gray-300">{label}</Label>
            <Input name={name} value={value} onChange={(e) => onChange(e, section)} className="rounded-none dark:bg-black dark:text-white dark:border-gray-700" />
        </div>
    );
}

function SelectField({ label, value, options, onChange }: { label: string, value: string, options: (string | { label: string, value: string })[], onChange: (val: string) => void }) {
    return (
        <div>
            <Label className="dark:text-gray-300">{label}</Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="rounded-none dark:bg-black dark:text-white dark:border-gray-700">
                    <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent className="rounded-none dark:bg-black dark:text-white dark:border-gray-700">
                    {options.map((opt) => {
                        const val = typeof opt === "string" ? opt : opt.value;
                        const label = typeof opt === "string" ? opt : opt.label;
                        return <SelectItem key={val} value={val}>{label}</SelectItem>;
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}