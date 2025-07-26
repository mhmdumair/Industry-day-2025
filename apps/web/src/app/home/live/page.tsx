"use client";
import React, {useState, useEffect} from 'react'
import {
    Alert,
    AlertTitle,
} from "@/components/ui/alert"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {ChevronDown} from "lucide-react";
import Navbar from "@/components/home/home-navbar";
import {Card} from "@/components/ui/card";

const companies = ["A", "B", "C"];

export default function CompanyFilter() {
    const [selected, setSelected] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(timer);
    }, []);

    // Format date function
    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    };

    // Format time function
    const formatTime = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        return date.toLocaleTimeString('en-US', options);
    };

    return (
        <div className="flex flex-col bg-transparent items-center w-full min-h-screen mx-auto p-2 sm:p-4">
            <Navbar />

            {/* Spacer */}
            <div className="h-6 sm:h-10"></div>

            {/* Date/Time Alert */}
            <Alert className="
                flex flex-col sm:flex-row
                bg-teal-100 border-black text-black
                w-full max-w-4xl
                p-4 sm:p-6
                space-y-2 sm:space-y-0
                items-center sm:items-center
                shadow-sm
            ">
                <AlertTitle className="
                    text-lg sm:text-xl lg:text-2xl
                    flex-1 text-center sm:text-left
                    font-semibold
                ">
                    {formatDate(currentDateTime)}
                </AlertTitle>
                <AlertTitle className="
                    text-lg sm:text-xl lg:text-2xl
                    text-center sm:text-right
                    font-semibold
                    tabular-nums
                ">
                    {formatTime(currentDateTime)}
                </AlertTitle>
            </Alert>

            {/* Filter Section */}
            <div className="
                mt-4 sm:mt-6
                w-full max-w-4xl
                flex flex-col sm:flex-row
                gap-4 sm:gap-6
                items-start
            ">
                {/* Filter Label - Only visible on larger screens */}
                <div className="hidden sm:flex items-center">
                    <span className="text-sm lg:text-base font-medium text-gray-700">
                        Filter by:
                    </span>
                </div>

                {/* Company Filter Popover */}
                <div className="w-full sm:w-auto">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="
                                    text-black
                                    w-full sm:w-[280px] lg:w-[320px]
                                    justify-between text-left font-normal
                                    bg-gray-300 hover:bg-gray-400
                                    flex items-center
                                    h-10 sm:h-11
                                    px-3 sm:px-4
                                    text-sm sm:text-base
                                    border-2 border-gray-400
                                    focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                                    transition-all duration-200
                                "
                                data-empty={!selected}
                            >
                                <span className="truncate flex-1">
                                    {selected ? `Company ${selected}` : "Select Company"}
                                </span>
                                <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="
                            w-full sm:w-[280px] lg:w-[320px]
                            p-0
                            border-2 border-gray-300
                            shadow-lg
                        ">
                            <div className="flex flex-col max-h-60 overflow-y-auto">
                                {/* Clear/Reset Option */}
                                <button
                                    className={`
                                        px-3 sm:px-4 py-2 sm:py-3
                                        text-left text-sm sm:text-base
                                        hover:bg-gray-100 
                                        border-b border-gray-200
                                        font-medium text-gray-600
                                        transition-colors duration-150
                                        ${!selected ? "bg-gray-100 font-bold" : ""}
                                    `}
                                    onClick={() => setSelected(null)}
                                >
                                    All Companies
                                </button>

                                {/* Company Options */}
                                {companies.map((company) => (
                                    <button
                                        key={company}
                                        className={`
                                            px-3 sm:px-4 py-2 sm:py-3
                                            text-left text-sm sm:text-base
                                            hover:bg-gray-100 
                                            transition-colors duration-150
                                            ${selected === company ?
                                            "bg-teal-100 font-bold text-teal-800 border-l-4 border-teal-500" :
                                            "text-gray-700"
                                        }
                                        `}
                                        onClick={() => setSelected(company)}
                                    >
                                        Company {company}
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Selected Filter Display - Mobile Only */}
                {selected && (
                    <div className="sm:hidden w-full">
                        <div className="
                            bg-teal-50 border border-teal-200 rounded-lg p-3
                            flex items-center justify-between
                        ">
                            <span className="text-sm font-medium text-teal-800">
                                Filtered by: Company {selected}
                            </span>
                            <button
                                onClick={() => setSelected(null)}
                                className="
                                    focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                                    text-sm font-medium
                                    px-2 py-1 rounded
                                    hover:bg-teal-100
                                    transition-colors duration-150
                                "
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Area Placeholder */}
            <div className="
                mt-6 sm:mt-8
                w-full max-w-4xl
                flex-1
                bg-slate-100/50 rounded-lg shadow-sm
                p-4 sm:p-6
                border border-gray-200
            ">
                <div className="flex justify-center w-full p-4">
                    <Card className="bg-slate-100 w-full max-w-2xl rounded-lg shadow-md p-6 text-black space-y-4">

                        {/* Company Name + Stall */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <h2 className="text-lg font-semibold">Company A</h2>
                            <span className="text-sm text-gray-600">Stall 1</span>
                        </div>

                        {/* Divider Line */}
                        <hr className="border-gray-300" />

                        {/* Queue */}
                        <div className="flex flex-col gap-2">
                            <Button className="varient-outline' bg-green-200/80 text-green-700 w-full border hover:bg-green-200/80 hover:text-green-700 hover:border-green-950 border-green-950"
                            >
                                S2000
                            </Button>
                            {["S2001", "S2002", "S2003", "S2004", "S2005"].map((regNo, i) => (
                                <Button className="varient-outline' bg-gray-200 text-gray-500 hover:bg-gray-200 w-full border border-slate-400"
                                >
                                    {regNo}
                                </Button>
                            ))}
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
}
