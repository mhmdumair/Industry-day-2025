"use client";
import React from 'react'
import {Button} from "@/components/ui/button";
import {Card, CardHeader} from "@/components/ui/card";

export default function CompanyFilter() {
    return (
        <div className="mt-3 w-screen mx-auto p-4 flex flex-col items-center justify-center gap-5">
            {/* Content Area */}
                <div className="flex justify-center w-11/12 p-4">
                    <Card className="bg-slate-100 w-11/12 max-w-2xl rounded-lg shadow-md p-6 text-black space-y-4">
                        <CardHeader className="text-center text-xl font-semibold text-black">Pre-Listed Students</CardHeader>
                        {/* Divider Line */}
                        <hr className="border-gray-300" />

                        {/* Queue */}
                        <div className="flex flex-col gap-2">
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
                        </div>
                    </Card>
                </div>
        </div>
    );
}