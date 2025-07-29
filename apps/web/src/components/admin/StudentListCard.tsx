"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";

interface Student {
    regNo: string;
    nic: string;
    linkedin?: string;
    contact: string;
    group: string;
    level: string;
}

interface User {
    email: string;
    first_name: string;
    last_name: string;
}

interface StudentResponse {
    student: Student;
    user: User;
}

export default function StudentListCard() {
    const [students, setStudents] = useState<StudentResponse[]>([]);

    useEffect(() => {
        axios
            .get("http://localhost:3001/api/student")
            .then((res) => setStudents(res.data))
            .catch((err) => console.error("Failed to fetch students:", err));
    }, []);

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
                    </tr>
                    </thead>
                    <tbody>
                    {students.length > 0 ? (
                        students.map((s, index) => (
                            <tr key={index}>
                                <td className="border px-2 py-1">{s.student.regNo}</td>
                                <td className="border px-2 py-1">
                                    {s.user.first_name} {s.user.last_name}
                                </td>
                                <td className="border px-2 py-1">{s.user.email}</td>
                                <td className="border px-2 py-1">{s.student.group}</td>
                                <td className="border px-2 py-1">{s.student.level}</td>
                                <td className="border px-2 py-1">{s.student.contact}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="px-2 py-2 text-center" colSpan={6}>
                                No students found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
