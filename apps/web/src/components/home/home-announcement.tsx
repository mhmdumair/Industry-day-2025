"use client";

import React, { useState, useMemo } from "react";
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

// --- Data Section ---
const announcementsData = [
    { id: 1, company: "SIIC", time: "08.00", title: "Queue Formation Notice", description: "Pre-Listed students please be in your respective queues and ensure you have all required documents ready for the interview process." },
    { id: 2, company: "MAS", time: "13.00", title: "Break Reminder", description: "Be back by 14.00 for the next interview slot" },
    { id: 3, company: "Octave", time: "13.00", title: "Session Break", description: "Be back by 14.00 for the next interview slot. Please use this time to review your portfolio and prepare for technical questions." },
    { id: 4, company: "Octave", time: "13.30", title: "Technical Round Preparation", description: "Candidates should prepare for coding challenges and system design questions in the upcoming session." },
    { id: 5, company: "Octave", time: "14.00", title: "Documentation Check", description: "Please ensure all your certificates and transcripts are properly organized before entering the interview room." },
    { id: 6, company: "Octave", time: "14.15", title: "Final Call", description: "Last call for candidates in the waiting area. Please report to your designated interview rooms immediately." },
    { id: 7, company: "MAS", time: "14.30", title: "Final Round Notice", description: "Final round begins at 15.00 sharp. This will include a presentation component, so please have your materials ready." },
    { id: 8, company: "SIIC", time: "15.00", title: "Document Verification", description: "Bring your CVs and be on time. Original certificates will be verified during this session, so please have them organized and readily accessible." },
];

const getCompanyBadgeClass = (company: string) => {
    switch (company.toLowerCase()) {
        case "siic": return "bg-green-500 border border-green-900 text-white";
        case "mas": return "bg-red-500 border border-red-900 text-white";
        case "octave": return "bg-orange-500 border border-orange-900 text-white";
        default: return "bg-gray-300 text-black";
    }
};

const HomeAnnouncement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const pageSize = 4;

    const filtered = useMemo(() => {
        return announcementsData.filter(
            (a) =>
                a.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const paginated = useMemo(() => {
        const start = page * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page]);

    const totalPages = Math.ceil(filtered.length / pageSize);

    return (
        <div className="w-full h-fit">
            <Card className="w-full bg-slate-100/80 h-fit">
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold">
                        Announcements
                    </CardTitle>
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
                                                        {a.company}
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
