'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

interface CompanyProfile {
  companyID: string;
  userID: string;
  companyName: string;
}

interface Stall {
    stallID: string;
    title: string;
    roomID: string;
    companyID: string;
    preference: string;
    status: string;
    room: {
      roomName: string;
      location: string;
    }
}

interface QueueCardProps {
    companyName: string;
    stallNumber: string;
    prelistedStudents: StudentData[];
    walkinStudents: StudentData[];
    onStudentClick: (studentId: string) => void;
}

const QueueCard = ({ companyName, stallNumber, prelistedStudents, walkinStudents, onStudentClick }: QueueCardProps) => {
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
            >
                <span className="font-semibold mr-3">{student.student.regNo}</span>
                <span className="truncate">{student.student.user.first_name} {student.student.user.last_name}</span>
            </Button>
        ))
    );

    return (
        <Card className="w-full rounded-lg p-6 text-black space-y-4 bg-white h-fit">
            {/* Company Name + Stall */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h2 className="text-xl font-bold">{companyName}</h2>
                <span className="text-sm text-gray-500">{stallNumber}</span>
            </div>

            {/* Divider Line */}
            <hr className="border-gray-200" />

            {/* Pre-listed Queue */}
            <div className="flex flex-col gap-3 h-fit">
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
    const router = useRouter();

    const [currentInterviewID, setCurrentInterviewID] = useState<string | null>(null);
    const [prelistedStudents, setPrelistedStudents] = useState<StudentData[]>([]);
    const [walkinStudents, setWalkinStudents] = useState<StudentData[]>([]);
    const [companyName, setCompanyName] = useState<string>('');
    const [stallNumber, setStallNumber] = useState<string>('');
    const [currentCvFileName, setCurrentCvFileName] = useState<string | null>(null);
    const [companyID, setCompanyID] = useState<string | null>(null);
    const [stallID, setStallID] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const activeStudents = [...prelistedStudents, ...walkinStudents];
    const currentStudent = activeStudents.find(s => s.interviewID === currentInterviewID) || activeStudents[0];
    const maxSize = 15;

    const fetchCvFileName = useCallback(async (studentId: string) => {
        try {
            const { data } = await api.get(`/cv/student/${studentId}/list`);
            if (data && data.length > 0) {
                setCurrentCvFileName(data[0].fileName);
            } else {
                setCurrentCvFileName(null);
            }
        } catch (error) {
            console.error(`Failed to fetch CV for student ${studentId}:`, error);
            setCurrentCvFileName(null);
        }
    }, []);
    
    const refreshQueue = useCallback(async (companyId: string, stallId: string) => {
        try {
            const { data: fetchedPrelisted } = await api.get(`/interview/company/${companyId}/prelisted/inqueue`);
            const { data: fetchedWalkin } = await api.get(`/interview/stall/${stallId}/inqueue`);

            setPrelistedStudents(fetchedPrelisted);
            setWalkinStudents(fetchedWalkin);
            
            if (!currentInterviewID && fetchedPrelisted.length > 0) {
                setCurrentInterviewID(fetchedPrelisted[0].interviewID);
            } else if (!currentInterviewID && fetchedWalkin.length > 0) {
                setCurrentInterviewID(fetchedWalkin[0].interviewID);
            }
        } catch (error) {
            console.error("Failed to fetch queue:", error);
            setPrelistedStudents([]);
            setWalkinStudents([]);
        }
    }, [currentInterviewID]);

    const fillEmptySlots = useCallback(async (companyId: string, stallId: string) => {
        const slotsToFill = maxSize - (prelistedStudents.length + walkinStudents.length);
        if (slotsToFill > 0) {
            try {
                await api.get(`/interview/company/${companyId}/stall/${stallId}/next-walkin?count=${slotsToFill}`);
                await refreshQueue(companyId, stallId);
            } catch (error) {
                console.error("Failed to fill empty slots:", error);
            }
        }
    }, [prelistedStudents.length, walkinStudents.length, refreshQueue]);
        
    const handleStudentClick = useCallback((interviewId: string) => {
        setCurrentInterviewID(interviewId);
        const selectedStudent = activeStudents.find(s => s.interviewID === interviewId);
        if (selectedStudent) {
            fetchCvFileName(selectedStudent.studentID);
        }
    }, [activeStudents, fetchCvFileName]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const companyResponse = await api.get<CompanyProfile>('/company/by-user');
                const companyId = companyResponse.data.companyID;
                setCompanyName(companyResponse.data.companyName);
                setCompanyID(companyId);

                const stallsResponse = await api.get<Stall[]>(`/stall/company/${companyId}`);
                if (stallsResponse.data.length > 0) {
                  const stallId = stallsResponse.data[0].stallID;
                  setStallID(stallId);
                  setStallNumber(stallsResponse.data[0].title);
                  await refreshQueue(companyId, stallId);
                  await fillEmptySlots(companyId, stallId);

                  const interval = setInterval(() => {
                      refreshQueue(companyId, stallId);
                      fillEmptySlots(companyId, stallId);
                  }, 10000);
                  
                  return () => clearInterval(interval);
                }

            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [refreshQueue, fillEmptySlots]);

    useEffect(() => {
        if (currentStudent && currentStudent.studentID) {
            fetchCvFileName(currentStudent.studentID);
        }
    }, [currentStudent, fetchCvFileName]);

    const handleFinishInterview = async () => {
        if (!currentStudent || !companyID || !stallID) return;
        try {
            await api.patch(`/interview/${currentStudent.interviewID}/complete`);
            
            await refreshQueue(companyID, stallID);
            
            const nextStudentIndex = activeStudents.findIndex((s: StudentData) => s.interviewID === currentStudent.interviewID) + 1;
            if (nextStudentIndex < activeStudents.length) {
                setCurrentInterviewID(activeStudents[nextStudentIndex]?.interviewID);
                fetchCvFileName(activeStudents[nextStudentIndex]?.studentID); 
            } else {
                setCurrentInterviewID(null);
                setCurrentCvFileName(null);
            }
            
            await fillEmptySlots(companyID, stallID);

        } catch (error) {
            console.error("Failed to finish interview:", error);
        }
    };


    const currentStudentType = currentStudent?.type === 'walkin' ? 'Walk-in' : 'Pre-Listed';
    
    const pdfSource = currentCvFileName 
        ? `https://drive.google.com/file/d/${currentCvFileName}/preview` 
        : 'about:blank'; 

    if (loading) {
        return (
            <div className="bg-transparent w-full p-4 lg:p-6">
                <div className="flex justify-center p-4 min-h-[500px] items-center">
                    <div className="animate-pulse text-lg text-muted-foreground">Loading...</div>
                </div>
            </div>
        )
    }

    if (!companyID || !stallID) {
      return (
        <div className="bg-transparent w-full p-4 lg:p-6">
          <div className="flex justify-center p-4 min-h-[500px] items-center text-destructive text-lg">
            Failed to load company or stall data. Please try again later.
          </div>
        </div>
      );
    }
    
    return (
        <div className="bg-transparent w-full p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)]">

                {/* Left Section: PDF Viewer */}
                <div className="lg:col-span-2 flex flex-col gap-4 h-full">
                    <Card className="flex flex-row justify-between items-center p-3 bg-white">
                        <div className="flex items-center gap-2">
                
                            {currentStudent && (
                                <Badge className={`py-1 px-3 ${currentStudent.type === 'prelisted' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {currentStudentType} Student
                                </Badge>
                            )}
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 py-1 px-3">
                                Position: {currentStudent ? activeStudents.findIndex((s: StudentData) => s.interviewID === currentStudent.interviewID) + 1 : 'N/A'}
                            </Badge>
                        </div>
                        <Button onClick={handleFinishInterview} className='border bg-blue-600 text-white hover:bg-blue-700'>
                            Finish Interview
                        </Button>
                    </Card>

                    {/* PDF iframe Container */}
                    <Card className="flex-1 w-full h-full">
                        {currentStudent ? (
                            <iframe
                                src={pdfSource}
                                className="w-full h-full border-0 px-2"
                                title={`PDF Viewer - ${currentStudent.student.user.first_name} ${currentStudent.student.user.last_name}`}
                                key={currentStudent.interviewID}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                No students in the queue.
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Section: Queue Card */}
                <div className="lg:col-span-1 h-full overflow-y-auto">
                    <QueueCard
                        companyName={companyName}
                        stallNumber={stallNumber}
                        prelistedStudents={prelistedStudents}
                        walkinStudents={walkinStudents}
                        onStudentClick={handleStudentClick}
                    />
                </div>
            </div>
        </div>
    );
}