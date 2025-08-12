"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import CreateInterview from "../../../../components/admin/create-interview";
import CancelInterview from "../../../../components/admin/cancel-interview";
import { Loader2 } from "lucide-react";

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

export default function InterviewPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [companiesRes, studentsRes] = await Promise.all([
          api.get("/company"),
          api.get("/student"),
        ]);
        setCompanies(companiesRes.data);
        setStudents(studentsRes.data);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        alert("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading forms...
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <CreateInterview companies={companies} students={students} />
        <CancelInterview students={students} />
      </div>
    </div>
  );
}