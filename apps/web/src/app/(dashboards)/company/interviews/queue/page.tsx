'use client';
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Queue Card Component
const QueueCard = ({
                       companyName = "Company A",
                       stallNumber = "Stall 1",
                       currentStudent = "S2000",
                       queueStudents = ["S2001", "S2002", "S2003", "S2004", "S2005"]
                   }) => {
    return (
        <Card className="bg-slate-100 w-full rounded-lg shadow-md p-6 text-black space-y-4">
            {/* Company Name + Stall */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h2 className="text-lg font-semibold">{companyName}</h2>
                <span className="text-sm text-gray-600">{stallNumber}</span>
            </div>

            {/* Divider Line */}
            <hr className="border-gray-300" />

            {/* Queue */}
            <div className="flex flex-col gap-2">
                {/* Current Student (Green) */}
                <Button className="bg-green-200/80 text-green-700 w-full border hover:bg-green-200/80 hover:text-green-700 hover:border-green-950 border-green-950">
                    {currentStudent}
                </Button>

                {/* Queue Students (Gray) */}
                {queueStudents.map((regNo, i) => (
                    <Button
                        key={i}
                        className="bg-gray-200 text-gray-500 hover:bg-gray-200 w-full border border-slate-400"
                    >
                        {regNo}
                    </Button>
                ))}
            </div>
        </Card>
    );
};

export default function ResumePage() {
    const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
    const pdfFiles = ['1.pdf', '2.pdf', '3.pdf'];

    const handleNext = () => {
        setCurrentPdfIndex((prev) => (prev + 1) % pdfFiles.length);
    };

    const handlePrev = () => {
        setCurrentPdfIndex((prev) => (prev - 1 + pdfFiles.length) % pdfFiles.length);
    };

    return (
        <div className="mt-3 w-screen mx-auto flex flex-col items-center justify-center gap-5">
            <Card className="bg-slate-100/80 shadow-lg mt-3 w-11/12 -mx-4 flex-row flex h-[90vh] p-4">
                {/* Left Section: PDF Viewer */}
                <div className="w-full lg:w-4/6 flex flex-col">
                    {/* Navigation */}
                    <Card className="flex flex-row justify-between items-center p-4 border-b border-gray-300 bg-gray-100 mb-3">
                        <Button onClick={handlePrev} variant="outline">← Previous</Button>
                        <span className="text-lg font-medium">PDF {currentPdfIndex + 1} of {pdfFiles.length}</span>
                        <Button onClick={handleNext} variant="outline">Next →</Button>
                    </Card>

                    {/* PDF iframe */}
                    <Card className="flex-1">
                        <iframe
                            src={`/${pdfFiles[currentPdfIndex]}`}
                            className="w-full h-full"
                            title={`PDF Viewer - ${pdfFiles[currentPdfIndex]}`}
                            key={pdfFiles[currentPdfIndex]}
                        />
                    </Card>
                </div>

                {/* Right Section: Resume Metadata with Queue Card */}
                <Card className="w-full lg:w-2/6 h-full p-6 overflow-y-auto bg-transparent flex flex-col">
                    <div className="flex justify-center w-full p-4">
                        <QueueCard
                            companyName="MAS Holdings"
                            stallNumber="Stall 1"
                            currentStudent="S2010"
                            queueStudents={["S2011", "S2012", "S2013", "S2014"]}
                        />
                    </div>
                </Card>
            </Card>
        </div>
    );
}