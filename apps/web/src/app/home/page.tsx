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
    logo: "/hemas.png",
    jobs: [
        "https://via.placeholder.com/300x200?text=Job+1",
        "https://via.placeholder.com/300x200?text=Job+2",
        "https://via.placeholder.com/300x200?text=Job+3",
    ],
};

// Sample sponsor data - you can replace with actual data
const platinumSponsor = {
    name: "Platinum Sponsor Company",
    description: "Leading technology company specializing in innovative solutions for modern businesses. We pride ourselves on delivering exceptional products and services that drive growth and success.",
    contactPerson: "Ms. Sarah Johnson",
    designation: "HR Manager",
    contact: "+94 771234567",
    location: "Colombo 01, Sri Lanka",
    website: "https://www.platinumcompany.com",
    logo: "/baurs.webp",
    category: "Platinum",
    jobs: [
        "https://via.placeholder.com/300x200?text=Software+Engineer",
        "https://via.placeholder.com/300x200?text=Data+Analyst",
    ],
};

const goldSponsor = {
    name: "Gold Sponsor Company",
    description: "Established financial services company with over 25 years of experience in providing comprehensive banking and investment solutions.",
    contactPerson: "Mr. David Wilson",
    designation: "Talent Acquisition Specialist",
    contact: "+94 779876543",
    location: "Colombo 02, Sri Lanka",
    website: "https://www.goldcompany.com",
    logo: "/assets/gold-logo.png",
    category: "Gold",
    jobs: [
        "https://via.placeholder.com/300x200?text=Financial+Analyst",
        "https://via.placeholder.com/300x200?text=Customer+Service",
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
        category: "Silver",
    },
    {
        name: "Silver Sponsor 2",
        description: "Healthcare technology company developing cutting-edge medical devices and software solutions.",
        contactPerson: "Dr. Michael Brown",
        contact: "+94 762222222",
        location: "Colombo 04, Sri Lanka",
        website: "https://www.silvercompany2.com",
        category: "Silver",
    },
    {
        name: "Silver Sponsor 3",
        description: "E-commerce platform connecting local businesses with global markets through digital transformation.",
        contactPerson: "Ms. Lisa Wang",
        contact: "+94 763333333",
        location: "Colombo 05, Sri Lanka",
        website: "https://www.silvercompany3.com",
        category: "Silver",
    },
    {
        name: "Silver Sponsor 4",
        description: "Educational technology company creating innovative learning solutions for students and professionals.",
        contactPerson: "Mr. James Taylor",
        contact: "+94 764444444",
        location: "Colombo 06, Sri Lanka",
        website: "https://www.silvercompany4.com",
        category: "Silver",
    },
    {
        name: "Silver Sponsor 5",
        description: "Renewable energy company specializing in solar and wind power solutions for residential and commercial use.",
        contactPerson: "Ms. Rachel Green",
        contact: "+94 765555555",
        location: "Colombo 07, Sri Lanka",
        website: "https://www.silvercompany5.com",
        category: "Silver",
    },
    {
        name: "Silver Sponsor 6",
        description: "Digital marketing agency helping businesses build strong online presence and drive customer engagement.",
        contactPerson: "Mr. Alex Rodriguez",
        contact: "+94 766666666",
        location: "Colombo 08, Sri Lanka",
        website: "https://www.silvercompany6.com",
        category: "Silver",
    },
];

// --- Component ---

