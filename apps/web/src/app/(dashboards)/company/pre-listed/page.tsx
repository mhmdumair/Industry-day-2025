"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2, X, Users, Trash2 } from "lucide-react";
import api from "../../../../lib/axios";

interface User {
    userID: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
    created_at: string;
    updated_at: string;
}

interface Student {
    studentID: string;
    userID: string;
    regNo: string;
    nic: string;
    linkedin: string | null;
    contact: string;
    group: string;
    level: string;
    created_at: string;
    user: User;
}

interface Interview {
    interviewID: string;
    studentID: string;
    companyID: string;
    stallID: string | null;
    type: string;
    status: string;
    student_preference: number;
    company_preference: number;
    remark: string | null;
    student: Student;
}

export default function CompanyFilter() {
    const [tempStudents, setTempStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [preListedStudents, setPreListedStudents] = useState<Student[]>([]);
    const [existingPreListedStudents, setExistingPreListedStudents] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingExisting, setLoadingExisting] = useState(false);
    const [removingStudents, setRemovingStudents] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);
    const [companyId, setCompanyId] = useState<string | null>(null);

    // Extract companyId from URL and trigger fetch only when valid
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const companyIdFromUrl = urlParams.get('companyId');

        if (companyIdFromUrl) {
            setCompanyId(companyIdFromUrl);
        } else {
            setError('Company ID not found in URL parameters');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (companyId) {
            fetchStudentsData();
            fetchExistingPreListedStudents();
        }
    }, [companyId]);

    // Debug: Log preListedStudents whenever it changes
    useEffect(() => {
        console.log('preListedStudents updated:', preListedStudents);
    }, [preListedStudents]);

    const fetchStudentsData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/student');
            setTempStudents(response.data);
        } catch (err: any) {
            let errorMessage = 'Failed to fetch students data';
            if (err.response) {
                errorMessage = `Server Error: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`;
            } else if (err.request) {
                errorMessage = 'Network Error: No response from server';
            } else {
                errorMessage = err.message || 'Unknown error occurred';
            }
            setError(errorMessage);
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchExistingPreListedStudents = async () => {
        if (!companyId) return;

        try {
            setLoadingExisting(true);
            // Fetch pre-listed interviews for this company using dedicated endpoint
            const response = await api.get(`/interview/company/${companyId}/prelisted`);
            setExistingPreListedStudents(response.data);
        } catch (err: any) {
            console.error('Error fetching existing pre-listed students:', err);
            // Don't show error for this as it's secondary functionality
        } finally {
            setLoadingExisting(false);
        }
    };

    const filteredStudents = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();
        if (!search) return [];

        return tempStudents.filter((student) => {
            const fullName = `${student.user.first_name} ${student.user.last_name}`.toLowerCase();
            return (
                fullName.includes(search) ||
                student.regNo.toLowerCase().includes(search) ||
                student.user.email.toLowerCase().includes(search) ||
                student.group.toLowerCase().includes(search) ||
                student.level.toLowerCase().includes(search)
            );
        });
    }, [searchTerm, tempStudents]);

    const isAlreadyPreListed = (id: string) =>
        preListedStudents.some(s => s.studentID === id) ||
        existingPreListedStudents.some(i => i.studentID === id);

    const addToPreList = (student: Student) => {
        console.log('Adding student to pre-list:', student.user.first_name, student.user.last_name);
        console.log('Current preListedStudents before adding:', preListedStudents.length);
        
        if (!isAlreadyPreListed(student.studentID)) {
            setPreListedStudents(prev => {
                const newList = [...prev, student];
                console.log('New preListedStudents length will be:', newList.length);
                return newList;
            });
            setSearchTerm('');
        } else {
            console.log('Student already in pre-list');
        }
    };

    const removeFromPreList = (studentID: string) => {
        console.log('Removing student from pre-list:', studentID);
        setPreListedStudents(prev => {
            const newList = prev.filter(s => s.studentID !== studentID);
            console.log('PreListedStudents length after removal:', newList.length);
            return newList;
        });
    };

    const removeExistingPreListedStudent = async (interviewID: string) => {
        try {
            setRemovingStudents(prev => new Set(prev).add(interviewID));
            
            // Use the new endpoint that handles preference adjustment
            await api.delete(`/interview/prelisted/${interviewID}`);
            
            // Refresh the existing pre-listed students list to get updated preferences
            await fetchExistingPreListedStudents();
        } catch (err: any) {
            console.error('Error removing pre-listed student:', err);
            // You might want to show a toast notification here
        } finally {
            setRemovingStudents(prev => {
                const newSet = new Set(prev);
                newSet.delete(interviewID);
                return newSet;
            });
        }
    };

    const confirmPreListedStudents = async () => {
        if (preListedStudents.length === 0 || !companyId) return;

        try {
            setLoading(true);

            // Get the current highest company_preference to continue numbering
            const startingPreference = existingPreListedStudents.length + 1;

            const bulkInterviewData = preListedStudents.map((student, index) => ({
                studentID: student.studentID,
                companyID: companyId,
                stallID: null, // Assigned later
                type: "pre-listed",
                status: "scheduled",
                student_preference: 999,
                company_preference: startingPreference + index, // Continue from existing count
                remark: null,
            }));

            const response = await api.post('/interview/bulk', bulkInterviewData);

            console.log(bulkInterviewData);
            console.log('Bulk interview creation response:', response.data);

            setPreListedStudents([]);
            // Refresh the existing pre-listed students list
            await fetchExistingPreListedStudents();
        } catch (err: any) {
            let errorMessage = 'Failed to create interviews';
            if (err.response) {
                errorMessage = `Server Error: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`;
            } else if (err.request) {
                errorMessage = 'Network Error: No response from server';
            } else {
                errorMessage = err.message || 'Unknown error occurred';
            }
            console.error('Error creating bulk interviews:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="mt-3 w-screen mx-auto p-4 flex flex-col items-center justify-center gap-5">
                <Card className="bg-slate-100/80 w-11/12 max-w-2xl rounded-lg shadow-md p-6 text-black">
                    <CardHeader className="text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        <CardTitle>Loading Students...</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-3 w-screen mx-auto p-4 flex flex-col items-center justify-center gap-5">
                <Card className="bg-red-100/80 w-11/12 max-w-2xl rounded-lg shadow-md p-6 text-black">
                    <CardHeader className="text-center">
                        <CardTitle className="text-red-600">Error Loading Students</CardTitle>
                        <CardDescription className="mt-2">{error}</CardDescription>
                        <Button
                            onClick={fetchStudentsData}
                            className="mt-4 bg-red-200 hover:bg-red-300 text-red-800"
                        >
                            Retry Loading Students
                        </Button>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="mt-3 w-screen mx-auto p-4 flex flex-col items-center justify-center gap-5">
            <div className="flex justify-center w-11/12 p-4">
                <Card className="bg-slate-100/80 w-11/12 max-w-2xl rounded-lg shadow-md p-6 text-black space-y-4">
                    <CardHeader className="text-center text-xl font-semibold text-black">Pre-List Students</CardHeader>
                    <CardContent>
                        {/* Debug Info */}
                        <div className="mb-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
                            Debug: Pre-listed count: {preListedStudents.length} | Existing count: {existingPreListedStudents.length}
                        </div>

                        {/* Search Form */}
                        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col md:flex-row w-full gap-2 pb-2">
                            <Input
                                placeholder="Search by name, reg no, email, group, or level..."
                                className="w-full border border-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button
                                className="w-full md:w-1/4 bg-slate-200/80 border border-black text-black hover:bg-slate-300"
                                variant="outline"
                                onClick={() => {}}
                            >
                                <Search size={16} />
                            </Button>
                        </form>

                        {/* Search Results */}
                        {filteredStudents.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {filteredStudents.slice(0, 5).map((student) => (
                                    <Card key={student.studentID} className="bg-teal-100/80 border border-teal-600 text-black">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <CardTitle className="text-sm font-medium">
                                                        {student.user.first_name} {student.user.last_name}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs mt-1">
                                                        {student.regNo} • {student.group} • {student.level.replace('_', ' ')}
                                                    </CardDescription>
                                                    <CardDescription className="text-xs">
                                                        {student.user.email}
                                                    </CardDescription>
                                                </div>
                                                <Button
                                                    className="bg-teal-600 hover:bg-teal-700 text-white border-0 ml-2"
                                                    size="sm"
                                                    onClick={() => addToPreList(student)}
                                                    disabled={isAlreadyPreListed(student.studentID)}
                                                >
                                                    <Plus size={14} />
                                                    {isAlreadyPreListed(student.studentID) ? 'Added' : 'Add'}
                                                </Button>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))}
                                {filteredStudents.length > 5 && (
                                    <p className="text-sm text-gray-600 text-center">
                                        Showing first 5 of {filteredStudents.length} results. Refine your search to see more.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* No results */}
                        {searchTerm && filteredStudents.length === 0 && tempStudents.length > 0 && (
                            <Card className="bg-yellow-100/80 border border-yellow-600 text-black mb-4">
                                <CardHeader>
                                    <CardTitle className="text-sm">No students found</CardTitle>
                                    <CardDescription>Try adjusting your search terms</CardDescription>
                                </CardHeader>
                            </Card>
                        )}

                        {/* Pre-Listed Students (Pending Confirmation) */}
                        <Card className="flex flex-col gap-3 p-4 mt-3 mb-3 bg-slate-100/80">
                            <h3 className="font-semibold mb-2">Pre-Listed Students - Pending ({preListedStudents.length})</h3>
                            {preListedStudents.length > 0 ? (
                                preListedStudents.map((student, index) => (
                                    <div key={student.studentID} className="flex justify-between items-center bg-white p-3 rounded-lg border">
                                        <div className="flex items-start gap-4">
                                            {/* Left: Future Preference Number */}
                                            <div className="w-8 text-sm font-medium mt-1 text-center text-blue-600">
                                                {existingPreListedStudents.length + index + 1}.
                                            </div>
                                            
                                            {/* Right: Info */}
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">
                                                    {student.user.first_name} {student.user.last_name}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {student.regNo} • {student.group} • {student.level.split('_')[1]?.concat('000L') || student.level}
                                                </div>
                                                <div className="text-xs text-blue-600 font-medium mt-1">
                                                    Pending confirmation
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            className="bg-red-200 text-red-700 border border-red-400 hover:bg-red-300"
                                            size="sm"
                                            onClick={() => removeFromPreList(student.studentID)}
                                        >
                                            <X size={14} />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Search and add students to create your pre-list
                                </p>
                            )}
                        </Card>

                        {/* Confirmation Button */}
                        <Card className="flex items-center justify-center bg-slate-100/80 border">
                            <Button
                                className="w-11/12 mt-2 bg-blue-200/80 border border-blue-400 text-black hover:bg-slate-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                variant="outline"
                                onClick={confirmPreListedStudents}
                                disabled={preListedStudents.length === 0 || loading || !companyId}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Creating Interviews...
                                    </>
                                ) : (
                                    `Confirm Pre-Listed Students (${preListedStudents.length})`
                                )}
                            </Button>
                        </Card>
                    </CardContent>
                </Card>
            </div>

            {/* Existing Pre-Listed Students Card */}
            <div className="flex justify-center w-11/12 p-4">
                <Card className="bg-slate-100/80 w-11/12 max-w-2xl rounded-lg shadow-md p-6 text-black space-y-4">
                    <CardHeader className="text-center text-xl font-semibold text-black flex flex-row items-center justify-center gap-2">
                        Pre-Listed Students
                    </CardHeader>
                    <CardContent>
                        {loadingExisting ? (
                            <div className="flex items-center justify-center p-6">
                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                <span>Loading existing pre-listed students...</span>
                            </div>
                        ) : existingPreListedStudents.length > 0 ? (
                            <div className="space-y-3">
                                <h3 className="font-semibold mb-3">
                                    Total Pre-listed Students: {existingPreListedStudents.length}
                                </h3>
                                {existingPreListedStudents.map((interview) => (
                                    <div key={interview.interviewID} className="flex justify-between items-center bg-white p-3 rounded-lg border">
                                        <div className="flex items-start gap-4">
                                            {/* Left: Preference (Centered) */}
                                            <div className="w-8 text-sm font-medium mt-1 text-center">
                                                {interview.company_preference}.
                                            </div>

                                            {/* Right: Info */}
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">
                                                    {interview.student.user.first_name} {interview.student.user.last_name}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {interview.student.regNo} • {interview.student.group} • {interview.student.level.split('_')[1]?.concat('000L') || interview.student.level}
                                                </div>
                                                <div className="text-xs text-green-600 font-medium mt-1">
                                                    Status: {interview.status}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            className="bg-red-200 text-red-700 border border-red-400 hover:bg-red-300"
                                            size="sm"
                                            onClick={() => removeExistingPreListedStudent(interview.interviewID)}
                                            disabled={removingStudents.has(interview.interviewID)}
                                        >
                                            {removingStudents.has(interview.interviewID) ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <X size={14} />
                                            )}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Card className="flex flex-col gap-2 p-4 bg-white/50">
                                <h3 className="font-semibold mb-2 text-center text-gray-600">No Confirmed Pre-Listed Students</h3>
                                <p className="text-sm text-gray-500 text-center">
                                    Students you confirm above will appear here
                                </p>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}