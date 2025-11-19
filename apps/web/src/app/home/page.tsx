"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import HomeAnnouncement from "../../components/home/home-announcement";
import SponsorDialog from "../../components/home/sponsor-dialog";
import api from "../../lib/axios";
import { Spinner } from "@/components/ui/spinner";

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

interface Sponsor {
    companyID: string;
    userID: string;
    companyName: string;
    description: string;
    contactPersonName: string;
    contactPersonDesignation: string;
    contactNumber: string;
    logo: string;
    stream: string;
    sponsership: "MAIN" | "GOLD" | "SILVER" | "BRONZE";
    location: string;
    companyWebsite: string;
    user: User;
}

export default function AnnouncementsPage() {
    const [companies, setCompanies] = useState<Sponsor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);


    const mainSponsor = companies.find(company => company.sponsership === "MAIN");
    const silverSponsors = companies.filter(company => company.sponsership === "SILVER");
    const bronzeSponsors = companies.filter(company => company.sponsership === "BRONZE");


    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get('/company');
                
                if (response.data) {
                    // Filter out sponsors who are marked as GOLD but appear to be missing in the categories below. 
                    // Keeping all data and letting the category filtering handle the display.
                    setCompanies(response.data);
                } else {
                    setError("No companies data received");
                }
            } catch (err) {
                console.error("Error fetching companies:", err);
                setError("Failed to fetch companies data");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);


    const transformSponsorData = (sponsor: Sponsor) => ({
        name: sponsor.companyName,
        description: sponsor.description,
        contactPerson: sponsor.contactPersonName,
        designation: sponsor.contactPersonDesignation,
        contact: sponsor.contactNumber,
        location: sponsor.location,
        website: sponsor.companyWebsite,
        logo: sponsor.logo,
        category: sponsor.sponsership
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner className="h-6 w-auto -mt-30"/>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center min-h-screen w-full mx-auto p-4 bg-background text-foreground">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-500 dark:text-red-400">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Overlay when dialog is open */}
            {dialogOpen && (
                <div className="fixed inset-0 bg-white/50 dark:bg-black/50 z-40" />
            )}

            <div className="flex flex-col items-center min-h-screen w-full mx-auto p-4 bg-background text-foreground">
                {/* Announcements Section */}
                <div className="w-full max-w-6xl mb-6 sm:mb-8">
                    <HomeAnnouncement />
                </div>

                {/* Companies Section */}
                <Card className="w-full max-w-6xl rounded-none border-gray-200 dark:border-gray-800 p-4 sm:p-6 bg-card text-card-foreground">
                    <div className="mb-4">
                        <h2 className="text-xl sm:text-2xl font-semibold">Companies</h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">All the companies participating and their vacancies.</p>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        {/* Main Sponsor - Full width large card */}
                        {mainSponsor && (
                            <div className="flex justify-center">
                                <SponsorDialog
                                    sponsor={transformSponsorData(mainSponsor)}
                                    onOpenChange={setDialogOpen}
                                    triggerComponent={
                                        <div className="w-full aspect-[2/1] sm:aspect-[3/1] bg-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer flex items-center justify-center rounded-none sm:rounded-none border border-gray-200 dark:border-gray-700">
                                            {mainSponsor.logo ? (
                                                <img
                                                    src={`${mainSponsor.logo}`}
                                                    alt={`${mainSponsor.companyName} logo`}
                                                    className="max-w-[60%] sm:max-w-[80%] max-h-[60%] sm:max-h-[80%] object-contain"
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = 'https://placehold.co/400x200/CCCCCC/666666?text=' + mainSponsor.companyName;
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-lg sm:text-2xl font-medium text-gray-600 dark:text-gray-300">
                                                    {mainSponsor.companyName}
                                                </span>
                                            )}
                                        </div>
                                    }
                                />
                            </div>
                        )}

                        {/* Silver Sponsors - Responsive grid */}
                        {silverSponsors.length > 0 && (
                            <div className={`grid gap-4 sm:gap-6 ${
                                silverSponsors.length === 1 
                                    ? 'grid-cols-1 max-w-sm mx-auto' 
                                    : silverSponsors.length === 2 
                                        ? 'grid-cols-2' 
                                        : 'grid-cols-2 sm:grid-cols-3'
                            }`}>
                                {silverSponsors.map((sponsor) => (
                                    <SponsorDialog
                                        key={sponsor.companyID}
                                        sponsor={transformSponsorData(sponsor)}
                                        onOpenChange={setDialogOpen}
                                        triggerComponent={
                                            <div className="aspect-square bg-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center rounded-none sm:rounded-none border border-gray-200 dark:border-gray-700">
                                                {sponsor.logo ? (
                                                    <img
                                                        // 🎯 CHANGE APPLIED HERE: Use sponsor.logo directly
                                                        src={`${sponsor.logo}`}
                                                        alt={`${sponsor.companyName} logo`}
                                                        className="max-w-[60%] sm:max-w-[70%] max-h-[60%] sm:max-h-[70%] object-contain"
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = 'https://placehold.co/300x300/CCCCCC/666666?text=' + sponsor.companyName;
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-sm sm:text-lg font-medium text-gray-600 dark:text-gray-300 text-center px-2 sm:px-4">
                                                        {sponsor.companyName}
                                                    </span>
                                                )}
                                            </div>
                                        }
                                    />
                                ))}
                            </div>
                        )}

                        {/* Bronze Sponsors - Responsive grid */}
                        {bronzeSponsors.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
                                {bronzeSponsors.map((sponsor) => (
                                    <SponsorDialog
                                        key={sponsor.companyID}
                                        sponsor={transformSponsorData(sponsor)}
                                        onOpenChange={setDialogOpen}
                                        triggerComponent={
                                            <div className="aspect-square bg-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center rounded-none sm:rounded-none border border-gray-200 dark:border-gray-700">
                                                {sponsor.logo ? (
                                                    <img
                                                        // 🎯 CHANGE APPLIED HERE: Use sponsor.logo directly
                                                        src={`${sponsor.logo}`}
                                                        alt={`${sponsor.companyName} logo`}
                                                        className="max-w-[50%] sm:max-w-[60%] max-h-[50%] sm:max-h-[60%] object-contain"
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = 'https://placehold.co/200x200/CCCCCC/666666?text=' + sponsor.companyName;
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 text-center px-1 sm:px-2">
                                                        {sponsor.companyName}
                                                    </span>
                                                )}
                                            </div>
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </>
    );
}