'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Download, Trash2, Eye, FileText } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/axios";

// Interfaces
interface ShortlistStudent {
  shortlistID: string;
  companyID: string;
  studentID: string;
  description: string;
  student: {
    studentID: string;
    regNo: string;
    nic: string;
    contact: string;
    linkedin: string | null;
    group: string;
    level: string;
    user: {
      userID: string;
      first_name: string;
      last_name: string;
      email: string;
    };
  } | null;
}

interface CompanyProfile {
  companyID: string;
  companyName: string;
}

export default function ShortlistsPage() {
  const [shortlists, setShortlists] = useState<ShortlistStudent[]>([]);
  const [filteredShortlists, setFilteredShortlists] = useState<ShortlistStudent[]>([]);
  const [companyName, setCompanyName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<ShortlistStudent | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<ShortlistStudent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch company and shortlists
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get company profile
        const companyResponse = await api.get<CompanyProfile>('/company/by-user');
        const companyId = companyResponse.data.companyID;
        setCompanyName(companyResponse.data.companyName);

        // Get shortlisted students with nested relations
        const shortlistsResponse = await api.get<ShortlistStudent[]>(`/shortlist/company/${companyId}`);

        // Filter out any items without proper student data
        const validShortlists = shortlistsResponse.data.filter(item =>
          item.student && item.student.user
        );

        setShortlists(validShortlists);
        setFilteredShortlists(validShortlists);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = shortlists.filter(item => {
      if (!item.student || !item.student.user) return false;

      const fullName = `${item.student.user.first_name} ${item.student.user.last_name}`.toLowerCase();
      const regNo = item.student.regNo.toLowerCase();
      const group = item.student.group.toLowerCase();
      const search = searchTerm.toLowerCase();

      return fullName.includes(search) || regNo.includes(search) || group.includes(search);
    });
    setFilteredShortlists(filtered);
  }, [searchTerm, shortlists]);

  // Export to CSV
  const exportToCSV = () => {
    if (filteredShortlists.length === 0) {
      alert('No data to export');
      return;
    }

    // CSV headers
    const headers = [
      'Registration No',
      'Name',
      'Email',
      'Group',
      'Level',
      'Contact',
      'NIC',
      'LinkedIn',
      'Description/Notes'
    ];

    // CSV rows
    const rows = filteredShortlists
      .filter(item => item.student && item.student.user)
      .map(item => [
        item.student!.regNo,
        `${item.student!.user.first_name} ${item.student!.user.last_name}`,
        item.student!.user.email,
        item.student!.group,
        item.student!.level.replace('level_', 'Level '),
        item.student!.contact,
        item.student!.nic,
        item.student!.linkedin || 'N/A',
        `"${item.description.replace(/"/g, '""')}"` // Escape quotes in description
      ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${companyName}_Shortlist_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // View student details
  const handleViewDetails = (student: ShortlistStudent) => {
    setSelectedStudent(student);
    setIsDetailsDialogOpen(true);
  };

  // Delete confirmation
  const handleDeleteClick = (student: ShortlistStudent) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  // Delete from shortlist
  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/shortlist/${studentToDelete.shortlistID}`);

      // Update local state
      setShortlists(prev => prev.filter(s => s.shortlistID !== studentToDelete.shortlistID));
      setFilteredShortlists(prev => prev.filter(s => s.shortlistID !== studentToDelete.shortlistID));

      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error("Failed to delete from shortlist:", error);
      alert('Failed to remove student from shortlist');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="rounded-none border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold dark:text-white">Shortlisted Students</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {companyName} • {filteredShortlists.length} student{filteredShortlists.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                onClick={exportToCSV}
                disabled={filteredShortlists.length === 0}
                variant="outline"
                className='rounded-none'
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by name, registration number, or group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-none border-gray-300 dark:border-gray-700 dark:bg-black dark:text-white"
                />
              </div>
            </div>

            {/* Table */}
            {filteredShortlists.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {searchTerm ? 'No students found' : 'No students shortlisted yet'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Students you shortlist during interviews will appear here'}
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900">
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Reg No</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Name</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Group</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Level</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Contact</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Notes</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredShortlists.map((item) => {
                        if (!item.student || !item.student.user) return null;

                        return (
                          <TableRow
                            key={item.shortlistID}
                            className="hover:bg-gray-50 dark:hover:bg-gray-900/50 border-gray-200 dark:border-gray-800"
                          >
                            <TableCell className="font-medium dark:text-gray-300">
                              {item.student.regNo}
                            </TableCell>
                            <TableCell className="dark:text-gray-300">
                              <div>
                                <p className="font-medium">{item.student.user.first_name} {item.student.user.last_name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.student.user.email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="dark:text-gray-300">
                              <Badge variant="secondary" className="rounded-none bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                {item.student.group}
                              </Badge>
                            </TableCell>
                            <TableCell className="dark:text-gray-300">
                              {item.student.level.replace('level_', 'Level ')}
                            </TableCell>
                            <TableCell className="dark:text-gray-300">
                              {item.student.contact}
                            </TableCell>
                            <TableCell className="dark:text-gray-300 max-w-xs truncate">
                              {item.description}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetails(item)}
                                  className="rounded-none border-gray-300 dark:border-gray-700"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteClick(item)}
                                  className="rounded-none border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Student Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-none dark:bg-black">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Student Details</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Complete information about the shortlisted student
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && selectedStudent.student && selectedStudent.student.user && (
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                  <p className="text-base font-medium dark:text-white">
                    {selectedStudent.student.user.first_name} {selectedStudent.student.user.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration No</label>
                  <p className="text-base font-medium dark:text-white">{selectedStudent.student.regNo}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                  <p className="text-base dark:text-gray-300">{selectedStudent.student.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</label>
                  <p className="text-base dark:text-gray-300">{selectedStudent.student.contact}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Group</label>
                  <p className="text-base dark:text-gray-300">{selectedStudent.student.group}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Level</label>
                  <p className="text-base dark:text-gray-300">
                    {selectedStudent.student.level.replace('level_', 'Level ')}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">NIC</label>
                <p className="text-base dark:text-gray-300">{selectedStudent.student.nic}</p>
              </div>

              {selectedStudent.student.linkedin && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">LinkedIn</label>
                  <a
                    href={selectedStudent.student.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {selectedStudent.student.linkedin}
                  </a>
                </div>
              )}

              {/* Notes */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Interview Notes</label>
                <p className="text-base dark:text-gray-300 mt-2 whitespace-pre-wrap">
                  {selectedStudent.description}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setIsDetailsDialogOpen(false)}
              className="rounded-none"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-none dark:bg-black">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Remove from Shortlist</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Are you sure you want to remove this student from your shortlist?
            </DialogDescription>
          </DialogHeader>

          {studentToDelete && studentToDelete.student && studentToDelete.student.user && (
            <div className="py-4">
              <div className="bg-gray-50 dark:bg-black p-4 rounded-none">
                <p className="font-medium dark:text-white">
                  {studentToDelete.student.user.first_name} {studentToDelete.student.user.last_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {studentToDelete.student.regNo} • {studentToDelete.student.group}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="rounded-none bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white"
            >
              {isDeleting ? 'Removing...' : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
