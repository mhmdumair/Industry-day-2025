"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios"; // assuming this is an axios instance
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

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
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStudents() {
            try {
                setLoading(true);
                const response = await api.get<StudentResponse[]>("/student");
                
                // Ensure response.data is an array and filter out invalid entries
                const studentsData = Array.isArray(response.data) ? response.data : [];
                const validStudents = studentsData.filter(
                    (item) => item && item.student && item.user
                );
                
                setStudents(validStudents);
                setError(null);
            } catch (err) {
                console.error("Error fetching students:", err);
                setError("Failed to fetch students.");
                setStudents([]);
            } finally {
                setLoading(false);
            }
        }
        fetchStudents();
    }, []);

    return (
        <Card className="bg-white shadow-md">
            <CardHeader>
                <CardTitle>Student List</CardTitle>
                <CardDescription>Fetched from database</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                {loading ? (
                    <div className="p-4 text-center">Loading students...</div>
                ) : error ? (
                    <div className="p-4 text-center text-red-600">{error}</div>
                ) : (
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
                                    <tr key={s.student?.regNo || index}>
                                        <td className="border px-2 py-1">
                                            {s.student?.regNo || 'N/A'}
                                        </td>
                                        <td className="border px-2 py-1">
                                            {s.user?.first_name || ''} {s.user?.last_name || ''}
                                        </td>
                                        <td className="border px-2 py-1">
                                            {s.user?.email || 'N/A'}
                                        </td>
                                        <td className="border px-2 py-1">
                                            {s.student?.group || 'N/A'}
                                        </td>
                                        <td className="border px-2 py-1">
                                            {s.student?.level || 'N/A'}
                                        </td>
                                        <td className="border px-2 py-1">
                                            {s.student?.contact || 'N/A'}
                                        </td>
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
                )}
            </CardContent>
        </Card>
    );
}
