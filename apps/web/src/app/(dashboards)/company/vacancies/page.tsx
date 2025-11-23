'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Eye, Trash2, FileText, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/axios";
import axios from "axios";

// Interfaces
interface JobPost {
  jobPostID: string;
  companyID: string;
  fileName: string; // This is actually the Google Drive file ID
}

interface CompanyProfile {
  companyID: string;
  companyName: string;
}

export default function VacanciesPage() {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [companyName, setCompanyName] = useState<string>('');
  const [companyID, setCompanyID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Upload dialog state
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Preview dialog state
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [jobPostToDelete, setJobPostToDelete] = useState<JobPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch company and job posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get company profile
        const companyResponse = await api.get<CompanyProfile>('/company/by-user');
        const companyId = companyResponse.data.companyID;
        setCompanyName(companyResponse.data.companyName);
        setCompanyID(companyId);

        // Get job posts for this company
        const jobPostsResponse = await api.get<JobPost[]>(`/job-posts/company/${companyId}`);
        setJobPosts(jobPostsResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file type (PDF only)
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile || !companyID) {
      alert('Please select a file and ensure company is loaded');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('companyID', companyID);
      formData.append('file', selectedFile);

      const response = await api.post('/job-posts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;

      // Add new job post to the list
      if (data.jobPost) {
        setJobPosts(prev => [...prev, data.jobPost]);
      }

      // Close dialog and reset
      setIsUploadDialogOpen(false);
      setSelectedFile(null);

      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';

      alert(data.message || 'Job vacancy uploaded successfully!');
    } catch (err: unknown) {
      console.error("Failed to upload job post:", err);

      let errorMessage = 'An unknown error occurred.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      alert(`Failed to upload: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  // Handle preview
  const handlePreview = (fileId: string) => {
    setPreviewFileId(fileId);
    setIsPreviewDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (jobPost: JobPost) => {
    setJobPostToDelete(jobPost);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!jobPostToDelete) return;

    setIsDeleting(true);
    try {
      const response = await api.delete(`/job-posts/${jobPostToDelete.jobPostID}`);

      const data = response.data;

      // Remove from local state
      setJobPosts(prev => prev.filter(jp => jp.jobPostID !== jobPostToDelete.jobPostID));

      setIsDeleteDialogOpen(false);
      setJobPostToDelete(null);

      alert(data.message || 'Job vacancy deleted successfully!');
    } catch (err: unknown) {
      console.error("Failed to delete job post:", err);

      let errorMessage = 'An unknown error occurred.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      alert(`Failed to delete: ${errorMessage}`);
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
                <CardTitle className="text-2xl font-bold dark:text-white">Job Vacancies</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {companyName} • {jobPosts.length} vacanc{jobPosts.length !== 1 ? 'ies' : 'y'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {jobPosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No job vacancies uploaded yet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Upload your first job vacancy PDF to get started
                </p>
                <Button
                  onClick={() => setIsUploadDialogOpen(true)}
                  className="rounded-none"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Vacancy
                </Button>
              </div>
            ) : (
              <div className="border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-900">
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">#</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Job Vacancy</TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobPosts.map((jobPost, index) => (
                        <TableRow
                          key={jobPost.jobPostID}
                          className="hover:bg-gray-50 dark:hover:bg-gray-900/50 border-gray-200 dark:border-gray-800"
                        >
                          <TableCell className="font-medium dark:text-gray-300">
                            {index + 1}
                          </TableCell>
                          <TableCell className="dark:text-gray-300">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                              <span>Job Vacancy {index + 1}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePreview(jobPost.fileName)}
                                className="rounded-none border-gray-300 dark:border-gray-700"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClick(jobPost)}
                                className="rounded-none border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-none dark:bg-black">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Upload Job Vacancy</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Upload a PDF file for your job vacancy. Maximum file size: 10MB
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="rounded-none dark:bg-gray-900 dark:text-white"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-none border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                  Guidelines:
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
                  <li>Only PDF files are accepted</li>
                  <li>Maximum file size is 10MB</li>
                  <li>File will be stored securely in Google Drive</li>
                  <li>Students can view your job vacancies</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsUploadDialogOpen(false);
                setSelectedFile(null);
              }}
              disabled={uploading}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="rounded-none bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
            >
              {uploading ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] h-[90vh] rounded-none dark:bg-black p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="dark:text-white">Job Vacancy Preview</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none"
                onClick={() => setIsPreviewDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 p-6 pt-4 h-full">
            {previewFileId ? (
              <iframe
                src={`https://drive.google.com/file/d/${previewFileId}/preview`}
                className="w-full h-full border-0 rounded-none"
                title="Job Vacancy Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No preview available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-none dark:bg-black">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Delete Job Vacancy</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Are you sure you want to delete this job vacancy? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {jobPostToDelete && (
            <div className="py-4">
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-none border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <p className="font-medium dark:text-white">
                    Job Vacancy {jobPosts.findIndex(jp => jp.jobPostID === jobPostToDelete.jobPostID) + 1}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  The file will be permanently removed from Google Drive
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
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
