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
        company: "SIIC",
        time: "08.00",
        description: "Pre-Listed students please be in your respective queues",
    },
    {
        id: 2,
        company: "MAS",
        time: "13.00",
        description: "Be back by 14.00 for the next interview slot",
    },
    {
        id: 3,
        company: "Octave",
        time: "13.00",
        description: "Be back by 14.00 for the next interview slot",
    },
    {
        id: 4,
        company: "Octave",
        time: "13.00",
        description: "Be back by 14.00 for the next interview slot",
    },
    {
        id: 5,
        company: "Octave",
        time: "13.00",
        description: "Be back by 14.00 for the next interview slot",
    },
    {
        id: 6,
        company: "Octave",
        time: "13.00",
        description: "Be back by 14.00 for the next interview slot",
    },
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
    const [selectedCompany, setSelectedCompany] = useState("All");

    const companies = useMemo(() => {
        const unique = [...new Set(announcementsData.map((item) => item.company))];
        return ["All", ...unique];
    }, []);

    const filteredAnnouncements = useMemo(() => {
        return announcementsData.filter((a) => {
            const matchesSearch =
                a.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCompany =
                selectedCompany === "All" || a.company === selectedCompany;
            return matchesSearch && matchesCompany;
        });
    }, [searchTerm, selectedCompany]);

    return (
        <div className="overflow-x-auto w-3/4">
            <table className="min-w-[350px] sm:min-w-[600px] w-full">
                <thead className="bg-gray-200">
                <tr>
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

            <ScrollArea className="max-h-[200px] sm:max-h-[275px]">
                <table className="min-w-[350px] sm:min-w-[600px] w-full">
                    <tbody className="divide-y divide-gray-300 bg-white">
                    {filteredAnnouncements.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="text-center py-8 text-gray-500">
                                No announcements found
                            </td>
                        </tr>
                    ) : (
                        filteredAnnouncements.map((a) => (
                            <tr key={a.id} className="hover:bg-gray-100">
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                                    <Badge
                                        className={`${getCompanyBadgeClass(
                                            a.company
                                        )} text-xs sm:text-sm`}
                                    >
                                        {a.company}
                                    </Badge>
                                </td>
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">
                                    {a.time}
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
    );
};

export default HomeAnnouncement;
