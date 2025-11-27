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
import { ChevronLeft, ChevronRight, Download, Loader2, Edit, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

// --- Constants & Interfaces ---

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
  BT = "BT", ZL = "ZL", CH = "CH", MT = "MT", BMS = "BMS", ST = "ST", GL = "GL",
  CS = "CS", DS = "DS", ML = "ML", CM = "CM", ES = "ES", MB = "MB", PH = "PH",
  ALL = "ALL"
}

// --- Main Component ---

export default function StudentReport() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<Preference | "ALL">(Preference.ALL);

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 15;

  const handleAuthError = () => {
    alert("Session expired. Please login again.");
    router.push("/auth/login");
  };

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
      const axiosError = e as AxiosError;
      if (axiosError.response?.status === 401) {
        handleAuthError();
      } else {
        console.error("Error fetching students:", e);
        setError("Failed to fetch students");
        setStudents([]);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: "user" | "student") => {
    if (!editingStudent) return;
    const { name, value } = e.target;
    setEditingStudent(prev => ({
      ...prev!,
      [section]: { ...prev![section], [name]: value, },
    }));
  };

  const handleSelectChange = (name: "level", value: string) => {
    if (!editingStudent) return;
    setEditingStudent(prev => ({
      ...prev!,
      student: { ...prev!.student, [name]: value, },
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
      setStudents(prev => prev.map(s =>
        s.student.studentID === editingStudent.student.studentID ? editingStudent : s
      ));
      handleDialogClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update");
    } finally {
      setUpdateLoading(false);
    }
  };

  const exportStudentInfo = () => {
    setExporting(true);
    try {
        const headers = ["Reg No", "NIC", "First Name", "Last Name", "Email", "Contact", "Group", "Level", "LinkedIn"];
        const rows = students.map(s => [
            s.student.regNo, s.student.nic || "N/A", s.user.first_name, s.user.last_name, 
            s.user.email, s.student.contact, s.student.group, s.student.level, s.student.linkedin || "N/A"
        ]);
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${String(cell || "").replace(/"/g, '""')}"`).join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `students-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Export failed:", error);
    } finally {
        setExporting(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-black shadow-md w-full mx-auto rounded-none border border-gray-200 dark:border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <CardTitle className="text-2xl leading-tight dark:text-white">Student List</CardTitle>
          <CardDescription className="text-base dark:text-gray-400">Manage student records</CardDescription>
        </div>
        <Button
          onClick={exportStudentInfo}
          disabled={exporting || students.length === 0}
          className="rounded-none bg-white text-black border border-gray-300 hover:bg-gray-100 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-sm font-medium shadow-sm"
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
          Export CSV
        </Button>
      </CardHeader>
      
      <CardContent className="pt-6">
        {/* --- Filters --- */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
          <div className="flex-1 w-full">
            <p className="mb-1.5 dark:text-gray-300 text-sm font-medium">Search</p>
            <Input
              id="search"
              type="text"
              placeholder="Search by name, reg no, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-none border-gray-300 dark:border-gray-700 focus:ring-0 focus:border-black dark:focus:border-white dark:bg-black dark:text-white text-base h-10"
            />
          </div>
          
          <div className="w-full sm:w-1/3 flex flex-col">
            <p className="mb-1.5 dark:text-gray-300 text-sm font-medium">Filter Group</p>
            
            <div className="flex items-center gap-0">
                <Select onValueChange={(value: Preference | "ALL") => setSelectedGroup(value as Preference | "ALL")} value={selectedGroup}>
                <SelectTrigger id="group-filter" className="rounded-none border-gray-300 dark:border-gray-700 dark:bg-black dark:text-white text-base h-10 flex-1">
                    <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent className="rounded-none dark:bg-black dark:text-white dark:border-gray-700">
                    <SelectItem value={Preference.ALL}>All Groups</SelectItem>
                    {Object.values(Preference).filter(p => p !== Preference.ALL).map((group) => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                </SelectContent>
                </Select>

                {/* Count Badge: No Border, Aligned */}
                <div className="h-10 px-4 flex items-center justify-center text-sm font-mono font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    Total: {filteredStudents.length}
                </div>
            </div>
          </div>
        </div>

        {/* --- List View Container --- */}
        <div className="border-t border-gray-200 dark:border-gray-800">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p className="text-base">Loading data...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-base">
            {error}
          </div>
        ) : (
          <div className="w-full">
            {/* Header Row */}
            <div className="hidden md:flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-sm uppercase tracking-wider text-gray-600 font-bold">
                <div className="w-[35%] pl-14 text-left">Student Info</div>
                <div className="w-[25%] text-center">Contact</div>
                <div className="w-[15%] text-center">Group</div>
                <div className="w-[15%] text-center">Level</div>
                <div className="w-[10%] text-right pr-4">Edit</div>
            </div>

            {currentStudents.length > 0 ? (
              currentStudents.map((s, i) => (
                <div 
                  key={s.student.studentID || i} 
                  className="group flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors min-h-[80px]"
                >
                  {/* Column 1: Identity (35%) - Left Aligned */}
                  <div className="md:w-[35%] flex items-center gap-4 mb-2 md:mb-0 pl-4">
                    <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-base">
                      {s.user.first_name?.[0]}{s.user.last_name?.[0]}
                    </div>
                    
                    <div className="flex flex-col justify-center min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-xl text-gray-900 dark:text-white leading-none">
                            {s.user.first_name} {s.user.last_name}
                            </h4>
                            {/* Clean Reg No - No border, no bg, just text color */}
                            <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold font-mono pl-2">
                                {s.student.regNo}
                            </span>
                        </div>
                        {/* Clean Email - No bg */}
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate max-w-[240px]">
                            {s.user.email}
                        </p>
                    </div>
                  </div>

                  {/* Column 2: Contact (25%) - Centered */}
                  <div className="md:w-[25%] mb-2 md:mb-0 flex flex-col items-center justify-center text-center">
                      <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                        {s.student.contact}
                      </p>
                      {s.student.nic && (
                         <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                            NIC: {s.student.nic}
                         </p>
                      )}
                  </div>

                  {/* Column 3: Group (15%) - Centered */}
                  <div className="md:w-[15%] mb-2 md:mb-0 flex justify-center">
                    <span className="text-base font-bold text-black dark:text-white uppercase tracking-wide">
                      {s.student.group}
                    </span>
                  </div>

                  {/* Column 4: Level (15%) - Centered */}
                  <div className="md:w-[15%] mb-2 md:mb-0 flex justify-center">
                    <span className="text-base text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      {s.student.level.replace("_", " ")}
                    </span>
                  </div>

                  {/* Column 5: Actions (10%) - Right Aligned */}
                  <div className="md:w-[10%] flex justify-end pr-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(s)}
                      className="text-gray-400 hover:text-black hover:bg-transparent dark:hover:text-white h-10 w-10"
                    >
                      <Edit className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-gray-500 border-b border-gray-200 dark:border-gray-800">
                <UserIcon className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-base">No students found.</p>
              </div>
            )}
          </div>
        )}
        </div>

        {/* --- Pagination --- */}
        {filteredStudents.length > studentsPerPage && (
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-none border-gray-300 dark:border-gray-700 dark:bg-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 text-sm h-10 px-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-none border-gray-300 dark:border-gray-700 dark:bg-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 text-sm h-10 px-4"
            >
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>

      {/* --- Edit Dialog --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogContent className="max-w-2xl rounded-none dark:bg-black dark:text-white dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="dark:text-white text-xl">Edit Student</DialogTitle>
            </DialogHeader>
            {editingStudent && (
              <form onSubmit={handleSubmit} className="space-y-5">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-800 mt-2">
                    <Button type="submit" className="flex-1 rounded-none bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-base" disabled={updateLoading}>
                        {updateLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleDialogClose} disabled={updateLoading} className="rounded-none border-gray-300 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 text-base">
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

// --- Helper Components ---

function InputField({ label, name, value, onChange, section }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>, section: "user" | "student") => void, section: "user" | "student" }) {
    return (
        <div>
            <Label className="dark:text-gray-300 text-xs uppercase text-gray-500 mb-1.5 block font-semibold">{label}</Label>
            <Input name={name} value={value} onChange={(e) => onChange(e, section)} className="rounded-none border-gray-300 dark:border-gray-700 dark:bg-black dark:text-white h-10 text-base" />
        </div>
    );
}

function SelectField({ label, value, options, onChange }: { label: string, value: string, options: (string | { label: string, value: string })[], onChange: (val: string) => void }) {
    return (
        <div>
            <Label className="dark:text-gray-300 text-xs uppercase text-gray-500 mb-1.5 block font-semibold">{label}</Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="rounded-none border-gray-300 dark:border-gray-700 dark:bg-black dark:text-white h-10 text-base">
                    <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent className="rounded-none dark:bg-black dark:text-white dark:border-gray-700">
                    {options.map((opt) => {
                        const val = typeof opt === "string" ? opt : opt.value;
                        const label = typeof opt === "string" ? opt : opt.label;
                        return <SelectItem key={val} value={val} className="text-base">{label}</SelectItem>;
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}