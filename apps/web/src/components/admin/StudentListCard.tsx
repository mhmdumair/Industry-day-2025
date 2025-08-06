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

interface Student {
  regNo: string;
  nic: string;
  contact: string;
  linkedin?: string;
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
type RawStudentFromApi = Student & { user: User };

export default function StudentListCard() {
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const { data } = await api.get<RawStudentFromApi[]>("/student");
        const formatted: StudentResponse[] = Array.isArray(data)
          ? data
              .filter((s): s is RawStudentFromApi => !!s && !!s.user)
              .map((s) => ({
                student: {
                  regNo: s.regNo,
                  nic: s.nic,
                  contact: s.contact,
                  linkedin: s.linkedin,
                  group: s.group,
                  level: s.level,
                },
                user: s.user,
              }))
          : [];

        setStudents(formatted);
        setError(null);
      } catch (e) {
        console.error("Error fetching students:", e);
        setError("Failed to fetch students.");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    })();
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
                <th className="border px-2 py-1">Reg&nbsp;No</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Group</th>
                <th className="border px-2 py-1">Level</th>
                <th className="border px-2 py-1">Contact</th>
              </tr>
            </thead>

            <tbody>
              {students.length ? (
                students.map((s, i) => (
                  <tr key={s.student.regNo ?? i}>
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
        )}
      </CardContent>
    </Card>
  );
}
