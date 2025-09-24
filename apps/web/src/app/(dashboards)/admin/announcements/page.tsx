"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit3 } from "lucide-react";
import api from "@/lib/axios";

interface Announcement {
    announcementID: string;
    title: string;
    description: string;
    audience: string;
    timestamp: string;
}

interface ApiAnnouncement {
    announcementID: string;
    title: string;
    content: string;
    audienceType: string;
    created_at: string;
}

interface AdminResponse {
    adminID: string;
    userID: string;
    designation: string;
    user: {
        userID: string;
        email: string;
        first_name: string;
        last_name: string;
    };
}

export default function AnnouncementBoard() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [audience, setAudience] = useState<string>("");
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [adminUserId, setAdminUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the authenticated admin's profile
                const adminRes = await api.get<AdminResponse>("/admin/by-user");
                const fetchedAdmin: AdminResponse = adminRes.data;
                const userId = fetchedAdmin.userID;
                setAdminUserId(userId);

                // Use the user ID to fetch their announcements
                const announcementsRes = await api.get(`/announcement/user`);
                
                const fetchedAnnouncements: Announcement[] = (announcementsRes.data as ApiAnnouncement[]).map((a) => ({
                    announcementID: a.announcementID,
                    title: a.title,
                    description: a.content,
                    audience: a.audienceType,
                    timestamp: new Date(a.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                }));
                
                setAnnouncements(fetchedAnnouncements);
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                setError("Failed to load announcements.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title || !description || !audience) {
            alert("Please fill all fields.");
            return;
        }

        const payload = {
            title,
            content: description,
            audienceType: audience.toUpperCase(),
        };

        try {
            const res = await api.post("/announcement", payload);
            const newAnnouncement: Announcement = {
                announcementID: res.data.announcementID,
                title: res.data.title,
                description: res.data.content,
                audience: res.data.audienceType,
                timestamp: new Date(res.data.created_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
            };
            setAnnouncements([newAnnouncement, ...announcements]);

            setTitle("");
            setDescription("");
            setAudience("");
            alert("Announcement posted successfully!");

        } catch (error) {
            console.error("Failed to post announcement:", error);
            alert("Failed to post announcement.");
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = confirm("Are you sure you want to delete this announcement?");
        if (!confirmed) return;

        try {
            await api.delete(`/announcement/${id}`);
            setAnnouncements(announcements.filter(a => a.announcementID !== id));
            alert("Announcement deleted successfully!");
        } catch (error) {
            console.error("Failed to delete announcement:", error);
            alert("Failed to delete announcement.");
        }
    };

    const handleEdit = (id: string) => {
        const toEdit = announcements.find(a => a.announcementID === id);
        if (toEdit) {
            setTitle(toEdit.title);
            setDescription(toEdit.description);
            setAudience(toEdit.audience);
            setAnnouncements(announcements.filter(a => a.announcementID !== id));
        }
    };

    if (loading) return <div className="text-center py-8">Loading announcements...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-transparent">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="grid gap-6 lg:gap-8">
                    <Card className="bg-slate-100/80 border-bulletin-shadow shadow-lg ">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                Post Announcements
                            </CardTitle>
                            <CardDescription>Fill the fields below to add a new announcement</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Enter announcement title"
                                            className="bg-card"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="audience" className="text-sm font-medium">Audience</Label>
                                        <Select value={audience} onValueChange={setAudience} required>
                                            <SelectTrigger className="bg-card">
                                                <SelectValue placeholder="Select audience" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All</SelectItem>
                                                <SelectItem value="STUDENTS">Students</SelectItem>
                                                <SelectItem value="COMPANIES">Companies</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter announcement details"
                                        className="bg-card min-h-[100px] resize-none"
                                        required
                                    />
                                </div>
                                <Button variant="outline" className="w-full sm:w-auto">
                                    Post Announcement
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                    {announcements.length > 0 && (
                        <Card className="bg-secondary border-bulletin-shadow shadow-lg">
                            <CardHeader className="text-center pb-4">
                                <CardTitle className="text-lg sm:text-xl flex items-center justify-center gap-2">
                                    <div className="w-3 h-3 bg-bulletin-pin rounded-full shadow-sm"></div>
                                    Recent Announcements
                                </CardTitle>
                                <CardDescription>Your posted updates and announcements</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:gap-5">
                                    {announcements.map((announcement) => (
                                        <div
                                            key={announcement.announcementID}
                                            className="bg-bulletin-paper p-4 sm:p-5 rounded-lg border border-bulletin-shadow relative shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <Button
                                                onClick={() => handleDelete(announcement.announcementID)}
                                                className="absolute top-3 right-3 w-8 h-8 p-0"
                                                variant="destructive"
                                                size="sm"
                                                aria-label="Delete announcement"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                            <div className="pr-12">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <div className="w-2 h-2 bg-bulletin-pin rounded-full mt-2 shrink-0"></div>
                                                    <h3 className="text-base sm:text-lg font-semibold leading-tight">
                                                        {announcement.title}
                                                    </h3>
                                                </div>
                                                <p className="text-muted-foreground mb-3 text-sm sm:text-base leading-relaxed">
                                                    {announcement.description}
                                                </p>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-medium">To: {announcement.audience}</span>
                                                        <span>Posted at {announcement.timestamp}</span>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEdit(announcement.announcementID)}
                                                        className="self-start sm:self-auto"
                                                    >
                                                        <Edit3 className="w-3 h-3 mr-1" />
                                                        Edit
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {announcements.length === 0 && (
                        <div className="text-center py-8 sm:py-12">
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">No announcements yet</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                Start by posting your first announcement using the form above.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
