"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

const page = () => {
    const router = useRouter();

    const handleStall1Click = () => {
        router.push("http://localhost:3000/company/interviews/queue");
    }

    return (
        <div className="mt-3 mx-auto p-4">
            <Card className="mt-3 bg-slate-100/80">
                <CardHeader>
                    <CardTitle>Interviews</CardTitle>
                    <CardDescription>List of all interview stalls</CardDescription>
                </CardHeader>
                <CardContent>

                    {/* Stall 1 - Clickable */}
                    <div onClick={handleStall1Click} className="cursor-pointer">
                        <Card className="mb-2 hover:bg-slate-200 transition-colors duration-150">
                            <CardHeader>
                                <CardTitle>Stall 1</CardTitle>
                                <CardDescription>Location: Physics Upper Hall</CardDescription>
                            </CardHeader>
                            <CardContent />
                        </Card>
                    </div>

                    {/* Stall 2 - Static */}
                    <Card className="m-auto mb-5">
                        <CardHeader>
                            <CardTitle>Stall 2</CardTitle>
                            <CardDescription>Location: Physics Upper Hall</CardDescription>
                        </CardHeader>
                        <CardContent />
                    </Card>

                </CardContent>
                <CardFooter className="m-0">
                    <CardDescription>To add more interview stalls, contact the respective room admin</CardDescription>
                </CardFooter>

                {/* Room Admin Info */}
                <Card className="m-4 bg-teal-800/60 border-green-950">
                    <CardHeader>
                        <CardTitle>Room Admin</CardTitle>
                        <CardDescription className="text-teal-950">Location: Physics Upper Hall</CardDescription>
                    </CardHeader>
                    <CardContent>
                        Name: John Doe<br />
                        Email: johndoe@example.com<br />
                        Contact: +1234567890
                    </CardContent>
                </Card>

            </Card>
        </div>
    );
}

export default page