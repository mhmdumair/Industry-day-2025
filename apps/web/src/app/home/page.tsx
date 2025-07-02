"use client";
import React, { useState, useMemo } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {Header} from "@/components/ui/custom/header";
import Image from 'next/image';

// Sample announcements data
const announcementsData = [
    {
        id: 1,
        title: "Interviews Started!",
        company: "SIIC",
        time: "08.00",
        description: "Pre-Listed students please be in your respective queues"
    },
    {
        id: 2,
        title: "Lunch Break",
        company: "MAS Holdings",
        time: "13.00",
        description: "Be back by 14.00 for the next interview slot"
    }
]

const AnnouncementsPage = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCompany, setSelectedCompany] = useState("All")

    // Get unique companies for filter
    const companies = useMemo(() => {
        const uniqueCompanies = [...new Set(announcementsData.map(item => item.company))]
        return ["All", ...uniqueCompanies]
    }, [])

    // Filter announcements based on search and company filter
    const filteredAnnouncements = useMemo(() => {
        return announcementsData.filter(announcement => {
            const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                announcement.description.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCompany = selectedCompany === "All" || announcement.company === selectedCompany
            return matchesSearch && matchesCompany
        })
    }, [searchTerm, selectedCompany])


    const getTypeColor = (type) => {
        return 'bg-blue-100 text-blue-800 border border-blue-200 px-2 py-1 rounded-md text-xs font-medium'
    }


    return (
        <div className="flex flex-col justify-center items-center h-full w-full p-4 ">
            <Header></Header>
            {/* Main Content Card */}
            <Card className="w-11/12 shadow-sm pb-0.5 pt-0.5 bg-gray-100 border-black">
                <div className="flex items-center justify-center w-full  pt-4">
                    <h2 className="font-semibold text-xl">Announcements</h2>
                </div>
                <div className="pb-2 pl-3 pr-3">
                    {/* Filters and Controls */}
                    <div className="flex items-center gap-2 mb-5 w-full">
                        {/* Search Input */}
                        <Input
                            placeholder="Search announcements..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-gray-500 bg-white"
                        />
                    </div>

                    {/* Results Summary */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Showing {filteredAnnouncements.length} of {announcementsData.length} announcements
                        </p>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">From</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300 bg-white">
                                {filteredAnnouncements.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-gray-500">
                                            No announcements found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAnnouncements.map((announcement) => (
                                        <tr key={announcement.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                {announcement.title}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    {announcement.company}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    {announcement.time}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                                                <div className="truncate" title={announcement.description}>
                                                    {announcement.description}
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

            {/*<Card className="w-11/12 shadow-sm pb-0.5 pt-0.5 bg-gray-100 border-black mt-3">*/}
            {/*    <div className="flex items-center justify-center w-full  pt-4">*/}
            {/*        <h2 className="font-semibold text-xl">Companies</h2>*/}
            {/*    </div>*/}
            {/*    <Card>*/}
            {/*        <Image src="/assets/baurs.webp" alt="Baurs" width={400} height={300} className="pl-2 justify-center"/>*/}
            {/*    </Card>*/}
            {/*</Card>*/}
        </div>
    )
}

export default AnnouncementsPage