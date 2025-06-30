// SAMPLE LOGIC FOR VIEWING RESUMES WITH PDF NAVIGATION
// CVS ARE UPLOADED AS STATIC FILES IN PUBLIC FOLDER - INDEXED

'use client';
import { useState } from 'react';

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
        <div className="flex h-screen w-full">
            {/* Left half - PDF Viewer */}
            <div className="w-1/2 h-full flex flex-col">
                {/* PDF Navigation */}
                <div className="flex justify-between items-center p-4 bg-white border-b border-gray-300">
                    <button
                        onClick={handlePrev}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
                    >
                        ← Previous
                    </button>

                    <span className="text-lg font-semibold">
                        PDF {currentPdfIndex + 1} of {pdfFiles.length}
                    </span>

                    <button
                        onClick={handleNext}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
                    >
                        Next →
                    </button>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1">
                    <iframe
                        src={`/${pdfFiles[currentPdfIndex]}`}
                        className="w-full h-full border border-gray-300"
                        title={`PDF Viewer - ${pdfFiles[currentPdfIndex]}`}
                        key={pdfFiles[currentPdfIndex]} // Force reload when PDF changes
                    />
                </div>
            </div>

            {/* Right half - Other Components */}
            <div className="w-1/2 h-full p-6 bg-gray-50 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Resume Details</h2>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Current PDF</h3>
                    <p className="mb-1">File: {pdfFiles[currentPdfIndex]}</p>
                    <p className="mb-1">PDF {currentPdfIndex + 1} of {pdfFiles.length}</p>
                </div>

                <div className="mb-6 text-black" >
                    <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                    <p className="mb-1">Name: John Doe</p>
                    <p className="mb-1">Email: john@example.com</p>
                    <p className="mb-1">Phone: (555) 123-4567</p>
                </div>

                <div className="mb-6 text-black">
                    <h3 className="text-lg font-semibold mb-2">Actions</h3>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600">
                        Download Current PDF
                    </button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Share Resume
                    </button>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Comments</h3>
                    <textarea
                        placeholder="Add your notes here..."
                        className="w-full h-48 p-3 border border-gray-300 rounded-lg resize-none"
                    />
                </div>
            </div>
        </div>
    );
}
