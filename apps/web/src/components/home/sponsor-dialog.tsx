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
    description: string;
    contactPerson?: string;
    designation?: string;
    contact?: string;
    location?: string;
    website?: string;
    logo?: string;
    jobs?: string[];
    category?: string;
}

interface SponsorDialogProps {
    sponsor: SponsorData;
    triggerComponent: React.ReactNode;
    className?: string;
}

// --- Component ---

const SponsorDialog: React.FC<SponsorDialogProps> = ({
                                                         sponsor,
                                                         triggerComponent,
                                                         className = "",
                                                     }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {triggerComponent}
            </DialogTrigger>

            <DialogContent className={`
                w-[95vw] max-w-[95vw] h-[85vh] max-h-[85vh]
                sm:w-[90vw] sm:max-w-5xl sm:h-auto sm:max-h-[90vh]
                lg:max-w-6xl xl:max-w-7xl
                p-4 sm:p-6 lg:p-8
                overflow-y-auto
                ${className}
            `}>
                <DialogHeader className="space-y-3 sm:space-y-4 pb-4 sm:pb-6 border-b border-gray-200">
                    <DialogTitle className="
                        text-xl sm:text-2xl lg:text-3xl
                        font-bold text-center
                        leading-tight px-2
                    ">
                        {sponsor.name}
                        {sponsor.category && (
                            <span className="
                                text-sm sm:text-base lg:text-lg
                                font-medium text-gray-600
                                block mt-1 sm:mt-2
                            ">
                                {sponsor.category} Sponsor
                            </span>
                        )}
                    </DialogTitle>
                    {sponsor.logo && (
                        <div className="flex justify-center">
                            <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md">
                                <Image
                                    src={sponsor.logo}
                                    alt={`${sponsor.name} logo`}
                                    className="rounded-md object-contain w-full h-auto max-h-48 sm:max-h-56 lg:max-h-64"
                                    width={400}
                                    height={250}
                                    priority
                                />
                            </div>
                        </div>
                    )}
                </DialogHeader>

                <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                    {/* Description Section */}
                    <div className="space-y-2 sm:space-y-3">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                            About
                        </h3>
                        <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                            <p className="whitespace-pre-wrap break-words">
                                {sponsor.description}
                            </p>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    {(sponsor.contactPerson || sponsor.designation || sponsor.contact || sponsor.location || sponsor.website) && (
                        <div className="space-y-2 sm:space-y-3">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base text-gray-700">
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
                                            className="
                                                text-blue-600 hover:text-blue-800
                                                underline break-all
                                                transition-colors duration-200
                                                hover:underline-offset-2
                                            "
                                        >
                                            {sponsor.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Jobs Section */}
                    {sponsor.jobs && sponsor.jobs.length > 0 && (
                        <div className="space-y-3 sm:space-y-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Available Positions
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {sponsor.jobs.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="
                                            aspect-[4/3] relative overflow-hidden
                                            rounded-lg border border-gray-200
                                            shadow-sm hover:shadow-md
                                            transition-all duration-200
                                            bg-gray-50
                                        ">
                                            <Image
                                                src={img}
                                                alt={`Job opportunity ${idx + 1} at ${sponsor.name}`}
                                                fill
                                                className="
                                                    object-cover
                                                    group-hover:scale-105
                                                    transition-transform duration-200
                                                "
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                loading={idx < 3 ? "eager" : "lazy"}
                                            />
                                        </div>
                                        <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SponsorDialog;
