'use client';
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
                {/* Current Student (Various States as Sample) */}
                <Button className="bg-green-200/80 text-green-700 w-full border hover:bg-green-200/80 hover:text-green-700 hover:border-green-950 border-green-950">
                    {currentStudent} - Mohommad Umair
                </Button>
                <Button className="bg-amber-200/80 text-amber-700 w-full border hover:bg-amber-200/80 hover:text-amber-700 hover:border-amber-950 border-amber-950">
                    {currentStudent} - Mohommad Umair
                </Button>
                <Button className="bg-red-200/80 text-red-700 w-full border hover:bg-red-200/80 hover:text-red-700 hover:border-red-950 border-red-950">
                    {currentStudent} - Mohommad Umair
                </Button>
                <Button className="bg-amber-200/80 text-amber-700 w-full border hover:bg-amber-200/80 hover:text-amber-700 hover:border-amber-950 border-amber-950">
                    {currentStudent} - Mohommad Umair
                </Button>

                {/* Queue Students (Gray) */}
                {queueStudents.map((regNo, i) => (
                    <Button
                        key={i}
                        className="bg-gray-200 text-gray-500 hover:bg-gray-200 w-full border border-slate-400"
                    >
                        {regNo} - Mohommad Umair
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
        <div className="mt-3 mx-auto w-full max-w-7xl flex flex-col items-center justify-center gap-5">
            <Card className="bg-slate-100/80 shadow-lg mt-3 w-11/12 mx-auto flex-row flex h-[90vh] p-4">
                {/* Left Section: PDF Viewer */}
                <div className="w-full lg:w-4/6 flex flex-col">
                    {/* Navigation */}
                    <Card className="flex flex-row justify-between items-center p-4 border-b border-gray-300 bg-gray-100 mb-3">
                        <Button onClick={handlePrev} variant="outline" className="hidden">
                            ← Previous
                        </Button>

                        <span className="text-lg font-medium mx-1">
              <Button className="bg-amber-200/80 text-amber-700 w-full border hover:bg-amber-200/80 hover:text-amber-700 hover:border-amber-950 border-amber-950" variant="outline">
                This student is a Pre-Listed Student
                <Badge variant="outline" className="ml-2 bg-green-200/80 text-green-700 border hover:bg-green-200/80 hover:text-green-700 hover:border-green-950 border-green-950">
                  Position : 2
                </Badge>
              </Button>
            </span>

                        <Button onClick={handleNext} variant="secondary" className='border border-black'>
                            Finish Interview
                        </Button>
                    </Card>

                    {/* PDF iframe */}
                    <Card className="flex-1">
                        <iframe
                            src={`https://drive.google.com/file/d/1PpmNJO4Ibol0gzjggzzJwBQW01fm7J7J/preview`}
                            className="w-full h-full"
                            title={`PDF Viewer - ${pdfFiles[currentPdfIndex]}`}
                            key={pdfFiles[currentPdfIndex]}
                        />
                    </Card>
                </div>

                {/* Right Section: Queue Card */}
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
