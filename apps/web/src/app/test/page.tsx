"use client";

import React, { useState } from 'react';

const JobPostUploadForm = () => {
    const [companyID, setCompanyID] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!companyID) {
            setError('Company ID is required.');
            return;
        }

        if (!file) {
            setError('File is required.');
            return;
        }

        const formData = new FormData();
        formData.append('companyID', companyID);
        formData.append('file', file);

        try {
            // NOTE: Replace 'http://localhost:3000' with your actual API endpoint if different.
            const response = await fetch('http://localhost:3001/api/job-posts/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle API errors (4xx or 5xx status codes)
                setError(data.message || 'File upload failed.');
                console.error('API Error:', data);
                return;
            }

            // Success handling
            setMessage(`Success! File uploaded and saved to DB. Drive ID: ${data.driveFileId}, New File Name: ${data.fileName}`);
            setCompanyID(''); // Clear Company ID
            setFile(null);
            const fileInput = document.getElementById('file-input');
            if (fileInput) {
                fileInput.value = ''; // Manually clear file input
            }

        } catch (err) {
            console.error('Network or Fetch Error:', err);
            setError('Network error: Could not reach the API.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl border border-gray-100 transform transition duration-500 hover:scale-[1.01]">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">
                Job Post Uploader
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">Test the company-specific folder creation logic.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                    <label htmlFor="companyID" className="block text-sm font-medium text-gray-700 mb-1">
                        Company ID
                    </label>
                    <input
                        id="companyID"
                        type="text"
                        value={companyID}
                        onChange={(e) => setCompanyID(e.target.value)}
                        placeholder="e.g., c101"
                        required
                        className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    />
                </div>

                <div>
                    <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Job Post File
                    </label>
                    <input
                        id="file-input"
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                        className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4 file:rounded-full
                        file:border-0 file:text-sm file:font-semibold 
                        file:bg-indigo-50 file:text-indigo-600 
                        hover:file:bg-indigo-100 transition duration-150 ease-in-out"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out transform hover:scale-[1.005]"
                >
                    Upload Job Post
                </button>
            </form>

            {/* Response Display */}
            {message && (
                <div className="mt-6 p-4 rounded-lg bg-green-50 text-green-700 border border-green-300 text-sm font-medium shadow-inner">
                    {message}
                </div>
            )}
            {error && (
                <div className="mt-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-300 text-sm font-medium shadow-inner">
                    Error: {error}
                </div>
            )}
        </div>
    );
};

export default JobPostUploadForm;