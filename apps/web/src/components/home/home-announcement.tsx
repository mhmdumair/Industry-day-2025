"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import api from "@/lib/axios"


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// Database announcement interface
interface Announcement {
    announcementID: string;
    title: string;
    content: string;
    created_at: string;
    audienceType: 'ALL' | 'STUDENTS' | 'COMPANIES';
    postedByUserID: string;
    author_name :string
}

// Function to extract company name from announcement data
const extractCompanyFromAnnouncement = (announcement: Announcement): string => {
    if (announcement.audienceType === 'COMPANIES') return 'Companies';
    if (announcement.audienceType === 'STUDENTS') return 'Students';

    // Try to extract from title
    const titleLower = announcement.title.toLowerCase();
    if (titleLower.includes('siic')) return 'SIIC';
    if (titleLower.includes('mas')) return 'MAS';
    if (titleLower.includes('octave')) return 'Octave';

    return 'General';
};

// Function to format time from database timestamp
const formatTimeFromTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

const getCompanyBadgeClass = (company: string) => {
    switch (company.toLowerCase()) {
        case "siic": return "bg-green-500 border border-green-900 text-white";
        case "mas": return "bg-red-500 border border-red-900 text-white";
        case "octave": return "bg-orange-500 border border-orange-900 text-white";
        case "companies": return "bg-blue-500 border border-blue-900 text-white";
        case "students": return "bg-purple-500 border border-purple-900 text-white";
        default: return "bg-gray-500 border border-gray-900 text-white";
    }
};

const HomeAnnouncement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pageSize = 4;

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
            company: extractCompanyFromAnnouncement(announcement),
            time: formatTimeFromTimestamp(announcement.created_at),
            title: announcement.title,
            description: announcement.content,
            audienceType: announcement.audienceType,
            author_name :announcement.author_name
        }));
    }, [announcements]);

    const filtered = useMemo(() => {
        return transformedAnnouncements.filter(
            (a) =>
                a.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [transformedAnnouncements, searchTerm]);

    const paginated = useMemo(() => {
        const start = page * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page]);

    const totalPages = Math.ceil(filtered.length / pageSize);

    // Loading state
    if (loading) {
        return (
            <div className="w-full h-fit">
                <Card className="w-full bg-slate-100/80 h-fit">
                    <h1 className="font-semibold text-3xl sm:text-3xl lg:text-3xl text-center px-4">Announcements</h1>
                    <CardContent className="flex justify-center py-12">
                        <p className="text-gray-500 text-lg">Loading announcements...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full h-fit">
                <Card className="w-full bg-slate-100/80 h-fit">
                    <CardHeader className="pb-2">
                        <CardTitle className="font-semibold text-3xl sm:text-3xl lg:text-3xl text-center px-4">
                            Announcements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                        <p className="text-red-500 text-lg">Error: {error}</p>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                        >
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full h-fit">
            <Card className="w-full bg-slate-100/80 h-fit">
                <CardHeader className="pb-2">
                    <h2 className="font-semibold text-3xl sm:text-3xl lg:text-3xl text-center px-4">
                        Announcements
                    </h2>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Search */}
                    <div className="flex justify-center w-full">
                        <Input
                            placeholder="Search announcements..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(0);
                            }}
                            className="w-full max-w-md"
                        />
                    </div>

                    {/* Cards Section */}
                    <div className="w-full h-fit">
                        <ScrollArea className=" w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 px-1 pr-3">
                                {paginated.length === 0 ? (
                                    <div className="col-span-full flex justify-center py-12">
                                        <p className="text-gray-500 text-lg">No announcements found.</p>
                                    </div>
                                ) : (
                                    paginated.map((a) => (
                                        <Card key={a.id} className="shadow-lg border border-gray-200/50 bg-white rounded-2xl transition hover:shadow-xl w-full">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between flex-wrap gap-2">
                                                    <Badge className={`${getCompanyBadgeClass(a.company)} text-xs font-medium px-2 py-1`}>
                                                        {a.author_name}
                                                    </Badge>
                                                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                        {a.time}
                                                    </span>
                                                </div>
                                                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 mt-2 leading-tight">
                                                    {a.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                                    {a.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 py-4 border-t border-gray-200">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                                disabled={page === 0}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-gray-600 font-medium">
                                Page {page + 1} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                                disabled={page >= totalPages - 1}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default HomeAnnouncement;