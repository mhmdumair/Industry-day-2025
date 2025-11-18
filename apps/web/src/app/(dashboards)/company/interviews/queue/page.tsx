'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Home, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import { AxiosError } from "axios";

// Interfaces
interface StudentData {
    interviewID: string;
    studentID: string;
    status: string;
    type: 'prelisted' | 'walkin';
    company_preference: number;
    student: {
        regNo: string;
        group: string;
        user: {
            first_name: string;
            last_name: string;
        };
    };
}

interface CompanyProfile {
    companyID: string;
    userID: string;
    companyName: string;
}

interface Stall {
    stallID: string;
    title: string;
    roomID: string;
    companyID: string;
    preference: string;
    status: string;
    room: {
        roomName: string;
        location: string;
    }
}

export default function ResumePage() {
    const router = useRouter();
    const [currentInterviewID, setCurrentInterviewID] = useState<string | null>(null);
    const [prelistedStudents, setPrelistedStudents] = useState<StudentData[]>([]);
    const [walkinStudents, setWalkinStudents] = useState<StudentData[]>([]);
    const [companyName, setCompanyName] = useState<string>('');
    const [stallNumber, setStallNumber] = useState<string>('');
    const [currentCvFileName, setCurrentCvFileName] = useState<string | null>(null);
    const [companyID, setCompanyID] = useState<string | null>(null);
    const [stallID, setStallID] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentRemark, setCurrentRemark] = useState('');

    // Dialog states
    const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
    const [interviewComment, setInterviewComment] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const activeStudents = [...prelistedStudents, ...walkinStudents];
    const currentStudent = activeStudents.find(s => s.interviewID === currentInterviewID) || activeStudents[0];
    const maxSize = 15;

    // Filter students based on search
    const filteredPrelisted = prelistedStudents.filter(student => 
        student.student.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${student.student.user.first_name} ${student.student.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredWalkin = walkinStudents.filter(student => 
        student.student.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${student.student.user.first_name} ${student.student.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchCvFileName = useCallback(async (studentId: string) => {
        try {
            const { data } = await api.get(`/cv/student/${studentId}/list`);
            if (data && data.length > 0) {
                setCurrentCvFileName(data[0].fileName);
            } else {
                setCurrentCvFileName(null);
            }
        } catch (error) {
            console.error(`Failed to fetch CV for student ${studentId}:`, error);
            setCurrentCvFileName(null);
        }
    }, []);
    
    const refreshQueue = useCallback(async (companyId: string, stallId: string) => {
        try {
            const { data: fetchedPrelisted } = await api.get(`/interview/company/${companyId}/prelisted/inqueue`);
            const { data: fetchedWalkin } = await api.get(`/interview/stall/${stallId}/inqueue`);

            setPrelistedStudents(fetchedPrelisted);
            setWalkinStudents(fetchedWalkin);
            
            if (!currentInterviewID && fetchedPrelisted.length > 0) {
                setCurrentInterviewID(fetchedPrelisted[0].interviewID);
            } else if (!currentInterviewID && fetchedWalkin.length > 0) {
                setCurrentInterviewID(fetchedWalkin[0].interviewID);
            }
        } catch (error) {
            console.error("Failed to fetch queue:", error);
            setPrelistedStudents([]);
            setWalkinStudents([]);
        }
    }, [currentInterviewID]);

    const fillEmptySlots = useCallback(async (companyId: string, stallId: string) => {
        const slotsToFill = maxSize - (prelistedStudents.length + walkinStudents.length);
        if (slotsToFill > 0) {
            try {
                await api.get(`/interview/company/${companyId}/stall/${stallId}/next-walkin?count=${slotsToFill}`);
                await refreshQueue(companyId, stallId);
            } catch (error) {
                console.error("Failed to fill empty slots:", error);
            }
        }
    }, [prelistedStudents.length, walkinStudents.length, refreshQueue]);
        
    const handleStudentClick = useCallback((interviewId: string) => {
        setCurrentInterviewID(interviewId);
        setCurrentRemark(''); // Clear remark when switching students
        const selectedStudent = activeStudents.find(s => s.interviewID === interviewId);
        if (selectedStudent) {
            fetchCvFileName(selectedStudent.studentID);
        }
    }, [activeStudents, fetchCvFileName]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const companyResponse = await api.get<CompanyProfile>('/company/by-user');
                const companyId = companyResponse.data.companyID;
                setCompanyName(companyResponse.data.companyName);
                setCompanyID(companyId);

                const stallsResponse = await api.get<Stall[]>(`/stall/company/${companyId}`);
                if (stallsResponse.data.length > 0) {
                    const stallId = stallsResponse.data[0].stallID;
                    setStallID(stallId);
                    setStallNumber(stallsResponse.data[0].title);
                    await refreshQueue(companyId, stallId);
                    await fillEmptySlots(companyId, stallId);

                    const interval = setInterval(() => {
                        refreshQueue(companyId, stallId);
                        fillEmptySlots(companyId, stallId);
                    }, 10000);
                    
                    return () => clearInterval(interval);
                }
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [refreshQueue, fillEmptySlots]);

    useEffect(() => {
        if (currentStudent && currentStudent.studentID) {
            fetchCvFileName(currentStudent.studentID);
        }
    }, [currentStudent, fetchCvFileName]);

    // Open the comment dialog when Finish Interview is clicked
    const handleFinishInterviewClick = () => {
        if (!currentStudent) return;
        setIsCommentDialogOpen(true);
        setInterviewComment(currentRemark); // Pre-populate with current remark
    };

    // Submit the interview with comment
    const handleSubmitInterview = async () => {
        if (!currentStudent || !companyID || !stallID) return;

        setIsSubmittingComment(true);
        try {
            // Submit the remark if provided
            if (interviewComment.trim()) {
                await api.patch(`/interview/${currentStudent.interviewID}`, {
                    remark: interviewComment
                });
            }

            // Complete the interview
            await api.patch(`/interview/${currentStudent.interviewID}/complete`);
            
            // Close the dialog
            setIsCommentDialogOpen(false);
            setInterviewComment('');
            setCurrentRemark(''); // Clear the remark field

            // Refresh the queue
            await refreshQueue(companyID, stallID);

            // Move to next student
            const nextStudentIndex = activeStudents.findIndex((s: StudentData) => s.interviewID === currentStudent.interviewID) + 1;
            if (nextStudentIndex < activeStudents.length) {
                setCurrentInterviewID(activeStudents[nextStudentIndex]?.interviewID);
                fetchCvFileName(activeStudents[nextStudentIndex]?.studentID);
            } else {
                setCurrentInterviewID(null);
                setCurrentCvFileName(null);
            }

            await fillEmptySlots(companyID, stallID);
        } catch (error) {
            console.error("Failed to finish interview:", error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const pdfSource = currentCvFileName 
        ? `https://drive.google.com/file/d/${currentCvFileName}/preview` 
        : 'about:blank'; 

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Loading...</span>
            </div>
        );
    }

    if (!companyID || !stallID) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
                <div className="text-red-500 dark:text-red-400 text-lg">
                    Failed to load company or stall data. Please try again later.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <div className="flex h-screen">
                {/* Main Content Area - PDF Viewer */}
                <div className="flex-1 p-4">
                    <Card className="h-full rounded-none border-gray-200 dark:border-gray-800 dark:bg-gray-950">
                        <CardContent className="p-0 h-full">
                            {currentStudent ? (
                                <iframe
                                    src={pdfSource}
                                    className="w-full h-full border-0"
                                    title={`CV - ${currentStudent.student.user.first_name} ${currentStudent.student.user.last_name}`}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                    No students in the queue.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar */}
                <div className="w-96 bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 flex flex-col">
                    {/* Company Info Card */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold dark:text-white">{companyName}</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{stallNumber}</p>
                        </div>

                        {currentStudent && (
                            <div className="bg-green-100 dark:bg-green-950 p-4 mb-4 rounded-none">
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {currentStudent.student.regNo}
                                    </span>
                                    <Badge className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0 px-2 py-1 rounded-none">
                                        {currentStudent.type === 'walkin' ? 'Walk-in' : `Pre-listed : ${currentStudent.company_preference}`}
                                    </Badge>
                                </div>
                                <h3 className="text-2xl font-bold mb-1 dark:text-white">
                                    {currentStudent.student.user.first_name} {currentStudent.student.user.last_name}
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {currentStudent.student.group}
                                </p>
                            </div>
                        )}

                        <Button
                            onClick={handleFinishInterviewClick}
                            disabled={!currentStudent}
                            className="w-full rounded-none bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black py-6 text-base font-medium"
                        >
                            Finish Interview
                        </Button>
                    </div>

                    {/* Remark Field */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <label className="text-sm font-medium mb-2 block dark:text-white">Interview Remark</label>
                        <Textarea
                            placeholder="Add remarks during the interview..."
                            value={currentRemark}
                            onChange={(e) => setCurrentRemark(e.target.value)}
                            className="rounded-none border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white resize-none"
                            rows={3}
                            disabled={!currentStudent}
                        />
                    </div>

                    {/* Search Bar */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 rounded-none border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Queue Lists */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Pre-Listed Queue */}
                        <div>
                            <h3 className="font-semibold mb-3 text-sm dark:text-white">Pre-Listed Queue</h3>
                            <div className="space-y-2">
                                {filteredPrelisted.length > 0 ? (
                                    filteredPrelisted.map((student) => (
                                        <Button
                                            key={student.interviewID}
                                            onClick={() => handleStudentClick(student.interviewID)}
                                            variant="outline"
                                            className={`w-full rounded-none justify-between px-3 py-2 h-auto ${
                                                currentInterviewID === student.interviewID
                                                    ? 'bg-yellow-100 dark:bg-yellow-950 hover:bg-yellow-200 dark:hover:bg-yellow-900 text-black dark:text-white border-yellow-400 dark:border-yellow-700'
                                                    : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700'
                                            }`}
                                        >
                                            <span className="font-medium">
                                                {student.student.user.first_name} {student.student.user.last_name}
                                            </span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {student.student.regNo}
                                            </span>
                                        </Button>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No pre-listed students</p>
                                )}
                            </div>
                        </div>

                        {/* Walk-in Queue */}
                        <div>
                            <h3 className="font-semibold mb-3 text-sm dark:text-white">Walk-in Queue</h3>
                            <div className="space-y-2">
                                {filteredWalkin.length > 0 ? (
                                    filteredWalkin.map((student) => (
                                        <Button
                                            key={student.interviewID}
                                            onClick={() => handleStudentClick(student.interviewID)}
                                            variant="outline"
                                            className={`w-full rounded-none justify-between px-3 py-2 h-auto ${
                                                currentInterviewID === student.interviewID
                                                    ? 'bg-blue-100 dark:bg-blue-950 hover:bg-blue-200 dark:hover:bg-blue-900 text-black dark:text-white border-blue-400 dark:border-blue-700'
                                                    : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700'
                                            }`}
                                        >
                                            <span className="font-medium">
                                                {student.student.user.first_name} {student.student.user.last_name}
                                            </span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {student.student.regNo}
                                            </span>
                                        </Button>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No walk-in students</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interview Comment Dialog */}
            <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
                <DialogContent className="sm:max-w-[600px] rounded-none">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle>Interview Comment</DialogTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-none"
                                onClick={() => setIsCommentDialogOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <DialogDescription>
                            Add a comment on the student for later review.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {currentStudent && (
                        <div className="bg-green-100 dark:bg-green-950 p-4 rounded-none">
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {currentStudent.student.regNo}
                                </span>
                                <Badge className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0 px-2 py-1 rounded-none">
                                    {currentStudent.type === 'walkin' ? 'Walk-in' : `Pre-listed : ${currentStudent.company_preference}`}
                                </Badge>
                            </div>
                            <h3 className="text-xl font-bold mb-1 dark:text-white">
                                {currentStudent.student.user.first_name} {currentStudent.student.user.last_name}
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {currentStudent.student.group}
                            </p>
                        </div>
                    )}
                    
                    <div className="mt-4">
                        <Textarea
                            placeholder="You can leave it blank.."
                            value={interviewComment}
                            onChange={(e) => setInterviewComment(e.target.value)}
                            className="min-h-[150px] rounded-none resize-none"
                        />
                    </div>
                    
                    <div className="flex justify-end mt-4">
                        <Button
                            onClick={handleSubmitInterview}
                            disabled={isSubmittingComment}
                            className="rounded-none bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black px-6 py-2"
                        >
                            {isSubmittingComment ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}