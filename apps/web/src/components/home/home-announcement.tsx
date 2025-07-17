"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Data Section ---

const announcementsData = [
    {
        id: 1,
        title: "Interviews Started",
        company: "SIIC",
        time: "08.00",
        description: "Pre-Listed students please be in your respective queues",
    },
    {
        id: 2,
        title: "Lunch Break",
        company: "MAS Holdings",
        time: "13.00",
        description: "Be back by 14.00 for the next interview slot",
    },
    {
        id: 3,
        title: "Walking Interviews Begin",
        company: "Octave",
        time: "13.00",
        description: "Be back by 14.00 for the next interview slot",
    },
    {
        id: 4,
        title: "Walking Interviews Begin",
        company: "Octave",
        time: "13.00",
        description: "Be back by 14.00 for the next interview slot",
    },
    {
        id: 5,
        title: "Walking Interviews Begin",
        company: "Octave",
        time: "13.00",
        description: "Be back by 14.00 for the next interview slot",
    },
    {
        id: 6,
        title: "Walking Interviews Begin",
        company: "Octave",
        time: "13.00",
        description: "Be back by 14.00 for the next interview slot",
    },
];

const getCompanyBadgeClass = (company) => {
    switch (company.toLowerCase()) {
        case "siic":
            return "bg-green-500 border border-green-900 text-white";
        case "mas holdings":
            return "bg-red-500 border border-red-900 text-white";
        case "octave":
            return "bg-orange-500 border border-orange-900 text-white";
        default:
            return "bg-gray-300 text-black";
    }
};

// --- Component ---

const HomeAnnouncement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("All");

    const companies = useMemo(() => {
        const unique = [...new Set(announcementsData.map((item) => item.company))];
        return ["All", ...unique];
    }, []);

    const filteredAnnouncements = useMemo(() => {
        return announcementsData.filter((a) => {
            const matchesSearch =
                a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCompany =
                selectedCompany === "All" || a.company === selectedCompany;
            return matchesSearch && matchesCompany;
        });
    }, [searchTerm, selectedCompany]);

    return (
        <div className="w-full flex justify-center px-2 sm:px-4 md:px-6 lg:px-12 xl:px-24">
            <div className="max-w-screen-xl w-full">
    <Card className="w-full sm:w-11/12 shadow-sm pb-2 pt-2 bg-gray-100 border border-black flex flex-col items-center">
        {/* Title Section */}
        <div className="flex items-center justify-center w-full sm:w-11/12 pt-4">
                    <h2 className="font-semibold text-2xl sm:text-4xl [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">
                        Announcements
                    </h2>
                </div>

                {/* Search & Info Section */}
                <div className="flex flex-col items-center justify-center pb-4 px-2 sm:px-3 w-full sm:w-11/12">
                    {/* Search Bar */}
                    <div className="flex gap-2 mb-5 w-full items-center justify-center">
                        <Input
                            placeholder="Search announcements..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-gray-500 bg-white"
                        />
                    </div>

                    {/* Result Count */}
                    <div className="flex justify-center mb-4 w-full">
                        <p className="text-xs sm:text-sm text-gray-600">
                            Showing {filteredAnnouncements.length} of {announcementsData.length} announcements
                        </p>
                    </div>

                    {/* Table Section */}
                    <div className="w-full rounded-md border overflow-hidden">
                        {/* Horizontal Scroll Wrapper */}
                        <div className="overflow-x-auto">
                            {/* Table header (not scrollable vertically) */}
                            <table className="min-w-[350px] sm:min-w-[600px] w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                                        Title
                                    </th>
                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                                        From
                                    </th>
                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                                        Time
                                    </th>
                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                                        Description
                                    </th>
                                </tr>
                                </thead>
                            </table>

                            {/* Vertical Scroll for tbody only */}
                            <ScrollArea className="max-h-[180px] sm:max-h-[275px]">
                                <table className="min-w-[350px] sm:min-w-[600px] w-full">
                                    <tbody className="divide-y divide-gray-300 bg-white">
                                    {filteredAnnouncements.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8 text-gray-500">
                                                No announcements found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAnnouncements.map((a) => (
                                            <tr key={a.id} className="hover:bg-gray-50">
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900">
                                                    {a.title}
                                                </td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">
                                                    <Badge className={`${getCompanyBadgeClass(a.company)} text-xs sm:text-sm`}>
                                                        {a.company}
                                                    </Badge>
                                                </td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">{a.time}</div>
                                                </td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 max-w-[100px] sm:max-w-xs">
                                                    <div className="truncate" title={a.description}>
                                                        {a.description}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </Card>
            </div>
        </div>
    );
};

export default HomeAnnouncement;
