"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import HomeAnnouncement from "../../components/home/home-announcement";
import MainSponsorDialog from "../../components/home/main-sponsor-dialog";
import SponsorDialog from "../../components/home/sponsor-dialog";
import HomeNavbar from "@/components/home/home-navbar";

// --- Data Section ---

const mainSponsor = {
    name: "Hemas Consumer Brands",
    description: "Hemas Consumer Brands strives to enrich the consumers lifestyle through innovative, trusted and exceptional products that offer greater satisfaction in everyday use. A leader in the personal care sector, Hemas Brands encompass a range of products for babies and adults in hair care, skin care, toiletries, fragrances and oral care.\n" +
        " \n" +
        "The FMCG sector is one of the bedrocks of the Hemas Group - a sector whose roots reach back to 1962, when we commenced manufacturing eau-de-colognes. In the ensuing years, we have vastly expanded our operations, and boast a wide range of products that rank amongst the best recognized and trusted brands in Sri Lanka.\n" +
        "We are in the business of developing FMCG brands – every function from marketing, innovation, supply-chain, and finance, HR through manufacturing and sales & distribution work towards building strong brands. Strong brands will provide us with the best defense, best source of offence and maximize value to the business.\n" +
        " \n" +
        "We are proud to be a Sri Lankan company, and as a Sri Lankan company have our home-grown strengths that propel us to supersede & compete against both local global businesses. Spreading our wings in the region. We are now a formidable force in Bangladesh, Maldives & export to 15+ nations around the globe.",
    contactPerson: "Mr. Cheranga Weerawardana",
    designation: "Assistant Manager - Talent Acquisition & Employer Branding",
    contact: "+94 766412014",
    location: "Colombo 03, Sri Lanka",
    website: "https://www.hemas.com",
    logo: "/logo/baurs.png",
    jobs: [
        "https://placehold.co/600x400/orange/white",
        "https://placehold.co/600x400/orange/white",
        "https://placehold.co/600x400/orange/white",
    ],
};

// Sample sponsor data - you can replace with actual data
const platinumSponsor = {
    name: "Noritake",
    description: "Leading technology company specializing in innovative solutions for modern businesses. We pride ourselves on delivering exceptional products and services that drive growth and success.",
    contactPerson: "Ms. Sarah Johnson",
    designation: "HR Manager",
    contact: "+94 771234567",
    location: "Colombo 01, Sri Lanka",
    website: "https://www.platinumcompany.com",
    logo: "/logo/noritake.svg",
    category: "Platinum",
    jobs: [
        "https://placehold.co/600x400/orange/white",
        "https://placehold.co/600x400/orange/white",
    ],
};

const silverSponsors = [
    {
        name: "Silver Sponsor 1",
        description: "Innovative startup focused on sustainable technology solutions for environmental challenges.",
        contactPerson: "Ms. Emma Chen",
        contact: "+94 761111111",
        location: "Colombo 03, Sri Lanka",
        website: "https://www.silvercompany1.com",
        logo: "/logo/hemas.png",
        category: "Silver",
        jobs: [
            "https://placehold.co/600x400/orange/white",
            "https://placehold.co/600x400/orange/white",
        ],
    },
    {
        name: "Silver Sponsor 2",
        description: "Healthcare technology company developing cutting-edge medical devices and software solutions.",
        contactPerson: "Dr. Michael Brown",
        contact: "+94 762222222",
        location: "Colombo 04, Sri Lanka",
        website: "https://www.silvercompany2.com",
        logo: "/logo/mas-r.png",
        category: "Silver",
    },
    {
        name: "Silver Sponsor 3",
        description: "E-commerce platform connecting local businesses with global markets through digital transformation.",
        contactPerson: "Ms. Lisa Wang",
        contact: "+94 763333333",
        location: "Colombo 05, Sri Lanka",
        website: "https://www.silvercompany3.com",
        logo: "/logo/aayu-logo.svg",
        category: "Silver",
    },
    {
        name: "Silver Sponsor 4",
        description: "Educational technology company creating innovative learning solutions for students and professionals.",
        contactPerson: "Mr. James Taylor",
        contact: "+94 764444444",
        location: "Colombo 06, Sri Lanka",
        website: "https://www.silvercompany4.com",
        logo: "/logo/liveroom.webp",
        category: "Silver",
    },
    {
        name: "Federation for Environment, Climate and Technology ",
        description: "\"The Federation for Environment, Climate and Technology (FECT) contributes to climate, hydrology, adaptation, information technology, social sciences, and engineering for sustainable development. We undertake research projects on climate and environment and climate adaptation. FECT builds on the work of the officers in Sri Lanka and internationally. Our work is oriented towards developing useable scientific and technological information that can be applied by users in diverse sectors. We work actively with partners in Government institutions, Research Institutes, and Universities. We focus on carrying out quality research to support sustainable development and the advancement of technological capacity for societal welfare. We work around the Indian Ocean particularly in the Islands and have work in Sri Lanka, the Maldives at present and Comoros, Botswana and Zanzibar in the past. \n" +
            "\n" +
            "FECT is seeking interns who can read and write and are pursuing following studies in physical sciences, data sciences, and applied sciences and have long-term interest in geophysics, climate, hydrology, climate impact analysis, is sought to undertake climate and environmental diagnostics, modeling, and prediction systems for water resources and river basin management, air quality, hydropower generation, infectious and respiratory diseases and renewable energy analysis. Our work requires interest in good English writing, transdisciplinary research, and data sciences. Oral, reading and written communication skills in Sinhala, Tamil, Dhivehi or English shall be useful.\"",
        contactPerson: "Ms. Nipuni Alahakoon",
        contact: "+94 81 230 0415",
        designation: "Research Scientist ",
        location: "Colombo 07, Sri Lanka",
        website: "https://www.fect.lk",
        logo: "/logo/fect.png",
        category: "Silver",
    },
    {
        name: "Greentat Hydrogen ",
        description: "\"The Federation for Environment, Climate and Technology (FECT) contributes to climate, hydrology, adaptation, information technology, social sciences, and engineering for sustainable development. We undertake research projects on climate and environment and climate adaptation. FECT builds on the work of the officers in Sri Lanka and internationally. Our work is oriented towards developing useable scientific and technological information that can be applied by users in diverse sectors. We work actively with partners in Government institutions, Research Institutes, and Universities. We focus on carrying out quality research to support sustainable development and the advancement of technological capacity for societal welfare. We work around the Indian Ocean particularly in the Islands and have work in Sri Lanka, the Maldives at present and Comoros, Botswana and Zanzibar in the past. \n" +
            "\n" +
            "FECT is seeking interns who can read and write and are pursuing following studies in physical sciences, data sciences, and applied sciences and have long-term interest in geophysics, climate, hydrology, climate impact analysis, is sought to undertake climate and environmental diagnostics, modeling, and prediction systems for water resources and river basin management, air quality, hydropower generation, infectious and respiratory diseases and renewable energy analysis. Our work requires interest in good English writing, transdisciplinary research, and data sciences. Oral, reading and written communication skills in Sinhala, Tamil, Dhivehi or English shall be useful.\"",
        contactPerson: "Ms. Nipuni Alahakoon",
        contact: "+94 81 230 0415",
        designation: "Research Scientist ",
        location: "Colombo 07, Sri Lanka",
        website: "https://www.fect.lk",
        logo: "/logo/gst.png",
        category: "Silver",
    },
];

