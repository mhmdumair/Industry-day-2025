"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

/* ----------  types  ---------- */
interface Company {
    companyID: string;
    companyName: string;
    stream: string;
}

interface Interview {
    companyID: string;
}

interface UserProfile {
    userID: string;
    role: string;
}

interface StudentProfile {
    studentID: string;
    userID: string;
}

/* ----------  component  ---------- */
const InterviewRegistration = () => {
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [myInterviews, setMyInterviews] = useState<Interview[]>([]);
    const [studentID, setStudentID] = useState<string | undefined>(undefined);
    const [registering, setRegistering] = useState<string | null>(null);
    const [error, setError] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    /* Fetch studentID and then other data */
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setIsLoading(true);

                // Fetch authenticated user's profile to get the userID
                const userRes = await api.get<UserProfile>('/user/profile');
                const userId = userRes.data.userID;

                if (!userId) {
                    throw new Error("User ID not found.");
                }

                // Fetch the student profile using the user ID
                const studentRes = await api.get<StudentProfile>(`/student/by-user`);
                const fetchedStudentID = studentRes.data.studentID;

                if (!fetchedStudentID) {
                    throw new Error("Student profile not found for this user.");
                }
                setStudentID(fetchedStudentID);

                const [cRes, iRes] = await Promise.all([
                    api.get("/company"),
                    api.get(`/interview/student/${fetchedStudentID}`),
                ]);
                
                setCompanies(cRes.data);
                setMyInterviews(iRes.data);
            } catch (e) {
                if (e instanceof AxiosError && e.response?.status === 401) {
                    router.push('/auth/login');
                } else if (e instanceof Error) {
                    setError(e.message);
                } else {
                    setError("Failed to load data.");
                }
                console.error("Data fetching error:", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentData();
    }, [router]);

    const alreadyRegistered = (companyID: string) =>
        myInterviews.some(i => i.companyID === companyID);

    /* register walk-in */
    const register = async (companyID: string) => {
        if (!studentID) {
            setError("Student ID not available.");
            return;
        }

        setRegistering(companyID);
        setError(undefined);
        try {
            await api.post("/interview", {
                companyID,
                studentID,
                type: "walk-in",
                status: "scheduled",
            });
            const iRes = await api.get(`/interview/student/${studentID}`);
            setMyInterviews(iRes.data);
        } catch (e: unknown) {
            if (
                typeof e === "object" &&
                e !== null &&
                "response" in e &&
                typeof (e as any).response?.data?.message === "string"
            ) {
                setError((e as any).response.data.message);
            } else if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Registration failed");
            }
        } finally {
            setRegistering(null);
        }
    };


    /* ----------  render  ---------- */
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>Loading companies and interviews...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mx-auto w-80% mt-4">
                <strong>Error:</strong> {error}
            </div>
        );
    }

    return (
        <Card className="w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-200/20 rounded-none">
            <CardHeader className="mb-2">
                <CardTitle className="text-3xl">Register for Interviews</CardTitle>
                <CardDescription>Select a company to join its walk-in queue</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                {/* Company Grid */}
                {companies.length === 0 ? (
                    <Card className="bg-white dark:bg-black border-1 border-gray-200 dark:border-gray-200/20 rounded-none p-8">
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            No companies available
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {companies.map(c => {
                            const disabled = alreadyRegistered(c.companyID);
                            const busy = registering === c.companyID;
                            return (
                                <Card
                                    key={c.companyID}
                                    className="bg-white dark:bg-black border border-gray-200 dark:border-gray-200/20 rounded-none aspect-square flex flex-col"
                                >
                                    <CardHeader className="flex-1 flex flex-col items-center justify-center text-center p-6">
                                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                            {c.companyName}
                                        </CardTitle>
                                        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                                            {c.stream}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="p-6 pt-0">
                                        <Button
                                            variant="secondary"
                                            className={
                                                disabled
                                                    ? "border border-green-600 bg-green-100 dark:bg-green-900 dark:border-green-500 text-green-800 dark:text-green-200 w-full rounded-none"
                                                    : "border border-black dark:border-white bg-blue-100 dark:bg-blue-900 dark:border-blue-500 text-blue-800 dark:text-blue-200 w-full rounded-none hover:bg-blue-200 dark:hover:bg-blue-800"
                                            }
                                            disabled={disabled || busy}
                                            onClick={() => register(c.companyID)}
                                        >
                                            {disabled ? (
                                                <>
                                                    <Check className="mr-2 w-4 h-4" />
                                                    Registered
                                                </>
                                            ) : busy ? (
                                                "Registering..."
                                            ) : (
                                                <>
                                                    <Plus className="mr-2 w-4 h-4" />
                                                    Register
                                                </>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default InterviewRegistration;