'use client';

import React, { useState, ChangeEvent, FormEvent, Suspense } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';
import AuthNavbar from '@/components/auth/auth-navbar';

type CompanySponsorship = 'MAIN' | 'GOLD' | 'SILVER' | 'BRONZE';

interface CompanyRegistrationRequest {
    companyName: string;
    description: string;
    sponsership: CompanySponsorship;
    contactPersonName: string;
    contactPersonDesignation: string;
    contactNumber: string;
    location: string;
    companyWebsite: string;
}

const RegisterCompanyPage = () => {
    const [formData, setFormData] = useState<CompanyRegistrationRequest>({
        companyName: '',
        description: '',
        sponsership: 'BRONZE' as CompanySponsorship,
        contactPersonName: '',
        contactPersonDesignation: '',
        contactNumber: '',
        location: '',
        companyWebsite: ''
    });
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate website URL
        try {
            new URL(formData.companyWebsite);
        } catch {
            setMessage('Please enter a valid website URL (e.g., https://example.com)');
            setMessageType('error');
            return;
        }

        setLoading(true);
        setMessage('Sending registration request...');
        setMessageType(null);

        try {
            console.log('Sending registration request with data:', formData);

            // Send email to admin with company registration details via Next.js API route
            const response = await fetch('/api/email/company-registration-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();
            console.log('Response:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to send registration request');
            }

            setMessage('Registration request submitted successfully! The admin will review your application and contact you soon.');
            setMessageType('success');

            // Reset form after successful submission
            setTimeout(() => {
                setFormData({
                    companyName: '',
                    description: '',
                    sponsership: 'BRONZE' as CompanySponsorship,
                    contactPersonName: '',
                    contactPersonDesignation: '',
                    contactNumber: '',
                    location: '',
                    companyWebsite: ''
                });
                setMessage('');
                setMessageType(null);
            }, 3000);

        } catch (error) {
            const status = axios.isAxiosError(error) && error.response
                ? error.response.status
                : 'N/A';
            const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Network or unhandled server error.';

            setMessage(`Error (Status: ${status}): ${errorMessage}`);
            setMessageType('error');

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black">
            <Suspense fallback={<div className="h-16 border-b border-gray-200 dark:border-gray-800" />}>
                <AuthNavbar />
            </Suspense>
            <div className="flex-1 flex items-center justify-center p-3 lg:p-6">
                <Card className="w-full max-w-3xl bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-none shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Company Registration
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Register your company for Industry Day 2025
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">

                            {/* Company Information Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Company Information
                                </h3>

                                <div className="space-y-2">
                                    <Label htmlFor="companyName" className="text-gray-700 dark:text-gray-300">
                                        Company Name
                                    </Label>
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        type="text"
                                        placeholder="ABC Corporation"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        required
                                        className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                                        Company Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Brief description of your company, products, and services..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-gray-700 dark:text-gray-300">
                                            Location
                                        </Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            type="text"
                                            placeholder="Colombo, Sri Lanka"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                            className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="companyWebsite" className="text-gray-700 dark:text-gray-300">
                                            Company Website
                                        </Label>
                                        <Input
                                            id="companyWebsite"
                                            name="companyWebsite"
                                            type="url"
                                            placeholder="https://www.company.com"
                                            value={formData.companyWebsite}
                                            onChange={handleChange}
                                            required
                                            className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sponsership" className="text-gray-700 dark:text-gray-300">
                                        Sponsorship Level
                                    </Label>
                                    <Select
                                        value={formData.sponsership}
                                        onValueChange={(value) => handleSelectChange('sponsership', value)}
                                    >
                                        <SelectTrigger className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                                            <SelectValue placeholder="Select sponsorship level" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none dark:bg-gray-800 dark:border-gray-600">
                                            <SelectItem value="MAIN" className="dark:text-gray-100">Main Sponsor</SelectItem>
                                            <SelectItem value="GOLD" className="dark:text-gray-100">Gold Sponsor</SelectItem>
                                            <SelectItem value="SILVER" className="dark:text-gray-100">Silver Sponsor</SelectItem>
                                            <SelectItem value="BRONZE" className="dark:text-gray-100">Bronze Sponsor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Contact Person Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Contact Person Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contactPersonName" className="text-gray-700 dark:text-gray-300">
                                            Contact Person Name
                                        </Label>
                                        <Input
                                            id="contactPersonName"
                                            name="contactPersonName"
                                            type="text"
                                            placeholder="Jane Smith"
                                            value={formData.contactPersonName}
                                            onChange={handleChange}
                                            required
                                            className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contactPersonDesignation" className="text-gray-700 dark:text-gray-300">
                                            Designation
                                        </Label>
                                        <Input
                                            id="contactPersonDesignation"
                                            name="contactPersonDesignation"
                                            type="text"
                                            placeholder="HR Manager"
                                            value={formData.contactPersonDesignation}
                                            onChange={handleChange}
                                            required
                                            className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactNumber" className="text-gray-700 dark:text-gray-300">
                                        Contact Number
                                    </Label>
                                    <Input
                                        id="contactNumber"
                                        name="contactNumber"
                                        type="tel"
                                        placeholder="0771234567"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        required
                                        className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                    />
                                </div>
                            </div>

                            {/* Message Display */}
                            {message && (
                                <Alert className={`rounded-none ${messageType === 'success' ? 'border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/30' : messageType === 'error' ? 'border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-900/30' : 'border-gray-300 dark:border-gray-600'}`}>
                                    <div className="flex items-center gap-2">
                                        {messageType === 'success' && (
                                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        )}
                                        {messageType === 'error' && (
                                            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        )}
                                        <AlertDescription className={`${messageType === 'success' ? 'text-green-800 dark:text-green-200' : messageType === 'error' ? 'text-red-800 dark:text-red-200' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {message}
                                        </AlertDescription>
                                    </div>
                                </Alert>
                            )}
                        </CardContent>

                        <CardFooter className="flex justify-center pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto rounded-none"
                            >
                                {loading ? 'Processing...' : 'Submit Details'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default RegisterCompanyPage;
