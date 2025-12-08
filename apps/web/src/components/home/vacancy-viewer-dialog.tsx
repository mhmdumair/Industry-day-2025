'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { FileText, Eye } from "lucide-react";
import api from "@/lib/axios";

interface JobPost {
    jobPostID: string;
    companyID: string;
    fileName: string;
}

interface VacancyViewerDialogProps {
    companyId: string;
    companyName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function VacancyViewerDialog({ companyId, companyName, open, onOpenChange }: VacancyViewerDialogProps) {
    const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewFile, setPreviewFile] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        console.log("VacancyViewerDialog useEffect. open:", open, "companyId:", companyId);
        if (open && companyId) {
            const fetchJobPosts = async () => {
                setLoading(true);
                console.log(`Fetching job posts for companyId: ${companyId}`);
                try {
                    const response = await api.get<JobPost[]>(`/job-posts/company/${companyId}`);
                    console.log("Fetched job posts:", response.data);
                    setJobPosts(response.data);
                } catch (error) {
                    console.error("Failed to fetch job posts:", error);
                    setJobPosts([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchJobPosts();
        }
    }, [open, companyId]);

    const handlePreview = (fileName: string) => {
        setPreviewFile(fileName);
        setIsPreviewOpen(true);
    };

    const pdfSource = previewFile
        ? `https://drive.google.com/file/d/${previewFile}/preview`
        : 'about:blank';

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-4xl rounded-none dark:bg-black">
                    <DialogHeader>
                        <DialogTitle className="dark:text-white">Job Vacancies - {companyName}</DialogTitle>
                        <DialogDescription className="dark:text-gray-400">
                            Available positions at {companyName}.<br/>Click to view details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 max-h-[70vh] overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <Spinner />
                            </div>
                        ) : jobPosts.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    No job vacancies available at the moment.
                                </h3>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {jobPosts.map((jobPost, index) => (
                                    <div
                                        key={jobPost.jobPostID}
                                        className="group relative border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden bg-white dark:bg-black hover:shadow-lg transition-shadow duration-200"
                                        onClick={() => handlePreview(jobPost.fileName)}
                                    >
                                        <div className="relative h-64 bg-gray-100 dark:bg-gray-900 cursor-pointer overflow-hidden">
                                            <iframe
                                                src={`https://drive.google.com/file/d/${jobPost.fileName}/preview`}
                                                className="w-full h-full pointer-events-none"
                                                title={`Job Vacancy ${index + 1} Preview`}
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                                <div className="text-white text-center">
                                                    <Eye className="h-8 w-8 mx-auto mb-2" />
                                                    <p className="text-sm font-medium">Click to view</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                                            <span className="text-sm font-medium dark:text-gray-300">
                                                Vacancy {index + 1}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] h-[90vh] rounded-none dark:bg-black flex flex-col gap-0">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-xl dark:text-white">Job Vacancy Preview</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 px-8 pt-4">
                        {previewFile && (
                            <iframe
                                src={pdfSource}
                                className="w-full h-full border-0 rounded-none"
                                title="Vacancy Preview"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
