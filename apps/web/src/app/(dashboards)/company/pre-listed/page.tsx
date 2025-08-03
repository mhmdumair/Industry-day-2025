"use client";
import React from 'react'
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Plus, Search} from "lucide-react";

export default function CompanyFilter() {
    return (
        <div className="mt-3 w-screen mx-auto p-4  flex flex-col items-center justify-center gap-5">
            {/* Content Area */}
                <div className="flex justify-center w-11/12 p-4">
                    <Card className="bg-slate-100/80 w-11/12 max-w-2xl rounded-lg shadow-md p-6 text-black space-y-4">
                        <CardHeader className="text-center text-xl font-semibold text-black">Pre-Listed Students</CardHeader>
                        <CardContent>

                            {/* Search */}
                            <div className="flex flex-col md:flex-row w-full gap-2 pb-2">
                                <Input
                                    placeholder="Search students..."
                                    className="w-full border border-slate-400"
                                />
                                <Button
                                    className="w-full md:w-1/4 bg-slate-200/80 border border-black text-black hover:bg-slate-300"
                                    variant="outline"
                                >
                                    <Search size={16} />
                                </Button>
                            </div>

                            {/* Found */}
                            <Card className="bg-teal-100/80 border border-teal-600 text-black">
                                <CardHeader>
                                    <CardTitle>Student found!</CardTitle>
                                    <CardDescription>Click + to pre-list student</CardDescription>
                                    <div className="flex w-full justify-between gap-2 mt-2">
                                        <Button
                                            className="bg-teal-200/80 border w-1/2 border-teal-800 text-slate-600 hover:bg-slate-200/80"
                                            variant="outline"
                                        >
                                            Anuka Hettiarachchi - S/20/381
                                        </Button>
                                        <Button
                                            className="bg-slate-200/80 border border-slate-600 text-slate-600 hover:bg-slate-200/80 flex items-center justify-center"
                                            variant="outline"
                                        >
                                            <Plus size={16} />Add
                                        </Button>
                                    </div>
                                </CardHeader>
                            </Card>

                            {/* Queue */}
                        <Card className="flex flex-col gap-2 p-4 mt-3 mb-3 bg-slate-100/80">
                            <Button className="bg-amber-100 text-amber-600 w-full border border-amber-600 hover:bg-amber-100 hover:text-amber-600">
                                S2000
                            </Button>
                            {["S2001", "S2002", "S2003", "S2004", "S2005"].map((regNo, i) => (
                                <Button
                                    key={regNo}
                                    className="bg-amber-100 text-amber-600 w-full border border-amber-600 hover:bg-amber-100 hover:text-amber-600"
                                >
                                    {regNo}
                                </Button>
                            ))}
                        </Card>
                            <Card className="flex items-center justify-center bg-slate-100/80 border">
                                <Button
                                    className="w-11/12 mt-2 bg-blue-200/80 border border-blue-400 text-black hover:bg-slate-300 flex items-center justify-center"
                                    variant="outline"
                                >
                                    Confirm Pre-Listed Students
                                </Button>
                            </Card>
                        </CardContent>
                    </Card>
                </div>
        </div>
    );
}