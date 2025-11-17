"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

enum InterviewType {
  PRE_LISTED = "pre-listed",
  WALK_IN = "walk-in",
}

interface User {
  first_name: string;
  last_name: string;
  email: string;
}

interface Student {
  studentID: string;
  regNo: string;
  user: User;
}

interface Interview {
  interviewID: string;
  company: {
    companyName: string;
  };
  created_at: string;
  type: InterviewType;
  status: string;
}

interface ManageInterviewsProps {
  students: Student[];
}

export default function CancelInterview({ students }: ManageInterviewsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [interviewType, setInterviewType] = useState<InterviewType>(
    InterviewType.WALK_IN
  );
  const [loading, setLoading] = useState(false);

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

  const fetchInterviews = async (student: Student, type: InterviewType) => {
    setLoading(true);
    try {
      let endpoint = '';
      if (type === InterviewType.WALK_IN) {
        endpoint = `/interview/student/${student.studentID}/walkin/sorted`;
      } else if (type === InterviewType.PRE_LISTED) {
        endpoint = `/interview/student/${student.studentID}/prelisted/sorted`;
      }
      const res = await api.get(endpoint);
      setInterviews(res.data);
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
      alert("Failed to fetch interviews. Please try again.");
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = async (student: Student) => {
    setSelectedStudent(student);
    setSearchTerm("");
    await fetchInterviews(student, interviewType);
  };

  const handleInterviewTypeChange = async (value: InterviewType) => {
    setInterviewType(value);
    if (selectedStudent) {
      await fetchInterviews(selectedStudent, value);
    }
  };

  const handleCancelInterview = async (interviewID: string) => {
    if (!confirm("Are you sure you want to cancel this interview?")) {
      return;
    }
    try {
      await api.patch(`/interview/${interviewID}/cancel`);
      alert("Interview cancelled successfully.");
      if (selectedStudent) {
        await fetchInterviews(selectedStudent, interviewType);
      }
    } catch (error) {
      console.error("Failed to cancel interview:", error);
      const axiosError = error as AxiosError;
      alert(`Failed to cancel interview: ${axiosError.response?.statusText || axiosError.message}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-md rounded-none min-h-[55vh]">
      <CardHeader>
        <CardTitle>Manage Interviews</CardTitle>
        <CardDescription>
          Search for a student and manage their interviews.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="mb-1" htmlFor="student-search">Student</Label>
          <Input
            id="student-search"
            placeholder="Search by name, registration number, or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-none"
          />
          {selectedStudent ? (
            <div className="mt-2 flex justify-between items-center p-3 border rounded-none bg-teal-50">
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
                className="rounded-none"
                onClick={() => {
                  setSelectedStudent(null);
                  setInterviews([]);
                }}
              >
                <span className="text-sm text-red-500">Change</span>
              </Button>
            </div>
          ) : (
            filteredStudents.length > 0 && (
              <div className="mt-2 space-y-1 max-h-48 overflow-y-auto border rounded-none p-2">
                {filteredStudents.slice(0, 10).map((student) => (
                  <Card
                    key={student.studentID}
                    className="cursor-pointer hover:bg-gray-100 transition-colors rounded-none"
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

        {selectedStudent && (
          <div className="mt-4 space-y-4">
            <div>
              <Label className="mb-1" htmlFor="interview-type">Interview Type</Label>
              <Select
                value={interviewType}
                onValueChange={(value) => handleInterviewTypeChange(value as InterviewType)}
              >
                <SelectTrigger id="interview-type" className="rounded-none w-full">
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent className="rounded-none w-full">
                  <SelectItem value={InterviewType.WALK_IN}>Walk-in</SelectItem>
                  <SelectItem value={InterviewType.PRE_LISTED}>
                    Pre-listed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <h3 className="text-lg font-semibold mb-2">Interviews</h3>
            {loading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading interviews...
              </div>
            ) : interviews.length > 0 ? (
              <div className="space-y-2">
                {interviews.map((interview) => (
                  <div
                    key={interview.interviewID}
                    className="flex justify-between items-center p-3 border rounded-none"
                  >
                    <div>
                      <p className="font-medium">{interview.company.companyName}</p>
                      <p className="text-sm text-gray-500">
                        Status: {interview.status}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-none"
                      onClick={() => handleCancelInterview(interview.interviewID)}
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No interviews found for this student.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}