// src/components/InterviewForm.tsx
"use client";

import React, { useState, useMemo } from "react";
import api from "@/lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AxiosError } from "axios";

enum InterviewType {
  PRE_LISTED = "pre-listed",
  WALK_IN = "walk-in",
}

interface Company {
  companyID: string;
  companyName: string;
}

interface User {
  userID: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Student {
  studentID: string;
  regNo: string;
  user: User;
}

interface InterviewFormProps {
  companies: Company[];
  students: Student[];
}

export default function CreateInterview({ companies, students }: InterviewFormProps) {
  const [formData, setFormData] = useState({
    regNo: "",
    companyID: "",
    type: "" as InterviewType | "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleChange = (name: "regNo" | "companyID" | "type", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setSearchTerm("");
    setFormData((prev) => ({
      ...prev,
      regNo: student.regNo,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.regNo || !formData.companyID || !formData.type) {
      alert("Please enter a registration number, select a company, and an interview type.");
      return;
    }

    try {
      await api.post("/interview/by-regno", {
        regNo: formData.regNo,
        companyID: formData.companyID,
        type: formData.type,
      });
      alert(`${formData.type} interview for ${formData.regNo} created successfully!`);
      setFormData({ regNo: "", companyID: "", type: "" });
      setSelectedStudent(null);
    } catch (error) {
      console.error(`Error creating ${formData.type} interview:`, error);
      
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        if (axiosError.response.status === 409) {
          alert("This student already has an interview scheduled for this company.");
          return;
        } else if (axiosError.response.status === 404) {
          alert("The student registration number was not found.");
          return;
        } else if (axiosError.response.status === 500) {
          alert("An interview for this student may already exist. Please check the pre-listed or walk-in queues.");
          return;
        } else {
          alert(`An error occurred: ${axiosError.response.statusText}`);
          return;
        }
      } else if (axiosError.request) {
        alert("A network error occurred. Please check your connection and try again.");
        return;
      } else {
        alert(`An unexpected error occurred: ${axiosError.message}`);
        return;
      }
    }
  };

  const filteredStudents = useMemo(() => {
    const k = searchTerm.trim().toLowerCase();
    if (!k) return [];
    return students.filter((s) => {
      const fullName = `${s.user.first_name} ${s.user.last_name}`.toLowerCase();
      return (
        fullName.includes(k) ||
        s.regNo.toLowerCase().includes(k) ||
        s.user.email.toLowerCase().includes(k)
      );
    });
  }, [searchTerm, students]);

  return (
    <Card className="w-full max-w-2xl shadow-md">
      <CardHeader>
        <CardTitle>Create Interview</CardTitle>
        <CardDescription>
          Schedule a pre-listed or add a student to the walk-in queue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="student-search">Student</Label>
            <Input
              id="student-search"
              placeholder="Search by name, registration number, or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {selectedStudent ? (
              <div className="mt-2 flex justify-between items-center p-3 border rounded-md bg-teal-50">
                <div>
                  <div className="font-medium">
                    {selectedStudent.user.first_name} {selectedStudent.user.last_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedStudent.regNo} | {selectedStudent.user.email}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedStudent(null);
                    setFormData((prev) => ({ ...prev, regNo: "" }));
                  }}
                >
                  <span className="text-sm text-red-500">Change</span>
                </Button>
              </div>
            ) : (
              filteredStudents.length > 0 && (
                <div className="mt-2 space-y-1 max-h-48 overflow-y-auto border rounded-md p-2">
                  {filteredStudents.slice(0, 10).map((student) => (
                    <Card
                      key={student.studentID}
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleStudentSelect(student)}
                    >
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">
                          {student.user.first_name} {student.user.last_name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {student.regNo} | {student.user.email}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )
            )}
          </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Select
              value={formData.companyID}
              onValueChange={(value) => handleChange("companyID", value)}
            >
              <SelectTrigger id="company">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.companyID} value={company.companyID}>
                    {company.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="interview-type">Interview Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange("type", value as InterviewType)}
            >
              <SelectTrigger id="interview-type">
                <SelectValue placeholder="Select interview type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={InterviewType.PRE_LISTED}>
                  Pre-listed
                </SelectItem>
                <SelectItem value={InterviewType.WALK_IN}>Walk-in</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={!selectedStudent}>
            Create Interview
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}