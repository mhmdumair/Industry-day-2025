'use client';

import React, { useState, useEffect } from 'react';
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

// Interface for the QueueCard props
interface QueueCardProps {
    companyName: string;
    stallNumber: string;
    prelistedStudents: StudentData[];
    walkinStudents: StudentData[];
    onStudentClick: (studentId: string) => void;
}

const QueueCard = ({ companyName, stallNumber, prelistedStudents, walkinStudents, onStudentClick }: QueueCardProps) => {
    // getStatusStyles now only needs status
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
                default: // 'queued'
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
        <Card className="w-full rounded-lg p-6 text-black space-y-4 bg-white h-full">
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


// --- Main Page Component ---
export default function ResumePage() {
    const searchParams = useSearchParams();
    const companyID = searchParams.get('companyId');
    const stallID = searchParams.get('stallId');

    const [currentInterviewID, setCurrentInterviewID] = useState<string | null>(null);
    const [prelistedStudents, setPrelistedStudents] = useState<StudentData[]>([]);
    const [walkinStudents, setWalkinStudents] = useState<StudentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPreference, setSelectedPreference] = useState<Preference>(Preference.ALL);

    const activeStudents = [...prelistedStudents, ...walkinStudents];
    const currentStudent = activeStudents.find(s => s.interviewID === currentInterviewID) || activeStudents[0];
    const maxSize = 30;

    const fillEmptySlots = async () => {
        if (!companyID || !stallID) return;
        const slotsToFill = maxSize - (prelistedStudents.length + walkinStudents.length);

        if (slotsToFill > 0) {
            console.log(`Filling ${slotsToFill} empty slots...`);
            try {
                const { data: newWalkins } = await api.get(`/interview/company/${companyID}/stall/${stallID}/next-walkin?count=${slotsToFill}`);
                console.log("New walk-ins fetched:", newWalkins);
                // After filling slots, re-fetch the entire queue to update the UI
                await refreshQueue();
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
            setWalkinStudents(fetchedWalkin);
            
            // Set the size state with the new data
            // Note: The size state is not directly used in the fillEmptySlots function now, but can be useful for other UI components.
            // Keeping it here for reference.
            // setSize(fetchedPrelisted.length + fetchedWalkin.length);
        } catch (error) {
            console.error("Failed to fetch queue:", error);
            setPrelistedStudents([]);
            setWalkinStudents([]);
            // setSize(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (companyID && stallID) {
            // Initial fetch and fill
            refreshQueue().then(() => {
                fillEmptySlots();
            });

            // Set up a periodic refresh and fill
            const interval = setInterval(() => {
                refreshQueue().then(() => {
                    fillEmptySlots();
                });
            }, 10000);
            
            return () => clearInterval(interval);
        }
    }, [companyID, stallID]);

    const handleFinishInterview = async () => {
        if (!currentStudent) return;
        try {
            await api.patch(`/interview/${currentStudent.interviewID}/complete`);
            
            // Re-fetch the queue to update the UI
            await refreshQueue();
            
            const nextStudentIndex = activeStudents.findIndex((s: StudentData) => s.interviewID === currentStudent.interviewID) + 1;
            if (nextStudentIndex < activeStudents.length) {
                setCurrentInterviewID(activeStudents[nextStudentIndex]?.interviewID);
            } else {
                setCurrentInterviewID(null);
            }
            
            // Fill empty slots immediately after an interview finishes
            await fillEmptySlots();

        } catch (error) {
            console.error("Failed to finish interview:", error);
        }
    };

    const filteredPrelisted = selectedPreference === Preference.ALL
        ? prelistedStudents
        : prelistedStudents.filter((student: StudentData) => student.student.group.toUpperCase().includes(selectedPreference));

    const filteredWalkin = selectedPreference === Preference.ALL
        ? walkinStudents
        : walkinStudents.filter((student: StudentData) => student.student.group.toUpperCase().includes(selectedPreference));

    const currentStudentType = currentStudent?.type === 'walkin' ? 'Walk-in' : 'Pre-Listed';

    return (
        <div className="bg-transparent w-full p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)]">

                {/* Left Section: PDF Viewer */}
                <div className="lg:col-span-2 flex flex-col gap-4 h-full">
                    <Card className="flex flex-row justify-between items-center p-3 bg-white">
                        <div className="flex items-center gap-2">
                            {/* Preference Stream Dropdown */}
                            <Select
                                value={selectedPreference}
                                onValueChange={(value: Preference) => setSelectedPreference(value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by Stream" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(Preference).map(pref => (
                                        <SelectItem key={pref} value={pref}>
                                            {pref}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                src={`https://drive.google.com/file/d/1PpmNJO4Ibol0gzjggzzJwBQW01fm7J7J/preview`}
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
                        companyName="MAS Holdings"
                        stallNumber="Stall 1"
                        prelistedStudents={filteredPrelisted}
                        walkinStudents={filteredWalkin}
                        onStudentClick={setCurrentInterviewID}
                    />
                </div>
            </div>
        </div>
    );
}