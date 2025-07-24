'use client';
import React, { useState } from 'react';

export default function ResumePage() {
    const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
    const pdfFiles = ['1.pdf', '2.pdf'];

    const isFirst = currentPdfIndex === 0;
    const isLast = currentPdfIndex === pdfFiles.length - 1;

    const goToFirst = () => setCurrentPdfIndex(0);
    const goToPrev = () => setCurrentPdfIndex((prev) => Math.max(prev - 1, 0));
    const goToNext = () => setCurrentPdfIndex((prev) => Math.min(prev + 1, pdfFiles.length - 1));
    const goToLast = () => setCurrentPdfIndex(pdfFiles.length - 1);

    return (
        <div className="flex h-screen w-full">
            {/* Left: PDF Viewer */}
            <div className="w-1/2 h-full flex flex-col">
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center p-4 bg-white border-b gap-2">
                    <button
                        onClick={goToFirst}
                        disabled={isFirst}
                        className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        ⏮ First
                    </button>
                    <button
                        onClick={goToPrev}
                        disabled={isFirst}
                        className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        ← Previous
                    </button>

                    <span className="text-lg font-semibold">
                        PDF {currentPdfIndex + 1} of {pdfFiles.length}
                    </span>

                    <button
                        onClick={goToNext}
                        disabled={isLast}
                        className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        Next →
                    </button>
                    <button
                        onClick={goToLast}
                        disabled={isLast}
                        className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        Last ⏭
                    </button>
                </div>

                {/* PDF View */}
                <iframe
                    src={`http://localhost:3001/resumes/${pdfFiles[currentPdfIndex]}`}
                    className="w-full h-full border"
                    title={`Resume Viewer - ${pdfFiles[currentPdfIndex]}`}
                />
            </div>

            {/* Right: Info Panel */}
            <div className="w-1/2 h-full p-6 overflow-y-auto bg-gray-50">
                <h2 className="text-2xl font-bold mb-4">Resume Info</h2>
                <p>Filename: {pdfFiles[currentPdfIndex]}</p>
                <a
                    href={`http://localhost:3001/resumes/${pdfFiles[currentPdfIndex]}`}
                    download
                    className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Download PDF
                </a>
            </div>
        </div>
    );
}
