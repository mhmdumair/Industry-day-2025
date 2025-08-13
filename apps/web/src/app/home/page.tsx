"use client";

import React, { useState, useEffect, Suspense } from "react";
import {Card} from "@/components/ui/card";
import HomeAnnouncement from "../../components/home/home-announcement";
import MainSponsorDialog from "../../components/home/main-sponsor-dialog";
import SponsorDialog from "../../components/home/sponsor-dialog";
import api from "../../lib/axios"


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
    const [companies, setCompanies] = useState<Sponsor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const mainSponsor = companies.find(company => company.sponsership === "MAIN");
    const goldSponsors = companies.filter(company => company.sponsership === "GOLD");
    const silverSponsors = companies.filter(company => company.sponsership === "SILVER");
    const bronzeSponsors = companies.filter(company => company.sponsership === "BRONZE");

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await api.get('/company');

                if (response.data) {
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
            <div className="flex flex-col items-center min-h-screen w-full mx-auto p-2 sm:p-4">            
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading companies...</div>
                </div>
            </div>
        );
    }

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

            <div className="w-full max-w-6xl px-2 sm:px-0 h-fit">
                <HomeAnnouncement />
            </div>

            <div className="h-6 sm:h-10" />

            <Card className="bg-slate-100/80 h-fit w-full max-w-6xl shadow-sm mt-6 sm:mt-10 mx-2 sm:mx-0 text-black flex justify-center items-center">
                <div className="flex items-center justify-center w-full pt-4 sm:pt-6 pb-2 sm:pb-4">
                    <h2 className="font-semibold text-3xl sm:text-2xl lg:text-4xl text-center px-4">Companies</h2>
                </div>

                {/* Main Sponsor */}
                {mainSponsor && (
                    <div className="flex px-[5vw] sm:px-[7vw] md:px-[10vw] sm:pb-[6vh] items-center justify-center w-full">
                        <MainSponsorDialog sponsor={transformSponsorData(mainSponsor)}>
                            <Card className="w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] aspect-square flex items-center justify-center bg-slate-50">
                                {mainSponsor.logo ? (
                                    <img
                                        src={`/logo/${mainSponsor.logo}`}
                                        alt={`${mainSponsor.companyName} logo`}
                                        className="max-w-[80%] max-h-[80%] object-contain"
                                    />


                                ) : (
                                    <span className="text-lg sm:text-xl font-semibold text-center">{mainSponsor.companyName}</span>
                                )}
                            </Card>
                        </MainSponsorDialog>
                    </div>
                )}

                {/* Other Sponsors */}
                <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                    <Card className="w-full p-4 sm:p-6 lg:p-8 bg-transparent border-none shadow-none">
                        {/* Silver Partner */}
                        {silverSponsors.length > 0 && (
                            <div className="mb-6 sm:mb-8 lg:mb-10">
                                <div className="flex justify-center">
                                    <SponsorDialog
                                        sponsor={transformSponsorData(silverSponsors[0])}
                                        triggerComponent={
                                            <div className="w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] aspect-square bg-gradient-to-br bg-white hover:from-slate-200 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-700 text-xs sm:text-sm font-medium cursor-pointer transition-all duration-200 p-2 sm:p-3 border border-slate-300 shadow-sm hover:shadow-md text-center">
                                                {silverSponsors[0].logo ? (
                                                    <img
                                                        src={`/logo/${silverSponsors[0].logo}`}
                                                        alt={`${silverSponsors[0].companyName} logo`}
                                                        className="max-w-[80%] max-h-[80%] object-contain"
                                                    />
                                                ) : (
                                                    <span className="line-clamp-2 break-words">{silverSponsors[0].companyName}</span>
                                                )}
                                            </div>
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {/* Bronze Partners */}
                        {bronzeSponsors.length > 0 && (
                            <div className="flex flex-col items-center justify-center">
                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                                    {bronzeSponsors.map((sponsor) => (
                                        <SponsorDialog
                                            key={sponsor.companyID}
                                            sponsor={transformSponsorData(sponsor)}
                                            triggerComponent={
                                                <div className="w-full aspect-square bg-gradient-to-br bg-white rounded-lg flex items-center justify-center text-orange-800 text-xs font-medium cursor-pointer transition-all duration-200 p-2 border shadow-sm hover:shadow-md text-center">
                                                    {sponsor.logo ? (
                                                        <img
                                                            src={`/logo/${sponsor.logo}`}
                                                            alt={`${sponsor.companyName} logo`}
                                                            className="max-w-[80%] max-h-[80%] object-contain"
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

                    </Card>
                </div>

            </Card>
        </div>
    );

}