// --- Component ---

export default function AnnouncementsPage() {
    return (
        <div className="flex flex-col items-center min-h-screen w-full mx-auto p-2 sm:p-4">
            <HomeNavbar />

            <div className="h-6 sm:h-10" />

            <div className="w-full max-w-6xl px-2 sm:px-0 h-fit">
                <HomeAnnouncement />
            </div>

            <div className="h-6 sm:h-10" />

            <Card className="bg-slate-100/80 h-fit w-full max-w-6xl shadow-sm mt-6 sm:mt-10 mx-2 sm:mx-0 text-black">
                <div className="flex items-center justify-center w-full pt-4 sm:pt-6 pb-2 sm:pb-4">
                    <h2 className="font-semibold text-4xl sm:text-2xl lg:text-4xl text-center px-4">Companies</h2>
                </div>

                {/* Main Sponsor */}
                <div className="flex px-[5vw] sm:px-[7vw] md:px-[10vw] sm:pb-[6vh] items-center justify-center w-full">
                    <MainSponsorDialog sponsor={mainSponsor}>
                        <Card className="w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] aspect-square flex items-center justify-center bg-slate-50">
                            {mainSponsor.logo ? (
                                <img src={mainSponsor.logo} alt={`${mainSponsor.name} logo`} className="max-w-[80%] max-h-[80%] object-contain" />
                            ) : (
                                <span className="text-lg sm:text-xl font-semibold text-center">{mainSponsor.name}</span>
                            )}
                        </Card>
                    </MainSponsorDialog>
                </div>

                {/* Other Sponsors */}
                <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                    <Card className="w-full p-4 sm:p-6 lg:p-8 bg-transparent border-none shadow-none">

                        {/* Premium Partners (Centered Platinum) */}
                        <div className=" sm:mb-8 lg:mb-10 pb-[2vh]">

                            {/* Center the single platinum sponsor */}
                            <div className="flex justify-center">
                                <SponsorDialog
                                    sponsor={platinumSponsor}
                                    triggerComponent={
                                        <div className="bg-slate-50 w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] aspect-square rounded-xl flex flex-col items-center justify-center text-gray-800 text-base sm:text-xl font-semibold cursor-pointer transition-all duration-200 p-4 border border-gray-300 shadow-sm hover:shadow-md">
                                            {platinumSponsor.logo ? (
                                                <img
                                                    src={platinumSponsor.logo}
                                                    alt={`${platinumSponsor.name} logo`}
                                                    className="max-w-[80%] max-h-[80%] object-contain"
                                                />
                                            ) : (
                                                <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">Platinum Partner</span>
                                            )}
                                        </div>
                                    }
                                />
                            </div>
                        </div>

                        {/* Supporting Partners (Silver) */}
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-lg sm:text-xl font-semibold text-center mb-4 sm:mb-6 text-gray-800"></h3>
                            <div className="grid grid-cols-2 grid-rows-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                                {silverSponsors.map((sponsor, i) => (
                                    <SponsorDialog
                                        key={i}
                                        sponsor={sponsor}
                                        triggerComponent={
                                            <div className="w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-700 text-xs sm:text-sm font-medium cursor-pointer transition-all duration-200 p-2 sm:p-3 border border-slate-300 shadow-sm hover:shadow-md text-center">
                                                {sponsor.logo ? (
                                                    <img
                                                        src={sponsor.logo}
                                                        alt={`${sponsor.name} logo`}
                                                        className="max-w-[80%] max-h-[80%] object-contain"
                                                    />
                                                ) : (
                                                    <span className="line-clamp-2 break-words">{sponsor.name}</span>
                                                )}
                                            </div>
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                    </Card>
                </div>

            </Card>
        </div>
    );
}
