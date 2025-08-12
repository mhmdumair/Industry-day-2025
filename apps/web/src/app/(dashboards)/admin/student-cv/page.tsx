'use client';

import React, { useState } from "react";
import api from "../../../../lib/axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CvUploadPage = () => {
    const [regNo, setRegNo] = useState("");
    const [fileName, setFileName] = useState("");
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [regNoError, setRegNoError] = useState<string | null>(null);
    const [fileNameError, setFileNameError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        let isValid = true;
        setRegNoError(null);
        setFileNameError(null);

        if (!regNo.trim()) {
            setRegNoError("Registration number is required.");
            isValid = false;
        }

        if (!fileName.trim()) {
            setFileNameError("File name is required.");
            isValid = false;
        }

        return isValid;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(null); // Clear any previous server errors
        setSuccessMessage(null); // Clear any previous success messages

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post("/cv/by-regno", { regNo, fileName });

            if (response.status === 201) {
                setSuccessMessage(`CV for student has been created.`);
                setRegNo("");
                setFileName("");
            }
        } catch (error: any) {
            if (error.response) {
                if (error.response.status === 409) {
                    setServerError(error.response.data.message);
                } else {
                    setServerError(error.response.data.message || 'There was an error creating the CV.');
                }
            } else {
                setServerError('Could not connect to the server. Please try again later.');
            }
            console.error('Submission error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Upload CV</CardTitle>
                    <CardDescription>
                        Enter the student's registration number and the CV file name.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {successMessage && (
                        <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-200">
                            {successMessage}
                        </div>
                    )}
                    {serverError && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {serverError}
                            </AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="regNo">Registration Number</Label>
                            <Input
                                id="regNo"
                                placeholder="e.g., s/xx/xxx"
                                value={regNo}
                                onChange={(e) => {
                                    setRegNo(e.target.value);
                                    if (regNoError) validateForm();
                                }}
                            />
                            {regNoError && <p className="text-sm text-red-500 mt-1">{regNoError}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fileName">File Name</Label>
                            <Input
                                id="fileName"
                                placeholder="xxxxxxxxxxxx"
                                value={fileName}
                                onChange={(e) => {
                                    setFileName(e.target.value);
                                    if (fileNameError) validateForm(); // Re-validate on change
                                }}
                            />
                            {fileNameError && <p className="text-sm text-red-500 mt-1">{fileNameError}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create CV"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default function App() {
  return <CvUploadPage />;
}