const AnnouncementsPage = () => {
    return (
        <div className="flex flex-col items-center min-h-screen w-full mx-auto p-2 sm:p-4">
            <HomeNavbar />

            {/* Responsive spacer */}
            <div className="h-6 sm:h-10"></div>

            {/* Announcements - Full width on mobile */}
            <div className="w-full max-w-6xl px-2 sm:px-0">
                <HomeAnnouncement />
            </div>

            {/* Companies Section */}
            <Card className="
                w-full max-w-6xl
                shadow-sm bg-gray-100
                mt-6 sm:mt-10
                mx-2 sm:mx-0
                text-black
            ">
                {/* Section Header */}
                <div className="flex items-center justify-center w-full pt-4 sm:pt-6 pb-2 sm:pb-4">
                    <h2 className="
                        font-semibold
                        text-4xl sm:text-2xl lg:text-4xl
                        text-center
                        px-4
                    ">
                        Companies
                    </h2>
                </div>

                {/* Main Sponsor - Responsive container */}
                <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                    <MainSponsorDialog sponsor={mainSponsor}>
                        <div className="
                            w-full h-32 sm:h-40 lg:h-48
                            flex items-center justify-center
                            p-4 sm:p-6
                            bg-white rounded-xl shadow-sm
                            hover:shadow-md transition-shadow duration-200
                            border border-gray-200
                        ">
                            {mainSponsor.logo ? (
                                <img
                                    src={mainSponsor.logo}
                                    alt={`${mainSponsor.name} logo`}
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : (
                                <span className="text-lg sm:text-xl font-semibold text-center">
                                    {mainSponsor.name}
                                </span>
                            )}
                        </div>
                    </MainSponsorDialog>
                </div>

                {/* Other Sponsors Container */}
                <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                    <Card className="
                        w-full shadow-sm bg-white
                        p-4 sm:p-6 lg:p-8
                        border border-gray-200
                    ">
                        {/* Platinum & Gold Sponsors */}
                        <div className="mb-6 sm:mb-8 lg:mb-10">
                            <h3 className="
                                text-lg sm:text-xl font-semibold
                                text-center mb-4 sm:mb-6
                                text-gray-800
                            ">
                                Premium Partners
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {/* Platinum Sponsor */}
                                <SponsorDialog
                                    sponsor={platinumSponsor}
                                    triggerComponent={
                                        <div className="
                                            bg-gradient-to-br from-gray-100 to-gray-200
                                            hover:from-gray-200 hover:to-gray-300
                                            rounded-xl
                                            h-32 sm:h-40
                                            flex flex-col items-center justify-center
                                            text-gray-800
                                            text-base sm:text-xl font-semibold
                                            cursor-pointer
                                            transition-all duration-200
                                            p-4
                                            border border-gray-300
                                            shadow-sm hover:shadow-md
                                        ">
                                            {platinumSponsor.logo ? (
                                                <div className="flex flex-col items-center justify-center h-full">
                                                    <img
                                                        src={platinumSponsor.logo}
                                                        alt={`${platinumSponsor.name} logo`}
                                                        className="max-w-full max-h-16 sm:max-h-20 object-contain mb-2"
                                                    />
                                                    <span className="text-xs sm:text-sm font-medium text-gray-600">
                                                        Platinum Partner
                                                    </span>
                                                </div>
                                            ) : (
                                                <span>Platinum Partner</span>
                                            )}
                                        </div>
                                    }
                                />

                                {/* Gold Sponsor */}
                                <SponsorDialog
                                    sponsor={goldSponsor}
                                    triggerComponent={
                                        <div className="
                                            bg-gradient-to-br from-amber-100 to-amber-200
                                            hover:from-amber-200 hover:to-amber-300
                                            rounded-xl
                                            h-32 sm:h-40
                                            flex flex-col items-center justify-center
                                            text-amber-800
                                            text-base sm:text-xl font-semibold
                                            cursor-pointer
                                            transition-all duration-200
                                            p-4
                                            border border-amber-300
                                            shadow-sm hover:shadow-md
                                        ">
                                            {goldSponsor.logo ? (
                                                <div className="flex flex-col items-center justify-center h-full">
                                                    <img
                                                        src={goldSponsor.logo}
                                                        alt={`${goldSponsor.name} logo`}
                                                        className="max-w-full max-h-16 sm:max-h-20 object-contain mb-2"
                                                    />
                                                    <span className="text-xs sm:text-sm font-medium text-amber-700">
                                                        Gold Partner
                                                    </span>
                                                </div>
                                            ) : (
                                                <span>Gold Partner</span>
                                            )}
                                        </div>
                                    }
                                />
                            </div>
                        </div>

                        {/* Silver Sponsors Section */}
                        <div>
                            <h3 className="
                                text-lg sm:text-xl font-semibold
                                text-center mb-4 sm:mb-6
                                text-gray-800
                            ">
                                Supporting Partners
                            </h3>
                            <div className="
                                grid
                                grid-cols-2
                                sm:grid-cols-3
                                lg:grid-cols-4
                                xl:grid-cols-6
                                gap-3 sm:gap-4 lg:gap-6
                            ">
                                {silverSponsors.map((sponsor, i) => (
                                    <SponsorDialog
                                        key={i}
                                        sponsor={sponsor}
                                        triggerComponent={
                                            <div className="
                                                bg-gradient-to-br from-slate-100 to-slate-200
                                                hover:from-slate-200 hover:to-slate-300
                                                rounded-lg sm:rounded-xl
                                                h-20 sm:h-24 lg:h-28
                                                flex items-center justify-center
                                                text-slate-700
                                                text-xs sm:text-sm font-medium
                                                cursor-pointer
                                                transition-all duration-200
                                                p-2 sm:p-3
                                                border border-slate-300
                                                shadow-sm hover:shadow-md
                                                text-center
                                            ">
                                                <span className="line-clamp-2 break-words">
                                                    {sponsor.name}
                                                </span>
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
};

export default AnnouncementsPage;
