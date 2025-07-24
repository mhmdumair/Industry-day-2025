"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';


// --- Data Section ---

const announcementsData = [
    { id: 1, company: "SIIC", time: "08.00", description: "Pre-Listed students please be in your respective queues" },
    { id: 2, company: "MAS", time: "13.00", description: "Be back by 14.00 for the next interview slot" },
    { id: 3, company: "Octave", time: "13.00", description: "Be back by 14.00 for the next interview slot" },
    { id: 4, company: "Octave", time: "13.00", description: "Be back by 14.00 for the next interview slot" },
    { id: 5, company: "Octave", time: "13.00", description: "Be back by 14.00 for the next interview slot" },
    { id: 6, company: "Octave", time: "13.00", description: "Be back by 14.00 for the next interview slot" },
    { id: 7, company: "MAS", time: "14.30", description: "Final round begins at 15.00 sharp" },
    { id: 8, company: "SIIC", time: "15.00", description: "Bring your CVs and be on time" },
];

const getCompanyBadgeClass = (company: string) => {
    switch (company.toLowerCase()) {
        case "siic":
            return "bg-green-500 border border-green-900 text-white";
        case "mas":
            return "bg-red-500 border border-red-900 text-white";
        case "octave":
            return "bg-orange-500 border border-orange-900 text-white";
        default:
            return "bg-gray-300 text-black";
    }
};

const HomeAnnouncement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const pageSize = 5;

    const filtered = useMemo(() => {
        return announcementsData.filter(
            (a) =>
                a.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const paginated = useMemo(() => {
        const start = page * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page]);

    const totalPages = Math.ceil(filtered.length / pageSize);

    return (
        <Card className="w-full max-w-6xl mx-auto bg-slate-100/80">
            <CardHeader>
                <CardTitle className="text-3xl sm:text-2xl lg:text-3xl text-center">Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Search Bar */}
                <div className="flex items-center justify-between ">
                    <Input
                        placeholder="Search announcements..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0); // Reset page on search
                        }}
                        className="max-w-sm "
                    />
                </div>

                {/* Table */}
                <div className="rounded-md border">
                    <ScrollArea className="max-h-[280px]">
                        <table className="w-full table-fixed">
                            <thead className="bg-gray-200">
                            <tr>
                                <th className="w-1/4 px-4 py-2 text-left text-sm font-semibold text-gray-900">From</th>
                                <th className="w-1/4 px-4 py-2 text-left text-sm font-semibold text-gray-900">Time</th>
                                <th className="w-1/2 px-4 py-2 text-left text-sm font-semibold text-gray-900">Description</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-300 bg-white">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-8 text-gray-500">
                                        No announcements found.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((a) => (
                                    <tr key={a.id} className="hover:bg-gray-100">
                                        <td className="px-4 py-2 text-sm">
                                            <Badge className={`${getCompanyBadgeClass(a.company)} text-xs`}>{a.company}</Badge>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-600">{a.time}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600 truncate" title={a.description}>
                                            {a.description}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </ScrollArea>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-2 py-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(p - 1, 0))}
                        disabled={page === 0}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-gray-600">
            Page {page + 1} of {totalPages || 1}
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
            </CardContent>
        </Card>
    );
};

export default HomeAnnouncement;