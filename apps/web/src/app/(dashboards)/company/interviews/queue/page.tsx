'use client';

import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo
import { useSearchParams } from 'next/navigation';
import api from "@/lib/axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Enum for Preference Streams
export enum Preference {
    BT = "BT", //Botany
    ZL = "ZL", //Zoology
    CH = "CH", //Chemistry
    MT = "MT", //Mathematics
    BMS = "BMS", //Biomedical Science
    ST = "ST", //Statistics
    GL = "GL", // Geology
    CS = "CS", //Computer Science
    DS = "DS", //Data Science
    ML = "ML", //Microbiology
    CM = "CM", //Computation and Management
    ES = "ES", //Environmental Science
    MB = "MB", //Molecular Biology
    PH = "PH", //Physics
    ALL = "ALL"
}

// Interface for the fetched student data
interface StudentData {
    interviewID: string;
    studentID: string;
    status: string;
    type: 'prelisted' | 'walkin';
    student: {
        regNo: string;
        group: string;
        user: {
            first_name: string;
            last_name: string;
        };
    };
}

interface QueueCardProps {
    companyName: string;
    stallNumber: string;
    prelistedStudents: StudentData[];
    walkinStudents: StudentData[];
    onStudentClick: (studentId: string) => void;
    loading?: boolean;
}

