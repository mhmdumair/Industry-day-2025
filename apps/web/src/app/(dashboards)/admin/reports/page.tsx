"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, FileSpreadsheet, Calendar, Users, Building2, ClipboardList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  email: string;
  first_name: string;
  last_name: string;
}

interface Company {
  companyID: string;
  companyName: string;
  description: string;
  contactPersonName: string;
  contactPersonDesignation: string;
  contactNumber: string;
  sponsership: string;
  location: string;
  companyWebsite: string;
  user: User;
}

interface Student {
  studentID: string;
  regNo: string;
  nic: string;
  linkedin: string;
  contact: string;
  group: string;
  level: string;
  user: User;
}

interface Stall {
  stallID: string;
  title: string;
  roomID: string;
  companyID: string;
  preference: string;
  status: string;
}

interface Interview {
  interviewID: string;
  stallID: string | null;
  companyID: string;
  studentID: string;
  type: "walk-in" | "pre-listed";
  status: string;
  remark: string | null;
  student_preference: number;
  company_preference: number;
  created_at: string;
  stall?: Stall | null;
  student: Student;
  company: Company;
}

interface ReportStats {
  totalInterviews: number;
  prelistedInterviews: number;
  walkinInterviews: number;
  completedInterviews: number;
  inProgressInterviews: number;
  cancelledInterviews: number;
  inQueueInterviews: number;
  totalCompanies: number;
  totalStudents: number;
  activeCompanies: number;
}

