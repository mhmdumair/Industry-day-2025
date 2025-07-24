"use client";

import React from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

// --- Types ---

interface SponsorData {
    name: string;
    description?: string;
    contactPerson?: string;
    designation?: string;
    contact?: string;
    location?: string;
    website?: string;
    logo?: string;
    jobs?: string[];
}

interface SponsorDialogProps {
    sponsor: SponsorData;
    triggerTitle?: string;
    triggerClassName?: string;
    triggerStyle?: React.CSSProperties;
    children?: React.ReactNode;
    showFullDetails?: boolean;
}

// --- Component ---

const SponsorDialog: React.FC<SponsorDialogProps> = ({
                                                         sponsor,
                                                         triggerTitle,
                                                         triggerClassName = "",
                                                         triggerStyle,
                                                         children,
                                                         showFullDetails = true,
                                                     }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div
                    className={triggerClassName}
                    style={triggerStyle}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${sponsor.name}`}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.currentTarget.click();
                        }
                    }}
                >
                    {children || triggerTitle || sponsor.name}
                </div>
            </DialogTrigger>

            {/* Mobile-first responsive dialog content */}
            <DialogContent
                className="
                    w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh]
                    sm:w-[85vw] sm:max-w-4xl sm:h-auto sm:max-h-[85vh]
                    lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl
                    p-4 sm:p-6 lg:p-8
                    overflow-y-auto
                    mx-auto my-auto
                "
                aria-describedby="sponsor-description"
            >
                <DialogHeader className="space-y-4 pb-4 border-b border-gray-200">
                    <DialogTitle className="
                        text-xl sm:text-2xl lg:text-3xl
                        font-bold text-center
                        leading-tight
                        px-2
                    ">
                        {sponsor.name} - Sponsor Information
                    </DialogTitle>
                    {sponsor.logo && (
                        <div className="flex justify-center">
                            <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md">
                                <Image
                                    src={sponsor.logo}
                                    alt={`${sponsor.name} company logo`}
                                    className="rounded-md object-contain w-full h-auto"
                                    width={400}
                                    height={250}
                                    priority
                                />
                            </div>
                        </div>
                    )}
                </DialogHeader>

                {showFullDetails && (
                    <div
                        className="space-y-6 mt-6"
                        id="sponsor-description"
                    >
                        {sponsor.description && (
                            <section className="space-y-3">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    About {sponsor.name}
                                </h3>
                                <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    <p className="whitespace-pre-wrap break-words">
                                        {sponsor.description}
                                    </p>
                                </div>
                            </section>
                        )}

                        {(sponsor.contactPerson || sponsor.designation || sponsor.contact || sponsor.location || sponsor.website) && (
                            <section className="space-y-3">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base text-gray-700">
                                    {sponsor.contactPerson && (
                                        <div className="space-y-1">
                                            <span className="font-semibold text-gray-900 block">
                                                Contact Person:
                                            </span>
                                            <span className="break-words">
                                                {sponsor.contactPerson}
                                            </span>
                                        </div>
                                    )}
                                    {sponsor.designation && (
                                        <div className="space-y-1">
                                            <span className="font-semibold text-gray-900 block">
                                                Designation:
                                            </span>
                                            <span className="break-words">
                                                {sponsor.designation}
                                            </span>
                                        </div>
                                    )}
                                    {sponsor.contact && (
                                        <div className="space-y-1">
                                            <span className="font-semibold text-gray-900 block">
                                                Contact:
                                            </span>
                                            <span className="break-all">
                                                {sponsor.contact}
                                            </span>
                                        </div>
                                    )}
                                    {sponsor.location && (
                                        <div className="space-y-1">
                                            <span className="font-semibold text-gray-900 block">
                                                Location:
                                            </span>
                                            <span className="break-words">
                                                {sponsor.location}
                                            </span>
                                        </div>
                                    )}
                                    {sponsor.website && (
                                        <div className="space-y-1 col-span-1 sm:col-span-2">
                                            <span className="font-semibold text-gray-900 block">
                                                Website:
                                            </span>
                                            <a
                                                href={sponsor.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline break-all transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                                                aria-label={`Visit ${sponsor.name} website (opens in new tab)`}
                                            >
                                                {sponsor.website}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {sponsor.jobs && sponsor.jobs.length > 0 && (
                            <section className="space-y-4">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    Job Opportunities
                                </h3>
                                <div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                    role="list"
                                    aria-label={`${sponsor.jobs.length} job opportunities from ${sponsor.name}`}
                                >
                                    {sponsor.jobs.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative group"
                                            role="listitem"
                                        >
                                            <div className="aspect-[4/3] relative overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                                <Image
                                                    src={img}
                                                    alt={`Job opportunity ${idx + 1} from ${sponsor.name} - Click to view details`}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    loading={idx < 3 ? "eager" : "lazy"}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default SponsorDialog;
