"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2, X } from "lucide-react";
import api from "../../../../lib/axios";
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

interface User {
    userID: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
    created_at: string;
    updated_at: string;
}
interface Student {
    studentID: string;
    userID: string;
    regNo: string;
    nic: string;
    linkedin: string | null;
    contact: string;
    group: string;
    level: string;
    created_at: string;
    user: User;
}
interface Interview {
    interviewID: string;
    studentID: string;
    companyID: string;
    stallID: string | null;
    type: string;
    status: string;
    student_preference: number;
    company_preference: number;
    remark: string | null;
    student: Student;
}

export default function CompanyFilter() {
    const router = useRouter();
    const [tempStudents, setTempStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [preListedStudents, setPreListedStudents] = useState<Student[]>([]);
    const [existingPreListedStudents, setExistingPreListedStudents] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingExisting, setLoadingExisting] = useState(false);
    const [removingStudents, setRemovingStudents] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);
    const [companyId, setCompanyId] = useState<string | null>(null);

    /* ----------------  init  ---------------- */
    useEffect(() => {
        const fetchCompanyId = async () => {
            try {
                const res = await api.get('/company/by-user');
                const fetchedCompanyId = res.data.companyID;
                setCompanyId(fetchedCompanyId);
            } catch (err) {
                if (err instanceof AxiosError && err.response?.status === 401) {
                    router.push('/auth/login');
                } else {
                    setError('Failed to fetch company data');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCompanyId();
    }, [router]);

    useEffect(() => {
        if (companyId) {
            fetchStudentsData();
            fetchExistingPreListedStudents();
        }
    }, [companyId]);

    /* ----------------  fetchers  ---------------- */
    const fetchStudentsData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/student');
            setTempStudents(res.data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to fetch students');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchExistingPreListedStudents = async () => {
        if (!companyId) return;
        try {
            setLoadingExisting(true);
            setExistingPreListedStudents(
                (await api.get(`/interview/company/${companyId}/prelisted`)).data
            );
        } finally { setLoadingExisting(false); }
    };

    /* ----------------  helpers  ---------------- */
    const filteredStudents = useMemo(() => {
        const k = searchTerm.trim().toLowerCase();
        if (!k) return [];
        return tempStudents.filter(s => {
            const full = `${s.user.first_name} ${s.user.last_name}`.toLowerCase();
            return (
                full.includes(k) ||
                s.regNo.toLowerCase().includes(k) ||
                s.user.email.toLowerCase().includes(k) ||
                s.group.toLowerCase().includes(k) ||
                s.level.toLowerCase().includes(k)
            );
        });
    }, [searchTerm, tempStudents]);

    const alreadyListed = (id: string) =>
        preListedStudents.some(s => s.studentID === id) ||
        existingPreListedStudents.some(i => i.studentID === id);

    /* ----------------  actions  ---------------- */
    const addToPreList = (stu: Student) => {
        if (alreadyListed(stu.studentID)) return;
        setPreListedStudents(p => [...p, stu]);
        setSearchTerm('');
    };

    const removeFromPreList = (id: string) =>
        setPreListedStudents(p => p.filter(s => s.studentID !== id));

    const removeExisting = async (ivID: string) => {
        setRemovingStudents(p => new Set(p).add(ivID));
        try {
            await api.delete(`/interview/prelisted/${ivID}`);
            await fetchExistingPreListedStudents();
        } finally {
            setRemovingStudents(p => {
                const n = new Set(p); n.delete(ivID); return n;
            });
        }
    };

    const confirmPreList = async () => {
        if (!companyId || preListedStudents.length === 0) return;
        setLoading(true);
        try {
            const payload = preListedStudents.map(s => ({
                studentID: s.studentID,
                companyID: companyId,
            }));
            await api.post('/interview/prelist/bulk', payload);
            setPreListedStudents([]);
            await fetchExistingPreListedStudents();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to create pre-list');
            }
        } finally {
            setLoading(false);
        }
    };


    /* ----------------  render  ---------------- */
    if (loading) return (
        <div className="mt-3 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading…
        </div>
    );

    if (error) return (
        <div className="mt-3 flex flex-col items-center">
            <p className="text-red-600 mb-2">{error}</p>
            <Button onClick={() => { setError(null); fetchStudentsData(); }}>Retry</Button>
        </div>
    );

    return (
        <div className="mt-3 mx-auto p-4 flex flex-col items-center gap-6">
            <Card className="w-11/12 max-w-2xl bg-slate-100/80">
                <CardHeader>
                    <CardTitle>Pre-List Students</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={e => e.preventDefault()} className="flex gap-2">
                        <Input
                            placeholder="Search name, reg-no, email, group, level…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline"><Search size={16} /></Button>
                    </form>

                    {/* search results */}
                    {filteredStudents.length > 0 && (
                        <div className="space-y-2">
                            {filteredStudents.slice(0, 5).map(stu => (
                                <Card key={stu.studentID} className="border-teal-600 bg-teal-100/80">
                                    <CardHeader className="p-3 flex flex-row justify-between items-start">
                                        <div>
                                            <CardTitle className="text-sm">
                                                {stu.user.first_name} {stu.user.last_name}
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                {stu.regNo} • {stu.group} • {stu.level.replace('_', ' ')}
                                            </CardDescription>
                                            <CardDescription className="text-xs">
                                                {stu.user.email}
                                            </CardDescription>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="bg-teal-600 text-white"
                                            disabled={alreadyListed(stu.studentID)}
                                            onClick={() => addToPreList(stu)}
                                        >
                                            <Plus size={14} /> {alreadyListed(stu.studentID) ? 'Added' : 'Add'}
                                        </Button>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* pending list */}
                    <Card className="bg-white/50 p-4">
                        <h3 className="font-semibold mb-2">Pending ({preListedStudents.length})</h3>
                        {preListedStudents.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center">Nothing added yet</p>
                        ) : preListedStudents.map((stu) => (
                            <div key={stu.studentID} className="flex justify-between items-center border p-2 mb-1 rounded">
                                <div>
                                    <span className="font-medium">{stu.user.first_name} {stu.user.last_name}</span>
                                    <span className="text-xs block">
                                        {stu.regNo} • {stu.group} • {stu.level.split('_')[1]?.concat('000L')}
                                    </span>
                                </div>
                                <Button size="sm" className="bg-red-200" onClick={() => removeFromPreList(stu.studentID)}>
                                    <X size={14} />
                                </Button>
                            </div>
                        ))}
                    </Card>

                    <Button
                        variant="outline"
                        disabled={preListedStudents.length === 0}
                        onClick={confirmPreList}
                        className="w-full bg-blue-200/70 hover:bg-blue-200 border-blue-400"
                    >
                        Confirm Pre-Listed Students ({preListedStudents.length})
                    </Button>
                </CardContent>
            </Card>

            {/* ----------  Existing list  ---------- */}
            <Card className="w-11/12 max-w-2xl bg-slate-100/80">
                <CardHeader>
                    <CardTitle>Current Pre-Listed Students</CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingExisting ? (
                        <div className="flex items-center justify-center p-6">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading…
                        </div>
                    ) : existingPreListedStudents.length === 0 ? (
                        <p className="text-center text-gray-500">None yet</p>
                    ) : existingPreListedStudents.map(iv => (
                        <div key={iv.interviewID} className="flex justify-between items-center border p-2 mb-1 rounded">
                            <div className="flex items-start gap-3">
                                <div className="w-6 text-right">{iv.company_preference}.</div>
                                <div>
                                    <span className="font-medium">{iv.student.user.first_name} {iv.student.user.last_name}</span>
                                    <span className="text-xs block">
                                        {iv.student.regNo} • {iv.student.group} • {iv.student.level.split('_')[1]?.concat('000L')}
                                    </span>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                className="bg-red-200"
                                disabled={removingStudents.has(iv.interviewID)}
                                onClick={() => removeExisting(iv.interviewID)}
                            >
                                {removingStudents.has(iv.interviewID) ? <Loader2 className="animate-spin h-4 w-4" /> : <X size={14} />}
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}