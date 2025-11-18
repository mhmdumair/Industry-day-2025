"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Types
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
    onOpenChange?: (open: boolean) => void;
}

const SponsorDialog: React.FC<SponsorDialogProps> = ({
    sponsor,
    triggerComponent,
    onOpenChange,
}) => {
    return (
        <Dialog onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{triggerComponent}</DialogTrigger>

            <DialogContent className="max-w-3xl w-[90vw] p-0 rounded-none border-gray-300 overflow-hidden sm:max-h-[90vh] max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="border-b border-gray-200 p-4 relative flex-shrink-0">
                    <DialogTitle className="text-lg font-medium">
                        {sponsor.name}
                    </DialogTitle>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Logo Section */}
                    <div className="flex justify-center mb-6">
                        <div className="w-full max-w-md h-48 bg-gray-200 flex items-center justify-center">
                            {sponsor.logo ? (
                                <img
                                    src={`/logo/${sponsor.logo}`}
                                    alt={`${sponsor.name} logo`}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = 'https://placehold.co/400x200/CCCCCC/666666?text=Logo';
                                    }}
                                />
                            ) : (
                                <span className="text-gray-500">Company Logo</span>
                            )}
                        </div>
                    </div>

                    {/* Company Description */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Company Description</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {sponsor.description || "No description available."}
                        </p>
                    </div>

                    {/* View Openings Button */}
                    {sponsor.website && (
                        <div className="flex justify-end">
                            <Button 
                                className="bg-black text-white hover:bg-gray-800 rounded-none px-6"
                                onClick={() => {
                                    const url = sponsor.website?.startsWith('http') 
                                        ? sponsor.website 
                                        : `https://${sponsor.website}`;
                                    window.open(url, '_blank');
                                }}
                            >
                                View Openings →
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SponsorDialog;