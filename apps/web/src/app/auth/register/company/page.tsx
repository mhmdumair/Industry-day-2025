'use client';

import React, { useState, ChangeEvent, FormEvent, Suspense } from 'react';
import api from '@/lib/axios';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Upload } from 'lucide-react';
import AuthNavbar from '@/components/auth/auth-navbar';

type UserRole = 'company' | 'admin' | 'lecturer';
type CompanySponsorship = 'MAIN' | 'GOLD' | 'SILVER' | 'BRONZE';

interface CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

interface CompanyDto {
    companyName: string;
    description: string;
    sponsership: CompanySponsorship;
    contactPersonName: string;
    contactPersonDesignation: string;
    contactNumber: string;
    location: string;
    companyWebsite: string;
}

interface CreateCompanyDto {
    user: CreateUserDto;
    company: CompanyDto;
}

interface CompanyResponse {
    companyID: string;
}

const RegisterCompanyPage = () => {
    const [formData, setFormData] = useState<CreateCompanyDto>({
        user: { email: '', password: '', firstName: '', lastName: '', role: 'company' as UserRole },
        company: {
            companyName: '',
            description: '',
            sponsership: 'BRONZE' as CompanySponsorship,
            contactPersonName: '',
            contactPersonDesignation: '',
            contactNumber: '',
            location: '',
            companyWebsite: ''
        }
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const [parent, field] = name.split('.') as ['user' | 'company', keyof CreateUserDto | keyof CompanyDto];

        setFormData(prevData => ({
            ...prevData,
            [parent]: {
                ...prevData[parent],
                [field]: value
            }
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        const [parent, field] = name.split('.') as ['user' | 'company', keyof CreateUserDto | keyof CompanyDto];

        setFormData(prevData => ({
            ...prevData,
            [parent]: {
                ...prevData[parent],
                [field]: value
            }
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (file) {
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                setMessage('Only PNG, JPG, JPEG, or SVG files are allowed for logo.');
                setMessageType('error');
                setLogoFile(null);
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setMessage('Logo file size must be less than 5MB.');
                setMessageType('error');
                setLogoFile(null);
                return;
            }
        }
        setMessage('');
        setMessageType(null);
        setLogoFile(file);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate website URL
        try {
            new URL(formData.company.companyWebsite);
        } catch {
            setMessage('Please enter a valid website URL (e.g., https://example.com)');
            setMessageType('error');
            return;
        }

        const jsonPayload = JSON.stringify(formData, null, 2);
        console.log("--- JSON PAYLOAD SENT TO NESTJS ---");
        console.log(jsonPayload);

        setLoading(true);
        setMessage('Registering company...');
        setMessageType(null);

        const dataToSend = new FormData();
        if (logoFile) {
            dataToSend.append('logo', logoFile);
        }
        dataToSend.append('createCompanyDto', jsonPayload);

        try {
            const response = await api.post<CompanyResponse>('/company/register', dataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(`Registration successful! Company ID: ${response.data.companyID}`);
            setMessageType('success');

            // Reset form after successful registration
            setTimeout(() => {
                window.location.href = '/auth/login';
            }, 2000);

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
                            {/* User Credentials Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    User Credentials
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="user.firstName" className="text-gray-700 dark:text-gray-300">
                                            First Name
                                        </Label>
                                        <Input
                                            id="user.firstName"
                                            name="user.firstName"
                                            type="text"
                                            placeholder="John"
                                            value={formData.user.firstName}
                                            onChange={handleChange}
                                            required
                                            className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="user.lastName" className="text-gray-700 dark:text-gray-300">
                                            Last Name
                                        </Label>
                                        <Input
                                            id="user.lastName"
                                            name="user.lastName"
                                            type="text"
                                            placeholder="Doe"
                                            value={formData.user.lastName}
                                            onChange={handleChange}
                                            required
                                            className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="user.email" className="text-gray-700 dark:text-gray-300">
                                        Company Email
                                    </Label>
                                    <Input
                                        id="user.email"
                                        name="user.email"
                                        type="email"
                                        placeholder="contact@company.com"
                                        value={formData.user.email}
                                        onChange={handleChange}
                                        required
                                        className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="user.password" className="text-gray-700 dark:text-gray-300">
                                        Password
                                    </Label>
                                    <Input
                                        id="user.password"
                                        name="user.password"
                                        type="password"
                                        placeholder="Enter a strong password"
                                        value={formData.user.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                    />
                                </div>
                            </div>

                            {/* Company Information Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Company Information
                                </h3>

                                <div className="space-y-2">
                                    <Label htmlFor="company.companyName" className="text-gray-700 dark:text-gray-300">
                                        Company Name
                                    </Label>
                                    <Input
                                        id="company.companyName"
                                        name="company.companyName"
                                        type="text"
                                        placeholder="ABC Corporation"
                                        value={formData.company.companyName}
                                        onChange={handleChange}
                                        required
                                        className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company.description" className="text-gray-700 dark:text-gray-300">
                                        Company Description
                                    </Label>
                                    <Textarea
                                        id="company.description"
                                        name="company.description"
                                        placeholder="Brief description of your company, products, and services..."
                                        value={formData.company.description}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="company.location" className="text-gray-700 dark:text-gray-300">
                                            Location
                                        </Label>
                                        <Input
                                            id="company.location"
                                            name="company.location"
                                            type="text"
                                            placeholder="Colombo, Sri Lanka"
                                            value={formData.company.location}
                                            onChange={handleChange}
                                            required
                                            className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company.companyWebsite" className="text-gray-700 dark:text-gray-300">
                                            Company Website
                                        </Label>
                                        <Input
                                            id="company.companyWebsite"
                                            name="company.companyWebsite"
                                            type="url"
                                            placeholder="https://www.company.com"
                                            value={formData.company.companyWebsite}
                                            onChange={handleChange}
                                            required
                                            className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company.sponsership" className="text-gray-700 dark:text-gray-300">
                                        Sponsorship Level
                                    </Label>
                                    <Select
                                        value={formData.company.sponsership}
                                        onValueChange={(value) => handleSelectChange('company.sponsership', value)}
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
                                        <Label htmlFor="company.contactPersonName" className="text-gray-700 dark:text-gray-300">
                                            Contact Person Name
                                        </Label>
                                        <Input
                                            id="company.contactPersonName"
                                            name="company.contactPersonName"
                                            type="text"
                                            placeholder="Jane Smith"
                                            value={formData.company.contactPersonName}
                                            onChange={handleChange}
                                            required
                                            className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company.contactPersonDesignation" className="text-gray-700 dark:text-gray-300">
                                            Designation
                                        </Label>
                                        <Input
                                            id="company.contactPersonDesignation"
                                            name="company.contactPersonDesignation"
                                            type="text"
                                            placeholder="HR Manager"
                                            value={formData.company.contactPersonDesignation}
                                            onChange={handleChange}
                                            required
                                            className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company.contactNumber" className="text-gray-700 dark:text-gray-300">
                                        Contact Number
                                    </Label>
                                    <Input
                                        id="company.contactNumber"
                                        name="company.contactNumber"
                                        type="tel"
                                        placeholder="0771234567"
                                        value={formData.company.contactNumber}
                                        onChange={handleChange}
                                        required
                                        className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                    />
                                </div>
                            </div>

                            {/* Logo Upload Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Company Logo (Optional)
                                </h3>

                                <div className="space-y-3">
                                    <Label htmlFor="logo" className="text-gray-700 dark:text-gray-300">
                                        Upload Company Logo (PNG, JPG, SVG)
                                    </Label>

                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-none p-6 bg-gray-50 dark:bg-gray-900/50 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="p-3 rounded-none">
                                                <Upload className="h-8 w-8" />
                                            </div>

                                            <div className="text-center justify-center items-center">
                                                <Label htmlFor="logo" className="cursor-pointer">
                                                    <span className="mx-auto text-sm font-medium underline">
                                                        Click to upload
                                                    </span>
                                                </Label>
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    PNG, JPG, or SVG (Max 5MB)
                                                </p>
                                            </div>

                                            <Input
                                                id="logo"
                                                name="logo"
                                                type="file"
                                                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>

                                    {logoFile && (
                                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-none">
                                            <div className="flex-shrink-0">
                                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                                    Logo selected
                                                </p>
                                                <p className="text-xs text-green-700 dark:text-green-300 truncate">
                                                    {logoFile.name}
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setLogoFile(null);
                                                    const fileInput = document.getElementById('logo') as HTMLInputElement;
                                                    if (fileInput) fileInput.value = '';
                                                }}
                                                className="rounded-none text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 hover:bg-green-100 dark:hover:bg-green-900/40"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
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

                        <CardFooter className="flex justify-center border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto rounded-none"
                            >
                                {loading ? 'Processing...' : 'Register Company'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default RegisterCompanyPage;