const QueueCard = ({ companyName, stallNumber, prelistedStudents, walkinStudents, onStudentClick, loading }: QueueCardProps) => {
    const getStatusStyles = (status: string, type: string) => {
        if (type === 'prelisted') {
            switch (status) {
                case 'interviewing':
                    return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
                default:
                    return "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200";
            }
        } else { // 'walkin'
            switch (status) {
                case 'interviewing':
                    return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
                case 'waiting':
                    return "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200";
                case 'missed':
                    return "bg-red-100 text-red-800 border-red-300 hover:bg-red-200";
                default:
                    return "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200";
            }
        }
    };

    const renderStudentList = (students: StudentData[]) => (
        students.map((student) => (
            <Button
                key={student.interviewID}
                onClick={() => onStudentClick(student.interviewID)}
                className={`w-full justify-start p-3 h-auto border ${getStatusStyles(student.status, student.type)}`}
                disabled={loading}
            >
                <span className="font-semibold mr-3">{student.student.regNo}</span>
                <span className="truncate">{student.student.user.first_name} {student.student.user.last_name}</span>
            </Button>
        ))
    );

    if (loading) {
        return (
            <Card className="w-full rounded-lg p-6 text-black space-y-4 bg-white h-full">
                <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500">Loading queue...</div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="w-full rounded-lg p-6 text-black space-y-4 bg-white h-full overflow-y-auto">
            {/* Company Name + Stall */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h2 className="text-xl font-bold">{companyName}</h2>
                <span className="text-sm text-gray-500">{stallNumber}</span>
            </div>

            {/* Divider Line */}
            <hr className="border-gray-200" />

            {/* Pre-listed Queue */}
            <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-blue-700">Pre-listed Queue</h3>
                {prelistedStudents.length > 0 ? (
                    renderStudentList(prelistedStudents)
                ) : (
                    <p className="text-sm text-gray-500">No pre-listed students in the queue.</p>
                )}
            </div>

            {/* Walk-in Queue */}
            <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-amber-700">Walk-in Queue</h3>
                {walkinStudents.length > 0 ? (
                    renderStudentList(walkinStudents)
                ) : (
                    <p className="text-sm text-gray-500">No walk-in students in the queue.</p>
                )}
            </div>
        </Card>
    );
};

export default function ResumePage() {
    const searchParams = useSearchParams();
    const companyID = searchParams.get('companyId');
    const stallID = searchParams.get('stallId');

    const [currentInterviewID, setCurrentInterviewID] = useState<string | null>(null);
    const [prelistedStudents, setPrelistedStudents] = useState<StudentData[]>([]);
    const [walkinStudents, setWalkinStudents] = useState<StudentData[]>([]);
    const [companyName, setCompanyName] = useState<string>('');
    const [stallNumber, setStallNumber] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [selectedPreference, setSelectedPreference] = useState<Preference>(Preference.ALL);
    const [currentCvFileName, setCurrentCvFileName] = useState<string | null>(null);
    // NEW: State to track if this is the initial data load
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const activeStudents = useMemo(() => [...prelistedStudents, ...walkinStudents], [prelistedStudents, walkinStudents]);
    const currentStudent = useMemo(() => activeStudents.find(s => s.interviewID === currentInterviewID), [activeStudents, currentInterviewID]);
    const maxSize = 15;

    const fetchCompanyAndStallData = async () => {
        if (!companyID || !stallID) return;
        try {
            const [companyResponse, stallResponse] = await Promise.all([
                api.get(`/company/${companyID}`),
                api.get(`/stall/${stallID}`)
            ]);
            setCompanyName(companyResponse.data.companyName);
            setStallNumber(stallResponse.data.stallNumber);
        } catch (error) {
            console.error("Failed to fetch company or stall data:", error);
        }
    };

    const fetchCvFileName = async (studentId: string) => {
        try {
            const { data } = await api.get(`/cv/student/${studentId}`);
            setCurrentCvFileName(data?.fileName || null);
        } catch (error) {
            console.error(`Failed to fetch CV for student ${studentId}:`, error);
            setCurrentCvFileName(null);
        }
    };

    const fillEmptySlots = async () => {
        if (!companyID || !stallID) return;
        const slotsToFill = maxSize - activeStudents.length;

        if (slotsToFill > 0) {
            try {
                await api.get(`/interview/company/${companyID}/stall/${stallID}/next-walkin?count=${slotsToFill}`);
                await refreshQueue(); // Refresh the queue after filling slots
            } catch (error) {
                console.error("Failed to fill empty slots:", error);
            }
        }
    };

    const refreshQueue = async () => {
        if (!stallID || !companyID) return;
        setLoading(true);
        try {
            const { data: fetchedPrelisted } = await api.get(`/interview/company/${companyID}/prelisted/inqueue`);
            const { data: fetchedWalkin } = await api.get(`/interview/stall/${stallID}/inqueue`);

            setPrelistedStudents(fetchedPrelisted);
            setWalkinStudents(fetchedWalkin)

        } catch (error) {
            console.error("Failed to fetch queue:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStudentClick = (interviewId: string) => {
        setCurrentInterviewID(interviewId);
    };

    // Main effect for polling
    useEffect(() => {
        if (companyID && stallID) {
            fetchCompanyAndStallData();
            refreshQueue().then(() => fillEmptySlots());

            const interval = setInterval(() => {
                refreshQueue().then(() => fillEmptySlots());
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [companyID, stallID]);

    // NEW: Effect to select the first student ONLY on the initial load
    useEffect(() => {
        if (isInitialLoad && activeStudents.length > 0 && !currentInterviewID) {
            const firstStudent = activeStudents[0];
            setCurrentInterviewID(firstStudent.interviewID);
            setIsInitialLoad(false); // Ensure this only runs once
        }
    }, [activeStudents, isInitialLoad, currentInterviewID]);

    // Effect to fetch CV when the current student changes
    useEffect(() => {
        if (currentStudent) {
            fetchCvFileName(currentStudent.studentID);
        } else {
            setCurrentCvFileName(null);
        }
    }, [currentStudent]);

    const handleFinishInterview = async () => {
        if (!currentStudent) return;

        const currentIndex = activeStudents.findIndex(s => s.interviewID === currentStudent.interviewID);
        const nextStudent = activeStudents[currentIndex + 1] || null;

        try {
            await api.patch(`/interview/${currentStudent.interviewID}/complete`);
            // Select the next student immediately for a smoother UI experience
            setCurrentInterviewID(nextStudent?.interviewID || null);
            // Then refresh the queue from the backend
            await refreshQueue();
            await fillEmptySlots();
        } catch (error) {
            console.error("Failed to finish interview:", error);
        }
    };

    const filteredPrelisted = prelistedStudents.filter(student => selectedPreference === Preference.ALL || student.student.group.toUpperCase().includes(selectedPreference));
    const filteredWalkin = walkinStudents.filter(student => selectedPreference === Preference.ALL || student.student.group.toUpperCase().includes(selectedPreference));

    const currentStudentType = currentStudent?.type === 'walkin' ? 'Walk-in' : 'Pre-Listed';
    const pdfSource = currentCvFileName ? `https://drive.google.com/file/d/${currentCvFileName}/preview` : 'about:blank';

    return (
        <div className="bg-transparent w-full p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)]">
                <div className="lg:col-span-2 flex flex-col gap-4 h-full">
                    <Card className="flex flex-row justify-between items-center p-3 bg-white">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Select value={selectedPreference} onValueChange={(value: Preference) => setSelectedPreference(value)} disabled={loading}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by Stream" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(Preference).map(pref => <SelectItem key={pref} value={pref}>{pref}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {currentStudent && (
                                <Badge className={`py-1 px-3 ${currentStudent.type === 'prelisted' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>{currentStudentType} Student</Badge>
                            )}
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 py-1 px-3">
                                Position: {currentStudent ? activeStudents.findIndex(s => s.interviewID === currentStudent.interviewID) + 1 : 'N/A'}
                            </Badge>
                        </div>
                        <Button onClick={handleFinishInterview} className='border bg-blue-600 text-white hover:bg-blue-700' disabled={loading || !currentStudent}>
                            {loading ? 'Loading...' : 'Finish Interview'}
                        </Button>
                    </Card>
                    <Card className="flex-1 w-full h-full">
                        {loading && !currentStudent ? (
                            <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>
                        ) : currentStudent ? (
                            <iframe
                                src={pdfSource}
                                className="w-full h-full border-0 px-2"
                                title={`PDF Viewer - ${currentStudent.student.user.first_name}`}
                                key={currentStudent.interviewID}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">No students in the queue.</div>
                        )}
                    </Card>
                </div>
                <div className="lg:col-span-1 h-full overflow-y-auto">
                    <QueueCard
                        companyName={companyName}
                        stallNumber={stallNumber}
                        prelistedStudents={filteredPrelisted}
                        walkinStudents={filteredWalkin}
                        onStudentClick={handleStudentClick}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}