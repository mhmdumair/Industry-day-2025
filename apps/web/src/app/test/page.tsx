"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import api from "@/lib/axios";
import axios from "axios";

interface Company {
    companyID: string;
    companyName: string;
}

const JobPostUploadForm = () => {
    const [companyID, setCompanyID] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await api.get<Company[]>("/company");
                const fetchedCompanies = response.data;
                setCompanies(fetchedCompanies);
                if (fetchedCompanies.length > 0) {
                    setCompanyID(fetchedCompanies[0].companyID);
                }
            } catch {
                setError("Failed to load company list.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!companyID) {
            setError("Please select a Company.");
            return;
        }

        if (!file) {
            setError("File is required.");
            return;
        }

        const formData = new FormData();
        formData.append("companyID", companyID);
        formData.append("file", file);

        try {
            const response = await api.post("/job-posts/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = response.data;
            setMessage(
                `Success! File uploaded and saved to DB. Drive ID: ${data.driveFileId}, New File Name: ${data.fileName}`
            );

            setFile(null);
            const fileInput = document.getElementById("file-input") as HTMLInputElement | null;
            if (fileInput) fileInput.value = "";
        } catch (err: unknown) {
            let errorMessage = "An unknown error occurred.";
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        } else {
            setFile(null);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl border border-gray-100 transform transition duration-500 hover:scale-[1.01]">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">
                Job Post Uploader
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="companyID" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Company
                    </label>
                    <select
                        id="companyID"
                        value={companyID}
                        onChange={(e) => setCompanyID(e.target.value)}
                        required
                        disabled={isLoading || companies.length === 0}
                        className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-white"
                    >
                        {isLoading && <option value="">Loading Companies...</option>}
                        {!isLoading && companies.length === 0 && <option value="">No Companies Available</option>}
                        {companies.map((company) => (
                            <option key={company.companyID} value={company.companyID}>
                                {company.companyName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Job Post File
                    </label>
                    <input
                        id="file-input"
                        type="file"
                        onChange={handleFileChange}
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
                    disabled={isLoading || companies.length === 0}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out transform hover:scale-[1.005]"
                >
                    {isLoading ? "Loading..." : "Upload Job Post"}
                </button>
            </form>

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
