"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/ui/custom/header";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image"; // ✅ default import (fixes your error)

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
];

const mainSponsor = {
    name: "Baurs Pvt Ltd",
    description: "A leading life sciences and agricultural company in Sri Lanka.",
    contactPerson: "Mr. Nimal Perera",
    designation: "HR Manager",
    contact: "+94 77 123 4567",
    location: "Colombo 03, Sri Lanka",
    website: "https://www.baurs.com",
    jobs: [
        "https://via.placeholder.com/300x200?text=Job+1",
        "https://via.placeholder.com/300x200?text=Job+2",
        "https://via.placeholder.com/300x200?text=Job+3",
    ],
};

const getCompanyBadgeClass = (company: string) => {
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

const AnnouncementsPage = () => {
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
        <div className="flex flex-col items-center min-h-screen w-3/4 mx-auto p-4">
            <Header />

            {/* Announcements */}
            <Card className="w-11/12 shadow-sm pb-2 pt-2 bg-gray-100 border-black">
                <div className="flex items-center justify-center w-full pt-4">
                    <h2 className="font-semibold text-4xl [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">
                        Announcements
                    </h2>
                </div>

                <div className="pb-4 px-3">
                    <div className="flex items-center gap-2 mb-5 w-full">
                        <Input
                            placeholder="Search announcements..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-gray-500 bg-white"
                        />
                    </div>

                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Showing {filteredAnnouncements.length} of{" "}
                            {announcementsData.length} announcements
                        </p>
                    </div>

                    <div className="rounded-md border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Title
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        From
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Time
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                        Description
                                    </th>
                                </tr>
                                </thead>
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
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                {a.title}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                <Badge className={getCompanyBadgeClass(a.company)}>
                                                    {a.company}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">{a.time}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                                                <div className="truncate" title={a.description}>
                                                    {a.description}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Companies Section */}
            <Card className="w-11/12 shadow-sm bg-gray-100 border-black m-10">
                <div className="flex items-center justify-center w-full pt-6">
                    <h2 className="font-semibold text-4xl [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">
                        Companies
                    </h2>
                </div>

                {/* Main Sponsor Card with Dialog */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Card className="mt-10 mx-auto w-3/4 shadow-sm bg-gray-100 border-black cursor-pointer hover:shadow-md transition">
                            <div className="flex items-center justify-center w-full py-6">
                                <h3 className="font-semibold text-3xl [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]">
                                    Main Sponsor
                                </h3>
                            </div>
                        </Card>
                    </DialogTrigger>

                    <DialogContent className="w-3/4 max-w-7xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">
                                {mainSponsor.name}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="mt-4 space-y-2 text-sm text-gray-700">
                            <p>{mainSponsor.description}</p>
                            <p>
                                <strong>Contact Person:</strong> {mainSponsor.contactPerson}
                            </p>
                            <p>
                                <strong>Designation:</strong> {mainSponsor.designation}
                            </p>
                            <p>
                                <strong>Contact:</strong> {mainSponsor.contact}
                            </p>
                            <p>
                                <strong>Location:</strong> {mainSponsor.location}
                            </p>
                            <p>
                                <strong>Website:</strong>{" "}
                                <a
                                    href={mainSponsor.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {mainSponsor.website}
                                </a>
                            </p>
                        </div>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {mainSponsor.jobs.map((img, idx) => (
                                <Image
                                    key={idx}
                                    src={img}
                                    alt={`Job ${idx + 1}`}
                                    width={300}
                                    height={200}
                                    className="rounded-md object-cover border border-gray-300"
                                />
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Other Sponsors */}
                <Card className="w-11/12 shadow-sm bg-gray-100 border-black m-10 p-6">
                    {/* Platinum & Gold Sponsors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                        <div className="bg-slate-400 rounded-xl h-40 flex items-center justify-center text-white text-xl font-semibold">
                            Platinum
                        </div>
                        <div className="bg-slate-400 rounded-xl h-40 flex items-center justify-center text-white text-xl font-semibold">
                            Gold
                        </div>
                    </div>

                    {/* Silver Sponsors Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-slate-400 rounded-xl h-28 flex items-center justify-center text-white text-sm font-medium"
                            >
                                Other {i + 1}
                            </div>
                        ))}
                    </div>
                </Card>
            </Card>
        </div>
    );
};

export default AnnouncementsPage;
