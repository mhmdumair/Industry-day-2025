'use client';
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// This component is now more dynamic and uses conditional styling for different student statuses.
const QueueCard = ({ companyName, stallNumber, students }) => {

    const getStatusStyles = (status) => {
        switch (status) {
            case 'interviewing':
                return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
            case 'waiting':
                return "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200";
            case 'missed':
                return "bg-red-100 text-red-800 border-red-300 hover:bg-red-200";
            default: // 'queued'
                return "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200";
        }
    };

    return (
        <Card className="w-full rounded-lg p-6 text-black space-y-4 bg-white h-full">
            {/* Company Name + Stall */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h2 className="text-xl font-bold">{companyName}</h2>
                <span className="text-sm text-gray-500">{stallNumber}</span>
            </div>

            {/* Divider Line */}
            <hr className="border-gray-200" />

            {/* Queue List */}
            <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-gray-700">Interview Queue</h3>
                {students.map((student, i) => (
                    <Button
                        key={i}
                        className={`w-full justify-start p-3 h-auto border ${getStatusStyles(student.status)}`}
                    >
                        <span className="font-semibold mr-3">{student.id}</span>
                        <span className="truncate">{student.name}</span>
                    </Button>
                ))}
            </div>
        </Card>
    );
};


// --- Main Page Component ---
export default function ResumePage() {
    const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
    // The user's code didn't use this array to change the iframe, but the logic is here if needed.
    const pdfFiles = ['1.pdf', '2.pdf', '3.pdf'];

    // Sample data for the queue
    const queueStudents = [
        { id: "S2010", name: "Mohommad Umair", status: "interviewing" },
        { id: "S2011", name: "Alia Hassan", status: "waiting" },
        { id: "S2012", name: "Kenji Tanaka", status: "missed" },
        { id: "S2013", name: "Fatima Al-Sayed", status: "waiting" },
        { id: "S2014", name: "Johnathan Smith", status: "queued" },
        { id: "S2015", name: "Priya Sharma", status: "queued" },
        { id: "S2016", name: "Carlos Rodriguez", status: "queued" },
    ];


    const handleNext = () => {
        setCurrentPdfIndex((prev) => (prev + 1) % pdfFiles.length);
    };

    const handlePrev = () => {
        setCurrentPdfIndex((prev) => (prev - 1 + pdfFiles.length) % pdfFiles.length);
    };

    return (
        <div className="bg-transparent w-full p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)]">

                {/* Left Section: PDF Viewer (spans 2 columns on large screens) */}
                <div className="lg:col-span-2 flex flex-col gap-4 h-full">

                    {/* Navigation Bar */}
                    <Card className="flex flex-row justify-between items-center p-3 bg-white">
                        <Button onClick={handlePrev} variant="outline" className="hidden">
                            ← Previous
                        </Button>

                        {/* Student Status Badge */}
                        <div className="flex items-center gap-2">
                            <Badge className="bg-amber-100 text-amber-800 border-amber-300 py-1 px-3">
                                Pre-Listed Student
                            </Badge>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 py-1 px-3">
                                Position: 2
                            </Badge>
                        </div>

                        <Button onClick={handleNext} className='border bg-blue-600 text-white hover:bg-blue-700'>
                            Finish Interview
                        </Button>
                    </Card>

                    {/* PDF iframe Container */}
                    <Card className="flex-1 w-full h-full">
                        <iframe
                            // This URL is from your original code. The key prop ensures it re-renders on change.
                            src={`https://drive.google.com/file/d/1PpmNJO4Ibol0gzjggzzJwBQW01fm7J7J/preview`}
                            className="w-full h-full border-0 px-2"
                            title={`PDF Viewer - ${pdfFiles[currentPdfIndex]}`}
                            key={pdfFiles[currentPdfIndex]}
                        />
                    </Card>
                </div>

                {/* Right Section: Queue Card (spans 1 column on large screens) */}
                <div className="lg:col-span-1 h-full overflow-y-auto">
                    <QueueCard
                        companyName="MAS Holdings"
                        stallNumber="Stall 1"
                        students={queueStudents}
                    />
                </div>
            </div>
        </div>
    );
}
