"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

export default function StallsGroupCard() {
    const [stalls, setStalls] = useState([
        { id: 1, name: "MAS Holdings", label: "Stall 1" },
        { id: 2, name: "MAS Holdings", label: "Stall 2" },
    ]);

    const handleRemove = (id: number) => {
        setStalls((prev) => prev.filter((stall) => stall.id !== id));
    };

    const handleAddStall = () => {
        const nextID = stalls.length > 0 ? Math.max(...stalls.map(s => s.id)) + 1 : 1;
        setStalls((prev) => [
            ...prev,
            {
                id: nextID,
                name: `MAS Holdings`,
                label: `Stall ${nextID}`,
            },
        ]);
    };

    return (
        <div className="mt-3 mx-auto p-4">
            <Card className="mt-3 bg-slate-100/80">
                <CardHeader>
                    <CardTitle className="text-2xl">MLT</CardTitle>
                    <CardDescription>S/20/333</CardDescription>
                </CardHeader>

                <CardContent>
                    {stalls.map((stall) => (
                        <Card key={stall.id} className="relative mb-4">
                            {/* Destructive X Button */}
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 p-1 bg-red-400"
                                onClick={() => handleRemove(stall.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>

                            <CardHeader>
                                <CardTitle>{stall.name}</CardTitle>
                                <CardDescription>{stall.label}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Optional content here */}
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>

                <CardFooter className="flex flex-col justify-center items-center">
                    <CardDescription>
                        To add more interview stalls, contact the respective room admin
                    </CardDescription>
                    <Button
                        onClick={handleAddStall}
                        variant="secondary"
                        className="ml-auto w-full mt-3"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Stall
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
