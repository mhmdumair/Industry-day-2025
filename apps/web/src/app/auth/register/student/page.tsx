'use client';

import React, { useState, ChangeEvent, FormEvent, Suspense } from 'react';
import api from '@/lib/axios';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Upload } from 'lucide-react';
import AuthNavbar from '@/components/auth/auth-navbar';

type UserRole = 'student' | 'admin' | 'lecturer';
type StudentLevel = 'level_1' | 'level_2' | 'level_3' | 'level_4';

interface CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

interface StudentDto {
    regNo: string;
    nic?: string;
    contact?: string;
    linkedin?: string;
    group: string;
    level: StudentLevel;
}

interface CreateStudentDto {
    user: CreateUserDto;
    student: StudentDto;
}

interface StudentResponse {
    studentID: string;
}

const RegisterPage = () => {
    const [formData, setFormData] = useState<CreateStudentDto>({
        user: { email: '', password: '', firstName: '', lastName: '', role: 'student' as UserRole },
        student: { regNo: '', nic: '', contact: '', linkedin: '', group: '', level: 'level_4' }
    });
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const [parent, field] = name.split('.') as ['user' | 'student', keyof CreateUserDto | keyof StudentDto];

        setFormData(prevData => ({
            ...prevData,
            [parent]: {
                ...prevData[parent],
                [field]: value
            }
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        const [parent, field] = name.split('.') as ['user' | 'student', keyof CreateUserDto | keyof StudentDto];

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

        if (file && file.type !== 'application/pdf') {
            setMessage('Only PDF files are allowed for CV.');
            setMessageType('error');
            setCvFile(null);
            return;
        }
        setMessage('');
        setMessageType(null);
        setCvFile(file);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!cvFile) {
            setMessage('CV file is required.');
            setMessageType('error');
            return;
        }

        const jsonPayload = JSON.stringify(formData, null, 2);
        console.log("--- JSON PAYLOAD SENT TO NESTJS ---");
        console.log(jsonPayload);

        setLoading(true);
        setMessage('Registering...');
        setMessageType(null);

        const dataToSend = new FormData();
        dataToSend.append('cv_file', cvFile);
        dataToSend.append('createStudentDto', jsonPayload);

        try {
            const response = await api.post<StudentResponse>('/student/register', dataToSend);

            setMessage(`Registration successful! Student ID: ${response.data.studentID}`);
            setMessageType('success');

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
            <div className="flex-1 flex items-center justify-center p-6">
                <Card className="w-full max-w-2xl bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-none shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Student Registration
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Create your student account to access the platform
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
                                            placeholder="Alex"
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
                                            placeholder="Johnson"
                                            value={formData.user.lastName}
                                            onChange={handleChange}
                                            required
                                            className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="user.email" className="text-gray-700 dark:text-gray-300">
                                        University Email
                                    </Label>
                                    <Input
                                        id="user.email"
                                        name="user.email"
                                        type="email"
                                        placeholder="sXXXXX@sci.pdn.ac.lk"
                                        value={formData.user.email}
                                        onChange={handleChange}
                                        required
                                        className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                    />
                                </div>
                            </div>

                            {/* Student Information Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Student Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="student.regNo" className="text-gray-700 dark:text-gray-300">
                                            Registration Number
                                        </Label>
                                        <Input
                                            id="student.regNo"
                                            name="student.regNo"
                                            type="text"
                                            placeholder="SXXXXX"
                                            value={formData.student.regNo}
                                            onChange={handleChange}
                                            required
                                            className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:tex-gray-100"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="student.group" className="text-gray-700 dark:text-gray-300">
                                            Group
                                        </Label>
                                        <Select
                                            value={formData.student.group}
                                            onValueChange={(value) => handleSelectChange('student.group', value)}
                                        >
                                            <SelectTrigger className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                                                <SelectValue placeholder="Select your group" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-none dark:bg-gray-800 dark:border-gray-600">
                                                <SelectItem value="BT" className="dark:text-gray-100">BT - Botany</SelectItem>
                                                <SelectItem value="ZL" className="dark:text-gray-100">ZL - Zoology</SelectItem>
                                                <SelectItem value="CH" className="dark:text-gray-100">CH - Chemistry</SelectItem>
                                                <SelectItem value="MT" className="dark:text-gray-100">MT - Mathematics</SelectItem>
                                                <SelectItem value="BMS" className="dark:text-gray-100">BMS - Biomedical Science</SelectItem>
                                                <SelectItem value="ST" className="dark:text-gray-100">ST - Statistics</SelectItem>
                                                <SelectItem value="GL" className="dark:text-gray-100">GL - Geology</SelectItem>
                                                <SelectItem value="CS" className="dark:text-gray-100">CS - Computer Science</SelectItem>
                                                <SelectItem value="DS" className="dark:text-gray-100">DS - Data Science</SelectItem>
                                                <SelectItem value="ML" className="dark:text-gray-100">ML - Microbiology</SelectItem>
                                                <SelectItem value="CM" className="dark:text-gray-100">CM - Computation and Management</SelectItem>
                                                <SelectItem value="ES" className="dark:text-gray-100">ES - Environmental Science</SelectItem>
                                                <SelectItem value="MB" className="dark:text-gray-100">MB - Molecular Biology</SelectItem>
                                                <SelectItem value="PH" className="dark:text-gray-100">PH - Physics</SelectItem>
                                                <SelectItem value="GN" className="dark:text-gray-100">GN - General</SelectItem>
                                                <SelectItem value="SOR" className="dark:text-gray-100">SOR - Statistics and Operational Research</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="student.nic" className="text-gray-700 dark:text-gray-300">
                                            NIC
                                        </Label>
                                        <Input
                                            id="student.nic"
                                            name="student.nic"
                                            type="text"
                                            placeholder="987654321V"
                                            value={formData.student.nic}
                                            onChange={handleChange}
                                            required
                                            className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="student.contact" className="text-gray-700 dark:text-gray-300">
                                            Contact Number
                                        </Label>
                                        <Input
                                            id="student.contact"
                                            name="student.contact"
                                            type="tel"
                                            placeholder="0771234567"
                                            value={formData.student.contact}
                                            onChange={handleChange}
                                            required
                                            className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="student.linkedin" className="text-gray-700 dark:text-gray-300">
                                        LinkedIn (Optional)
                                    </Label>
                                    <Input
                                        id="student.linkedin"
                                        name="student.linkedin"
                                        type="url"
                                        placeholder="https://linkedin.com/in/profile"
                                        value={formData.student.linkedin}
                                        onChange={handleChange}
                                        className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="student.level" className="text-gray-700 dark:text-gray-300">
                                        Level
                                    </Label>
                                    <Select
                                        value={formData.student.level}
                                        onValueChange={(value) => handleSelectChange('student.level', value)}
                                    >
                                        <SelectTrigger className="rounded-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100">
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none dark:bg-gray-800 dark:border-gray-600">
                                            <SelectItem value="level_4" className="dark:text-gray-100">Level 4</SelectItem>
                                            <SelectItem value="level_3" className="dark:text-gray-100">Level 3</SelectItem>
                                            <SelectItem value="level_2" className="dark:text-gray-100">Level 2</SelectItem>
                                            <SelectItem value="level_1" className="dark:text-gray-100">Level 1</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* CV Upload Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    CV Upload
                                </h3>

                                <div className="space-y-3">
                                    <Label htmlFor="cv_file" className="text-gray-700 dark:text-gray-300">
                                        Upload CV (PDF Only) *
                                    </Label>

                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-none p-6 bg-gray-50 dark:bg-gray-900/50 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="p-3 rounded-none">
                                                <Upload className="h-8 w-8" />
                                            </div>

                                            <div className="text-center bg-amber-100 justify-center items-center">
                                                <Label htmlFor="cv_file" className="cursor-pointer">
                                                    <span className="text-sm font-medium underline">
                                                        Click to upload
                                                    </span>
                                                </Label>
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    PDF files only (Max 10MB)
                                                </p>
                                            </div>

                                            <Input
                                                id="cv_file"
                                                name="cv_file"
                                                type="file"
                                                accept="application/pdf"
                                                onChange={handleFileChange}
                                                required
                                                className="hidden"
                                            />
                                        </div>
                                    </div>

                                    {cvFile && (
                                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-none">
                                            <div className="flex-shrink-0">
                                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                                    File selected
                                                </p>
                                                <p className="text-xs text-green-700 dark:text-green-300 truncate">
                                                    {cvFile.name}
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setCvFile(null);
                                                    setMessage('');
                                                    setMessageType(null);
                                                    const fileInput = document.getElementById('cv_file') as HTMLInputElement;
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
                                disabled={loading || !cvFile}
                                className="w-full md:w-auto rounded-none"
                            >
                                {loading ? 'Processing...' : 'Register'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default RegisterPage;
