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
        <div className="flex mt-3 mx-auto p-4">
            <Card className="bg-slate-100/80 mt-4 min-w-[85vw] md:min-w-[25vw]">
                <CardHeader>
                    <CardTitle>Register for Interviews</CardTitle>
                    <CardDescription>Select a company, join its walk-in queue</CardDescription>
                </CardHeader>

                <CardContent>
                    {companies.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">
                            No companies available
                        </p>
                    ) : (
                        companies.map(c => {
                            const disabled = alreadyRegistered(c.companyID);
                            const busy = registering === c.companyID;
                            return (
                                <Card key={c.companyID} className="mb-2 last:mb-0">
                                    <CardHeader>
                                        <CardTitle>{c.companyName}</CardTitle>
                                    </CardHeader>

                                    <div className="p-6 pt-0">
                                        <Button
                                            variant="secondary"
                                            className={
                                                disabled
                                                    ? "border border-green-600 bg-green-100 w-full"
                                                    : "border border-black bg-blue-100 w-full"
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
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default InterviewRegistration;