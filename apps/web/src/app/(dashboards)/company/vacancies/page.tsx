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
import { Upload, Eye, Trash2, FileText, X, ExternalLink } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/axios";
import axios from "axios";

// --- Data Types ---
interface JobPost {
    jobPostID: string;
    companyID: string;
    // This field contains the Google Drive File ID
    fileName: string;
}

interface CompanyProfile {
    companyID: string;
    companyName: string;
}

export default function VacanciesPage() {
    // --- State: Data & Loading ---
    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const [companyName, setCompanyName] = useState<string>('');
    const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
    const [isPageLoading, setIsPageLoading] = useState(true);

    // --- State: Upload Dialog ---
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [vacancyFileToUpload, setVacancyFileToUpload] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // --- State: Preview Dialog ---
    const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
    const [fileIdToPreview, setFileIdToPreview] = useState<string | null>(null);

    // --- State: Delete Dialog ---
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<JobPost | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [currentCvFileName, setCurrentCvFileName] = useState<string | null>(null);

    // --- Effect: Initial Data Fetch (Company Profile & Job Posts) ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsPageLoading(true);

                // Get company profile
                const companyResponse = await api.get<CompanyProfile>('/company/by-user');
                const companyId = companyResponse.data.companyID;
                setCompanyName(companyResponse.data.companyName);
                setCurrentCompanyId(companyId);

                // Get job posts for this company
                const jobPostsResponse = await api.get<JobPost[]>(`/job-posts/company/${companyId}`);
                console.log('Fetched job posts:', jobPostsResponse.data);
                setJobPosts(jobPostsResponse.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsPageLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- Handler: File Selection for Upload ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Validate file type (PDF only)
            if (file.type !== 'application/pdf') {
                alert('Please select a PDF file');
                setVacancyFileToUpload(null);
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                setVacancyFileToUpload(null);
                return;
            }

            setVacancyFileToUpload(file);
        } else {
            setVacancyFileToUpload(null);
        }
    };

    // --- Handler: Upload Confirmation ---
    const handleUpload = async () => {
        if (!vacancyFileToUpload || !currentCompanyId) {
            alert('Please select a file and ensure company is loaded');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('companyID', currentCompanyId);
            formData.append('file', vacancyFileToUpload); // Use the file name 'file' expected by NestJS FileInterceptor

            const response = await api.post('/job-posts/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = response.data;

            // Add new job post to the list (assuming data.jobPost is the new entity)
            if (data.jobPost) {
                setJobPosts(prev => [...prev, data.jobPost]);
            }

            // Close dialog and reset state
            setIsUploadDialogOpen(false);
            setVacancyFileToUpload(null);

            // Reset file input element
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
            setIsUploading(false);
        }
    };

    // --- Handler: Preview PDF ---
    const handlePreview = (fileName: string) => {
        console.log('Preview clicked - Drive File ID:', fileName);
        console.log('Full PDF URL:', `https://drive.google.com/file/d/${fileName}/preview`);
        setFileIdToPreview(fileName);
        setIsPreviewDialogOpen(true);
    };

    // --- Handler: Delete Trigger ---
    const handleDeleteClick = (jobPost: JobPost) => {
        setPostToDelete(jobPost);
        setIsDeleteDialogOpen(true);
    };

    const pdfSource = fileIdToPreview 
        ? `https://drive.google.com/file/d/${fileIdToPreview}/preview` 
        : 'about:blank'; 

    // --- Handler: Delete Confirmation ---
    const handleDeleteConfirm = async () => {
        if (!postToDelete) return;

        setIsDeleting(true);
        try {
            // Backend endpoint is DELETE /job-posts/:jobPostID
            const response = await api.delete(`/job-posts/${postToDelete.jobPostID}`);

            const data = response.data;

            // Remove from local state
            setJobPosts(prev => prev.filter(jp => jp.jobPostID !== postToDelete.jobPostID));

            // Close dialog and reset state
            setIsDeleteDialogOpen(false);
            setPostToDelete(null);

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

    // --- Render: Loading State ---
    if (isPageLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    // --- Render: Main Component UI ---
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
            <div className="max-w-7xl mx-auto">
                <Card className="rounded-none border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                    {/* Card Header and Upload Button */}
                    <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl font-bold dark:text-white">Job Vacancies</CardTitle>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {companyName} • {jobPosts.length} vacanc{jobPosts.length !== 1 ? 'ies' : 'y'}
                                </p>
                            </div>
                            <Button
                                onClick={() => setIsUploadDialogOpen(true)}
                                className="rounded-none sm:w-auto w-full"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Vacancy
                            </Button>
                        </div>
                    </CardHeader>

                    {/* Card Content: Vacancy List/Empty State */}
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {jobPosts.map((jobPost, index) => (
                                    <div
                                        key={jobPost.jobPostID}
                                        className="group relative border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden bg-white dark:bg-black hover:shadow-lg transition-shadow duration-200"
                                    >
                                        {/* PDF Preview Thumbnail */}
                                        <div
                                            className="relative square bg-gray-100 dark:bg-gray-900 cursor-pointer overflow-hidden"
                                            onClick={() => {
                                                console.log('Job Post Object:', jobPost);
                                                console.log('Job Post fileName:', jobPost.fileName);
                                                handlePreview(jobPost.fileName);
                                            }}
                                        >
                                            {/* PDF Embed for thumbnail */}
                                            <iframe
                                                src={`https://drive.google.com/file/d/${jobPost.fileName}/preview`}
                                                className="w-full h-full pointer-events-none"
                                                title={`Job Vacancy ${index + 1} Preview`}
                                            />

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                                <div className="text-white text-center">
                                                    <Eye className="h-8 w-8 mx-auto mb-2" />
                                                    <p className="text-sm font-medium">Click to view</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Footer with Actions */}
                                        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                    <span className="text-sm font-medium dark:text-gray-300">
                                                        Vacancy {index + 1}
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(jobPost)}
                                                    className="rounded-none border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 h-8 w-8 p-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* --- Dialogs --- */}

            {/* Upload Dialog (Modal) */}
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
                                {vacancyFileToUpload && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        Selected: {vacancyFileToUpload.name} ({(vacancyFileToUpload.size / 1024 / 1024).toFixed(2)} MB)
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
                                setVacancyFileToUpload(null);
                            }}
                            disabled={isUploading}
                            className="rounded-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!vacancyFileToUpload || isUploading}
                            className="rounded-none bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                        >
                            {isUploading ? (
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

            {/* Preview Dialog (Modal) */}
            <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
                <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] h-[90vh] rounded-none dark:bg-black flex flex-col gap-0">
                    <DialogHeader className="p-6 pb-0">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl dark:text-white">Job Vacancy Preview</DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 px-8 pt-4">
                        {(() => {
                            console.log('Preview Dialog - fileIdToPreview:', fileIdToPreview);
                            console.log('Preview Dialog - pdfSource:', pdfSource);
                            return fileIdToPreview ? (
                                // Uses Google Drive embed feature to display PDF
                                <iframe
                                    src={pdfSource}
                                    className="w-full h-full border-0 rounded-none"
                                    title="Job Vacancy Preview"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                    No preview available
                                </div>
                            );
                        })()}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog (Modal) */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-none dark:bg-black">
                    <DialogHeader>
                        <DialogTitle className="dark:text-white">Delete Job Vacancy</DialogTitle>
                        <DialogDescription className="dark:text-gray-400">
                            Are you sure you want to delete this job vacancy? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    {postToDelete && (
                        <div className="py-4">
                            <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-none border border-red-200 dark:border-red-800">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                                    <p className="font-medium dark:text-white">
                                        Job Vacancy {jobPosts.findIndex(jp => jp.jobPostID === postToDelete.jobPostID) + 1}
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