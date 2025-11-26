"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Star, Download } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/axios";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface User {
    userID: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
}

interface CompanyDetails {
    companyName: string;
}

interface StudentDetails {
    regNo: string;
}

interface CompanyApiResponse {
    companyName: string;
}

interface StudentApiResponse {
    regNo: string;
}

interface Feedback {
    feedbackID: string;
    comment: string;
    rating: number;
    created_at: string;
    user: User;
    companyDetails?: CompanyDetails;
    studentDetails?: StudentDetails;
}

const MAX_COMMENT_LENGTH = 100;

export default function FeedbackList() {
    const router = useRouter();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState("all");
    const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
    const [exporting, setExporting] = useState<string | null>(null);

    const handleAuthError = () => {
        alert("Session expired. Please login again.");
        router.push("/auth/login");
    };

    useEffect(() => {
        const fetchFeedback = async () => {
            setLoading(true);
            setError(null);
            try {
                let response;
                if (filter === "student") {
                    response = await api.get("/feedback/students");
                } else if (filter === "company") {
                    response = await api.get("/feedback/companies");
                } else {
                    response = await api.get("/feedback");
                }

                const initialFeedbacks: Feedback[] = response.data;

                const feedbacksWithDetails = await Promise.all(
                    initialFeedbacks.map(async (feedback) => {
                        if (feedback.user.role === "company") {
                            try {
                                const companyRes = await api.get(`/company/by-user/${feedback.user.userID}`);
                                feedback.companyDetails = companyRes.data as CompanyApiResponse;
                            } catch {
                                console.error(`Failed to fetch company details for user ${feedback.user.userID}`);
                            }
                        } else if (feedback.user.role === "student") {
                            try {
                                const studentRes = await api.get(`/student/by-user/${feedback.user.userID}`);
                                feedback.studentDetails = studentRes.data as StudentApiResponse;
                            } catch {
                                console.error(`Failed to fetch student details for user ${feedback.user.userID}`);
                            }
                        }
                        return feedback;
                    })
                );

                setFeedbacks(feedbacksWithDetails);
            } catch (err) {
                const axiosError = err as AxiosError;
                if (axiosError.response?.status === 401) {
                    handleAuthError();
                } else {
                    console.error("Failed to fetch feedback:", err);
                    setError("Failed to load feedback data. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [filter]);

    const filteredFeedbacks = feedbacks.filter((feedback) => {
        if (filter === "all") return true;
        return feedback.user.role === filter;
    });

    const toggleExpand = (feedbackID: string) => {
        setExpandedComments(prev => ({
            ...prev,
            [feedbackID]: !prev[feedbackID],
        }));
    };
    
    const exportFeedbackToCSV = (role: 'student' | 'company') => {
        setExporting(role);
        try {
            const dataToExport = feedbacks.filter(f => f.user.role === role);

            const headers = [
                "Submitter First Name",
                "Submitter Last Name",
                "Submitter Email",
                "Associated Detail",
                "Rating (1-5)",
                "Comment",
                "Date Submitted",
            ];

            const rows = dataToExport.map(f => {
                const associatedDetail = role === 'company'
                    ? f.companyDetails?.companyName || "N/A"
                    : f.studentDetails?.regNo || "N/A";
                
                return [
                    f.user.first_name,
                    f.user.last_name,
                    f.user.email,
                    associatedDetail,
                    f.rating,
                    f.comment,
                    format(new Date(f.created_at), "yyyy-MM-dd HH:mm:ss"),
                ];
            });

            const csvContent = [
                headers.join(","),
                ...rows.map(row =>
                    row.map(cell => {
                        const cellStr = String(cell || "").replace(/"/g, '""');
                        if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
                            return `"${cellStr}"`;
                        }
                        return cellStr;
                    }).join(",")
                )
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            
            const timestamp = format(new Date(), "yyyyMMdd_HHmmss");
            const filename = `${role}-feedback-report-${timestamp}.csv`;

            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(`Export failed for ${role}:`, error);
            setError(`Failed to export ${role} feedback data.`);
        } finally {
            setExporting(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8 min-h-[400px] items-center">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center p-8">
                <Alert variant="destructive" className="rounded-none">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <Card className="m-4 rounded-none dark:bg-black">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-3xl font-bold">All Feedback</CardTitle>
                        <CardDescription>
                            View and manage feedback from all users.
                        </CardDescription>
                    </div>
                    <div className="flex flex-col md:flex-row items-end md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <Button
                            onClick={() => exportFeedbackToCSV('student')}
                            disabled={exporting === 'student' || feedbacks.filter(f => f.user.role === 'student').length === 0}
                            className="rounded-none w-full md:w-auto"
                            variant="secondary"
                        >
                            {exporting === 'student' ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Download className="h-4 w-4 mr-2" />
                            )}
                            Download Student Feedback
                        </Button>
                        <Button
                            onClick={() => exportFeedbackToCSV('company')}
                            disabled={exporting === 'company' || feedbacks.filter(f => f.user.role === 'company').length === 0}
                            className="rounded-none w-full md:w-auto"
                            variant="secondary"
                        >
                            {exporting === 'company' ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Download className="h-4 w-4 mr-2" />
                            )}
                            Download Company Feedback
                        </Button>
                        
                        <div className="flex items-center space-x-2 pt-2 md:pt-0">
                            <Label className="hidden sm:block">Filter by Role:</Label>
                            <Select onValueChange={setFilter} defaultValue="all">
                                <SelectTrigger className="w-[180px] rounded-none">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all" className="rounded-none">All</SelectItem>
                                    <SelectItem value="student" className="rounded-none">Students</SelectItem>
                                    <SelectItem value="company" className="rounded-none">Companies</SelectItem>
                                    <SelectItem value="room_admin" className="rounded-none">Room Admins</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {filteredFeedbacks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-muted-foreground">
                        <Star className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold">No Feedback Found</h3>
                        <p className="mt-2 text-center max-w-sm">
                            It seems there&apos;s no feedback to display for the selected filter.
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead className="min-w-[150px]">Comment</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredFeedbacks.map((feedback) => {
                                const isExpanded = expandedComments[feedback.feedbackID];
                                const isTruncated = feedback.comment.length > MAX_COMMENT_LENGTH;
                                const displayedComment = isExpanded || !isTruncated
                                    ? feedback.comment
                                    : `${feedback.comment.substring(0, MAX_COMMENT_LENGTH)}...`;

                                return (
                                    <TableRow key={feedback.feedbackID}>
                                        <TableCell className="font-medium">
                                            <p>
                                                {feedback.user.first_name} {feedback.user.last_name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {feedback.user.role === "company" &&
                                                    `Company: ${feedback.companyDetails?.companyName || "N/A"}`}
                                                {feedback.user.role === "student" &&
                                                    `Index No: ${feedback.studentDetails?.regNo || "N/A"}`}
                                                {feedback.user.role === "room_admin" &&
                                                    `Email: ${feedback.user.email}`}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    feedback.user.role === "student" ? "default" : "secondary"
                                                }
                                                className="rounded-none"
                                            >
                                                {feedback.user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${
                                                            i < feedback.rating ? "text-primary" : "text-muted-foreground"
                                                        }`}
                                                        fill={i < feedback.rating ? "currentColor" : "none"}
                                                    />
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                            <span>
                                                {displayedComment}
                                            </span>
                                            {isTruncated && (
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    onClick={() => toggleExpand(feedback.feedbackID)}
                                                    className="p-0 h-auto ml-2 rounded-none"
                                                >
                                                    {isExpanded ? "Show Less" : "Show More"}
                                                </Button>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {format(new Date(feedback.created_at), "PPP")}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}