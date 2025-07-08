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
                                                         triggerClassName = "rounded-xl border border-black h-40 flex items-center justify-center text-black w-11/12 text-xl font-semibold cursor-pointer hover:bg-slate-500 transition",
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
                >
                    {children || triggerTitle || sponsor.name}
                </div>
            </DialogTrigger>

            <DialogContent className="w-full sm:w-11/12 max-w-screen-2xl p-8">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold flex items-center justify-center">
                        {sponsor.name}
                    </DialogTitle>
                    {sponsor.logo && (
                        <Image
                            src={sponsor.logo}
                            alt={`${sponsor.name} logo`}
                            className="rounded-md object-cover mt-4 mx-auto"
                            width={300}
                            height={200}
                        />
                    )}
                </DialogHeader>

                {showFullDetails && (
                    <>
                        {sponsor.description && (
                            <div className="mt-4 space-y-2 text-base text-gray-700">
                                <p>{sponsor.description}</p>
                            </div>
                        )}

                        {(sponsor.contactPerson || sponsor.designation || sponsor.contact || sponsor.location || sponsor.website) && (
                            <div className="mt-4 space-y-2 text-base text-gray-700">
                                {sponsor.contactPerson && (
                                    <p>
                                        <strong>Contact Person:</strong> {sponsor.contactPerson}
                                    </p>
                                )}
                                {sponsor.designation && (
                                    <p>
                                        <strong>Designation:</strong> {sponsor.designation}
                                    </p>
                                )}
                                {sponsor.contact && (
                                    <p>
                                        <strong>Contact:</strong> {sponsor.contact}
                                    </p>
                                )}
                                {sponsor.location && (
                                    <p>
                                        <strong>Location:</strong> {sponsor.location}
                                    </p>
                                )}
                                {sponsor.website && (
                                    <p>
                                        <strong>Website:</strong>{" "}
                                        <a
                                            href={sponsor.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            {sponsor.website}
                                        </a>
                                    </p>
                                )}
                            </div>
                        )}

                        {sponsor.jobs && sponsor.jobs.length > 0 && (
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {sponsor.jobs.map((img, idx) => (
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
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default SponsorDialog;