"use client";

import React, { useState, useEffect, Suspense } from "react";
import {Card} from "@/components/ui/card";
import HomeAnnouncement from "../../components/home/home-announcement";
import MainSponsorDialog from "../../components/home/main-sponsor-dialog";
import SponsorDialog from "../../components/home/sponsor-dialog";
import api from "../../lib/axios"


// Interface definitions for data types
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
    logo: string
    stream: string;
    sponsership: "MAIN" | "GOLD" | "SILVER" | "BRONZE";
    location: string;
    companyWebsite: string;
    user: User;
}

export default function AnnouncementsPage() {
    // State to hold companies data, loading status, and any errors
    const [companies, setCompanies] = useState<Sponsor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter sponsors by category for easy rendering
    const mainSponsor = companies.find(company => company.sponsership === "MAIN");
    // The user indicated there are no gold sponsors, but the filter is kept for robustness
    const silverSponsors = companies.filter(company => company.sponsership === "SILVER");
    const bronzeSponsors = companies.filter(company => company.sponsership === "BRONZE");

    // Fetch companies data on component mount
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await api.get('/company');

                if (response.data) {
                    setCompanies(response.data);
                    console.log(response.data);
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

    // Helper function to transform sponsor data for dialog components
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

    // Display loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center min-h-screen w-full mx-auto p-2 sm:p-4">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading companies...</div>
                </div>
            </div>
        );
    }

    // Display error state
    if (error) {
        return (
            <div className="flex flex-col items-center min-h-screen w-full mx-auto p-2 sm:p-4">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-500">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen w-full mx-auto p-2 sm:p-4">
            <div className="h-6 sm:h-10" />

            {/* Home Announcement component */}
            <div className="w-full max-w-6xl px-2 sm:px-0 h-fit">
                <HomeAnnouncement />
            </div>

            <div className="h-6 sm:h-10" />

            {/* Main container card for company display */}
            <Card className="bg-slate-100/80 h-fit w-full max-w-6xl shadow-sm mt-6 sm:mt-10 mx-2 sm:mx-0 text-black flex flex-col items-center">
                <div className="flex items-center justify-center w-full pt-4 sm:pt-6 pb-2 sm:pb-4">
                    <h2 className="font-semibold text-3xl sm:text-2xl lg:text-4xl text-center px-4">Companies</h2>
                </div>

                {/* Main Sponsor section */}
                {mainSponsor && (
                    <div className="flex p-4 sm:p-6 pb-6 sm:pb-8 items-center justify-center w-full">
                        <MainSponsorDialog sponsor={transformSponsorData(mainSponsor)}>
                            <Card className="w-full aspect-square flex items-center min-w-[300px] md:min-w-[350px] justify-center">
                                {mainSponsor.logo ? (
                                    <img
                                        src={`/logo/${mainSponsor.logo}`}
                                        alt={`${mainSponsor.companyName} logo`}
                                        className="max-w-[90%] max-h-[90%] object-contain"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null; // prevents infinite loop
                                            e.currentTarget.src = 'https://placehold.co/300x300/E2E8F0/1E293B?text=Logo';
                                        }}
                                    />
                                ) : (
                                    <span className="text-lg sm:text-xl font-semibold text-center">{mainSponsor.companyName}</span>
                                )}
                            </Card>
                        </MainSponsorDialog>
                    </div>
                )}

                {/* Silver and Bronze Sponsors sections */}
                <div className="w-full p-4 sm:p-6 lg:p-8 bg-transparent border-none shadow-none">
                    {/* Silver Partners grid, handling multiple sponsors without a heading */}
                    {silverSponsors.length > 0 && (
                        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8 lg:mb-10">
                            <div className="flex justify-center items-center gap-6">
                                {silverSponsors.map((sponsor) => (
                                    <SponsorDialog
                                        key={sponsor.companyID}
                                        sponsor={transformSponsorData(sponsor)}
                                        triggerComponent={
                                            <div className="w-[50%] sm:w-[25%] aspect-square bg-gradient-to-br from-slate-50 to-white hover:from-slate-200 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-700 text-xs sm:text-sm font-medium cursor-pointer transition-all duration-200 p-2 sm:p-3 border border-slate-300 shadow-sm hover:shadow-md text-center">
                                                {sponsor.logo ? (
                                                    <img
                                                        src={`/logo/${sponsor.logo}`}
                                                        alt={`${sponsor.companyName} logo`}
                                                        className="max-w-[80%] max-h-[80%] object-contain"
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null; // prevents infinite loop
                                                            e.currentTarget.src = 'https://placehold.co/300x300/E2E8F0/1E293B?text=Logo';
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="line-clamp-2 break-words">{sponsor.companyName}</span>
                                                )}
                                            </div>
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bronze Partners grid, handling multiple sponsors without a heading and with smaller cards */}
                    {bronzeSponsors.length > 0 && (
                        <div className="flex flex-col items-center justify-center">
                            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 w-full justify-items-center">
                                {bronzeSponsors.map((sponsor) => (
                                    <SponsorDialog
                                        key={sponsor.companyID}
                                        sponsor={transformSponsorData(sponsor)}
                                        triggerComponent={
                                            <div className="w-full aspect-square bg-gradient-to-br from-slate-50 to-white hover:from-orange-200 rounded-lg flex items-center justify-center text-orange-800 text-xs font-medium cursor-pointer transition-all duration-200 p-2 border shadow-sm hover:shadow-md text-center">
                                                {sponsor.logo ? (
                                                    <img
                                                        src={`/logo/${sponsor.logo}`}
                                                        alt={`${sponsor.companyName} logo`}
                                                        className="max-w-[80%] max-h-[80%] object-contain"
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null; // prevents infinite loop
                                                            e.currentTarget.src = 'https://placehold.co/300x300/E2E8F0/1E293B?text=Logo';
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="line-clamp-2 break-words text-[10px]">{sponsor.companyName}</span>
                                                )}
                                            </div>
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
