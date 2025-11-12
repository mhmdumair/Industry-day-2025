"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import api from "@/lib/axios";

// Database announcement interface
interface Announcement {
    announcementID: string;
    title: string;
    content: string;
    created_at: string;
    audienceType: 'ALL' | 'STUDENTS' | 'COMPANIES';
    postedByUserID: string;
    author_name: string;
}

// Function to extract company name from announcement data
const extractCompanyFromAnnouncement = (announcement: Announcement): string => {
    // Use author_name if available
    if (announcement.author_name) {
        return announcement.author_name;
    }
    
    if (announcement.audienceType === 'COMPANIES') return 'Companies';
    if (announcement.audienceType === 'STUDENTS') return 'Students';

    // Try to extract from title
    const titleLower = announcement.title.toLowerCase();
    if (titleLower.includes('mas')) return 'MAS';
    if (titleLower.includes('siic')) return 'SIIC';
    if (titleLower.includes('aayu')) return 'AAYU';
    if (titleLower.includes('octave')) return 'Octave';

    return 'General';
};

// Function to format time from database timestamp
const formatTimeFromTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).toUpperCase();
};

// Get badge variant based on company
const getCompanyBadgeVariant = (company: string): "default" | "secondary" | "destructive" | "outline" => {
    return "default";
};

// Get badge styling based on company
const getCompanyBadgeClass = (company: string) => {
    const companyLower = company.toLowerCase();
    
    switch (companyLower) {
        case "mas":
            return "bg-red-500 hover:bg-red-600 text-white border-0 rounded-full px-3 py-0.5";
        case "siic":
            return "bg-[#B7EDB6] hover:bg-green-600 text-[#014200] border border-[#014200] rounded-full px-3 py-0.5";
        case "aayu":
            return "bg-orange-500 hover:bg-orange-600 text-white border-0 rounded-full px-3 py-0.5";
        case "octave":
            return "bg-blue-500 hover:bg-blue-600 text-white border-0 rounded-full px-3 py-0.5";
        case "companies":
            return "bg-purple-500 hover:bg-purple-600 text-white border-0 rounded-full px-3 py-0.5";
        case "students":
            return "bg-indigo-500 hover:bg-indigo-600 text-white border-0 rounded-full px-3 py-0.5";
        default:
            return "bg-gray-500 hover:bg-gray-600 text-white border-0 rounded-full px-3 py-0.5";
    }
};

const HomeAnnouncement = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Show 3 items per page like in the image

    // Fetch announcements from database
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/announcement`);
                setAnnouncements(response.data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching announcements:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    // Transform database data to match component format
    const transformedAnnouncements = useMemo(() => {
        return announcements.map(announcement => ({
            id: announcement.announcementID,
            title: announcement.title,
            sentBy: extractCompanyFromAnnouncement(announcement),
            time: formatTimeFromTimestamp(announcement.created_at),
            details: announcement.content,
            audienceType: announcement.audienceType,
        }));
    }, [announcements]);

    // Pagination
    const totalPages = Math.ceil(transformedAnnouncements.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAnnouncements = transformedAnnouncements.slice(startIndex, endIndex);

    // Calculate showing range
    const showingStart = transformedAnnouncements.length === 0 ? 0 : startIndex + 1;
    const showingEnd = Math.min(endIndex, transformedAnnouncements.length);
    const totalCount = transformedAnnouncements.length;

    // Loading state
    if (loading) {
        return (
            <Card className="w-full rounded-none border-gray-200">
                <CardHeader className="pb-3">
                    <div>
                        <h2 className="text-2xl font-semibold">Announcements</h2>
                        <p className="text-sm text-gray-500 mt-1">All announcements are visible here.</p>
                    </div>
                </CardHeader>
                <CardContent className="flex justify-center py-12">
                    <p className="text-gray-500">Loading announcements...</p>
                </CardContent>
            </Card>
        );
    }

    // Error state
    if (error) {
        return (
            <Card className="w-full rounded-none border-gray-200">
                <CardHeader className="pb-3">
                    <div>
                        <h2 className="text-2xl font-semibold">Announcements</h2>
                        <p className="text-sm text-gray-500 mt-1">All announcements are visible here.</p>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                    <p className="text-red-500">Error: {error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        className="rounded-none"
                    >
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full rounded-none border-gray-200 px-5">
            <CardHeader className="pb-3">
                <div>
                    <h2 className="text-2xl font-semibold">Announcements</h2>
                    <p className="text-sm text-gray-500 mt-1">All announcements are visible here.</p>
                </div>
            </CardHeader>
            
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent text-gray-500">
                            <TableHead className="w-[40%] font-medium text-gray-600">Title</TableHead>
                            <TableHead className="w-[10%] font-medium text-gray-600">Sent by</TableHead>
                            <TableHead className="w-[10%] font-medium text-gray-600">Time</TableHead>
                            <TableHead className="w-[40%] font-medium text-gray-600">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentAnnouncements.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    No announcements found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentAnnouncements.map((announcement) => (
                                <TableRow key={announcement.id} className="hover:bg-gray-50/50">
                                    <TableCell className="font-medium align-top py-4">
                                        {announcement.title}
                                    </TableCell>
                                    <TableCell className="align-top py-4">
                                        <Badge
                                            className={getCompanyBadgeClass(announcement.sentBy)}
                                        >
                                            {announcement.sentBy}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-600 align-top py-4 whitespace-nowrap">
                                        {announcement.time}
                                    </TableCell>
                                    <TableCell className="text-gray-700 align-top py-4 whitespace-normal break-words">
                                        {announcement.details}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t">
                    <p className="text-sm text-gray-500">
                        Showing {showingStart}-{showingEnd} of {totalCount} announcements
                    </p>
                    
                    {totalPages > 1 && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious 
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        className={`rounded-none ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                                    />
                                </PaginationItem>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            onClick={() => setCurrentPage(page)}
                                            isActive={currentPage === page}
                                            className="rounded-none cursor-pointer"
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                
                                <PaginationItem>
                                    <PaginationNext 
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        className={`rounded-none ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default HomeAnnouncement;