"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface Announcement {
    id: string;
    title: string;
    description: string;
    audience: string;
}

export default function AnnouncementsPage() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [audience, setAudience] = useState<string>("");
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title || !description || !audience) return;

        const newAnnouncement: Announcement = { 
            id: Date.now().toString(), 
            title, 
            description, 
            audience 
        };
        setAnnouncements([newAnnouncement, ...announcements]);

        setTitle("");
        setDescription("");
        setAudience("");
    };

    const handleDelete = (id: string) => {
        setAnnouncements(announcements.filter(a => a.id !== id));
    };

    const handleEdit = (id: string) => {
        const toEdit = announcements.find(a => a.id === id);
        if (toEdit) {
            setTitle(toEdit.title);
            setDescription(toEdit.description);
            setAudience(toEdit.audience);
            setAnnouncements(announcements.filter(a => a.id !== id));
        }
    };

    return (
        <div className="mt-3 w-screen mx-auto p-4 flex flex-col items-center justify-center gap-5">
            <Card className="bg-slate-100/80 shadow-lg mt-3 w-11/12 -mx-4 h-fit">
                <CardHeader>
                    <CardTitle className="text-xl">Post Announcement</CardTitle>
                    <CardDescription>Fill the fields below to add a new announcement</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter announcement title"
                                className="bg-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter announcement details"
                                className="bg-white"
                            />
                        </div>
                        <div>
                            <Label>To</Label>
                            <Select value={audience} onValueChange={setAudience}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select audience" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Students">Students</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" variant="outline" className="w-full">
                            Post Announcement
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {announcements.length > 0 && (
                <Card className="bg-slate-100/80 shadow-lg mt-3 w-11/12">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Announcements</CardTitle>
                        <p className="text-gray-600 mt-2">Your posted updates and announcements</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {announcements.map((a) => (
                            <div key={a.id} className="bg-slate-50 p-4 rounded-lg shadow-sm relative">
                                {/* Delete button top-right */}
                                <Button
                                    onClick={() => handleDelete(a.id)}
                                    className="absolute top-2 right-2"
                                    aria-label="Delete announcement"
                                    variant="destructive"
                                    size="sm"
                                >
                                    <X className="w-4 h-4" />
                                </Button>

                                <h3 className="text-lg font-semibold pr-10">{a.title}</h3>
                                <p className="text-gray-700 mb-1">{a.description}</p>
                                <span className="text-sm text-gray-500">Audience: {a.audience}</span>
                                <p className="text-sm text-gray-500">19.22</p>
                                {/* Edit button bottom-right */}
                                <div className="flex justify-end mt-4">
                                    <Button size="sm" variant="outline" onClick={() => handleEdit(a.id)}>
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}