export default function ReportsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState<ReportStats | null>(null);

  // Filters
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    fetchReportData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [interviews, selectedCompany, selectedType, selectedStatus]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [interviewsRes, companiesRes] = await Promise.all([
        api.get("/interview"),
        api.get("/company"),
      ]);

      // Filter out interviews without company data
      const validInterviews = (interviewsRes.data || []).filter((interview: Interview) => {
        if (!interview.company) {
          console.warn(`Interview ${interview.interviewID} missing company data`);
          return false;
        }
        return true;
      });

      setInterviews(validInterviews);
      setCompanies(companiesRes.data || []);
      calculateStats(validInterviews);
    } catch (error) {
      console.error("Failed to fetch report data:", error);
      alert("Failed to load report data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...interviews];

    if (selectedCompany !== "all") {
      filtered = filtered.filter(i => i.companyID === selectedCompany);
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(i => i.type === selectedType);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(i => i.status === selectedStatus);
    }

    setFilteredInterviews(filtered);
    calculateStats(filtered);
  };

  const calculateStats = (data: Interview[]) => {
    const uniqueStudents = new Set(data.map(i => i.studentID));
    const uniqueCompanies = new Set(data.map(i => i.companyID));
    const activeCompanies = new Set(
      data.filter(i => i.status === "completed" || i.status === "in_progress").map(i => i.companyID)
    );

    setStats({
      totalInterviews: data.length,
      prelistedInterviews: data.filter(i => i.type === "pre-listed").length,
      walkinInterviews: data.filter(i => i.type === "walk-in").length,
      completedInterviews: data.filter(i => i.status === "completed").length,
      inProgressInterviews: data.filter(i => i.status === "in_progress").length,
      cancelledInterviews: data.filter(i => i.status === "cancelled").length,
      inQueueInterviews: data.filter(i => i.status === "in_queue").length,
      totalCompanies: uniqueCompanies.size,
      totalStudents: uniqueStudents.size,
      activeCompanies: activeCompanies.size,
    });
  };

  const exportToCSV = () => {
    setExporting(true);
    try {
      // Prepare CSV headers
      const headers = [
        "Interview ID",
        "Date/Time",
        "Company Name",
        "Company Contact Person",
        "Company Contact Number",
        "Student Name",
        "Student Reg No",
        "Student Email",
        "Student Contact",
        "Student Group",
        "Student Level",
        "Interview Type",
        "Status",
        "Stall",
        "Student Preference",
        "Company Preference",
        "Remarks"
      ];

      // Prepare CSV rows
      const rows = filteredInterviews.map(interview => [
        interview.interviewID,
        new Date(interview.created_at).toLocaleString(),
        interview.company?.companyName || "N/A",
        interview.company?.contactPersonName || "N/A",
        interview.company?.contactNumber || "N/A",
        `${interview.student?.user?.first_name || ""} ${interview.student?.user?.last_name || ""}`.trim() || "N/A",
        interview.student?.regNo || "N/A",
        interview.student?.user?.email || "N/A",
        interview.student?.contact || "N/A",
        interview.student?.group || "N/A",
        interview.student?.level?.replace('_', ' ') || "N/A",
        interview.type,
        interview.status,
        interview.stall?.title || "N/A",
        interview.student_preference === 999 ? "N/A" : interview.student_preference,
        interview.company_preference === 999 ? "N/A" : interview.company_preference,
        interview.remark || "N/A"
      ]);

      // Convert to CSV format
      const csvContent = [
        headers.join(","),
        ...rows.map(row =>
          row.map(cell => {
            // Escape cells containing commas, quotes, or newlines
            const cellStr = String(cell);
            if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          }).join(",")
        )
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `interview-report-${timestamp}.csv`;

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export CSV. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const exportCompanySummary = () => {
    setExporting(true);
    try {
      // Group interviews by company
      const companyData = new Map<string, {
        company: Company;
        totalInterviews: number;
        completed: number;
        inProgress: number;
        cancelled: number;
        inQueue: number;
        prelisted: number;
        walkin: number;
        students: Set<string>;
      }>();

      filteredInterviews.forEach(interview => {
        // Skip interviews without company data
        if (!interview.company) return;

        if (!companyData.has(interview.companyID)) {
          companyData.set(interview.companyID, {
            company: interview.company,
            totalInterviews: 0,
            completed: 0,
            inProgress: 0,
            cancelled: 0,
            inQueue: 0,
            prelisted: 0,
            walkin: 0,
            students: new Set(),
          });
        }

        const data = companyData.get(interview.companyID)!;
        data.totalInterviews++;
        data.students.add(interview.studentID);

        if (interview.status === "completed") data.completed++;
        if (interview.status === "in_progress") data.inProgress++;
        if (interview.status === "cancelled") data.cancelled++;
        if (interview.status === "in_queue") data.inQueue++;
        if (interview.type === "pre-listed") data.prelisted++;
        if (interview.type === "walk-in") data.walkin++;
      });

      // Prepare CSV
      const headers = [
        "Company Name",
        "Contact Person",
        "Contact Number",
        "Email",
        "Total Interviews",
        "Unique Students",
        "Completed",
        "In Progress",
        "In Queue",
        "Cancelled",
        "Pre-listed",
        "Walk-in"
      ];

      const rows = Array.from(companyData.values()).map(data => [
        data.company.companyName,
        data.company.contactPersonName,
        data.company.contactNumber,
        data.company.user.email,
        data.totalInterviews,
        data.students.size,
        data.completed,
        data.inProgress,
        data.inQueue,
        data.cancelled,
        data.prelisted,
        data.walkin
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row =>
          row.map(cell => {
            const cellStr = String(cell);
            if (cellStr.includes(",") || cellStr.includes('"')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          }).join(",")
        )
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      const timestamp = new Date().toISOString().split('T')[0];
      link.setAttribute("href", url);
      link.setAttribute("download", `company-summary-${timestamp}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export CSV. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'in_queue': { label: 'In Queue', className: 'bg-blue-500/20 text-blue-700 dark:text-blue-300' },
      'in_progress': { label: 'In Progress', className: 'bg-green-500/20 text-green-700 dark:text-green-300' },
      'completed': { label: 'Completed', className: 'bg-orange-500/20 text-orange-700 dark:text-orange-300' },
      'cancelled': { label: 'Cancelled', className: 'bg-red-500/20 text-red-700 dark:text-red-300' }
    };

    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-500/20 text-gray-700' };
    return <Badge variant="outline" className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading report data...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview Reports</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive reports and analytics for Industry Day {new Date().getFullYear()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={exportToCSV}
            disabled={exporting || filteredInterviews.length === 0}
            className="rounded-none"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export Detailed Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="rounded-none border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInterviews}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.prelistedInterviews} pre-listed, {stats.walkinInterviews} walk-in
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedInterviews}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalInterviews > 0
                  ? ((stats.completedInterviews / stats.totalInterviews) * 100).toFixed(1)
                  : 0}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgressInterviews}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.inQueueInterviews} in queue
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCompanies}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.activeCompanies} active
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Unique participants
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="rounded-none border-gray-200 dark:border-gray-800">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800">
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Company</label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="rounded-none border-gray-200 dark:border-gray-800">
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent className="rounded-none bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.companyID} value={company.companyID}>
                      {company.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Interview Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="rounded-none border-gray-200 dark:border-gray-800">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="rounded-none bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pre-listed">Pre-listed</SelectItem>
                  <SelectItem value="walk-in">Walk-in</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="rounded-none border-gray-200 dark:border-gray-800">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-none bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in_queue">In Queue</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interview List */}
      <Card className="rounded-none border-gray-200 dark:border-gray-800">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800">
          <CardTitle>Interview Details ({filteredInterviews.length} records)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">Date/Time</th>
                    <th className="p-3 text-left text-sm font-medium">Company</th>
                    <th className="p-3 text-left text-sm font-medium">Student</th>
                    <th className="p-3 text-left text-sm font-medium">Reg No</th>
                    <th className="p-3 text-left text-sm font-medium">Type</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                    <th className="p-3 text-left text-sm font-medium">Stall</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInterviews.length > 0 ? (
                    filteredInterviews.map((interview) => (
                      <tr key={interview.interviewID} className="border-b border-gray-200 dark:border-gray-700 hover:bg-muted/50">
                        <td className="p-3 text-sm">
                          {new Date(interview.created_at).toLocaleString()}
                        </td>
                        <td className="p-3 text-sm font-medium">
                          {interview.company?.companyName || "N/A"}
                        </td>
                        <td className="p-3 text-sm">
                          {interview.student?.user?.first_name || ""} {interview.student?.user?.last_name || ""}
                        </td>
                        <td className="p-3 text-sm">{interview.student?.regNo || "N/A"}</td>
                        <td className="p-3 text-sm">
                          <Badge variant="outline">
                            {interview.type === "pre-listed" ? "Pre-listed" : "Walk-in"}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm">{getStatusBadge(interview.status)}</td>
                        <td className="p-3 text-sm">{interview.stall?.title || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        No interviews found matching the current filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
