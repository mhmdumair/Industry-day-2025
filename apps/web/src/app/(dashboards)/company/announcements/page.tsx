"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit3 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import announcement from "@/components/custom/announcement";

interface Announcement {
    announcementID: string;
    title: string;
    description: string;
    audience: string;
    timestamp: string;
}

interface UserProfile {
    userID: string;
    role: string;
}

export default function CompanyAnnouncementsPage() {
    const router = useRouter();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [audience, setAudience] = useState<string>("");
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const announcementsRes = await api.get(`/announcement/user`);
                
                // @ts-expect-error
                const fetchedAnnouncements: Announcement[] = announcementsRes.data.map((a: announcement) => ({
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
                if (error instanceof AxiosError && error.response?.status === 401) {
                    router.push('/auth/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

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
            setEditingAnnouncement(null);
            alert("Announcement posted successfully!");

        } catch (error) {
            console.error("Failed to post announcement:", error);
            if (error instanceof AxiosError && error.response?.status === 401) {
                router.push('/auth/login');
            } else {
                alert("Failed to post announcement.");
            }
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/announcement/${id}`);
            setAnnouncements(announcements.filter(a => a.announcementID !== id));
            alert("Announcement deleted successfully!");
        } catch (error) {
            console.error("Failed to delete announcement:", error);
            if (error instanceof AxiosError && error.response?.status === 401) {
                router.push('/auth/login');
            } else {
                alert("Failed to delete announcement.");
            }
        }
    };

    const handleCancelEdit = () => {
        if (editingAnnouncement) {
            setAnnouncements([editingAnnouncement, ...announcements]);
            setTitle("");
            setDescription("");
            setAudience("");
            setEditingAnnouncement(null);
        }
    };

    const handleEdit = (id: string) => {
        const toEdit = announcements.find(a => a.announcementID === id);
        if (toEdit) {
            setEditingAnnouncement(toEdit);
            setTitle(toEdit.title);
            setDescription(toEdit.description);
            setAudience(toEdit.audience);
            setAnnouncements(announcements.filter(a => a.announcementID !== id));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-4 min-h-[500px] items-center bg-white dark:bg-black">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* 2 Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Post Announcement Form */}
                    <div className="space-y-6">
                        <Card className="rounded-none bg-slate-100/80 dark:bg-black border-1 shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                    Post Company Announcements
                                </CardTitle>
                                <CardDescription>Fill the fields below to add a new company announcement</CardDescription>
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
                                                className="rounded-none bg-card dark:bg-black dark:text-white"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="audience" className="text-sm font-medium">Audience</Label>
                                            <Select value={audience} onValueChange={setAudience} required>
                                                <SelectTrigger className="rounded-none bg-card dark:bg-black dark:text-white">
                                                    <SelectValue placeholder="Select audience" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-none">
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
                                            className="rounded-none bg-card dark:bg-black dark:text-white min-h-[100px] resize-none"
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="default" className="rounded-none w-full sm:w-auto" type="submit">
                                            {editingAnnouncement ? "Update Announcement" : "Post Announcement"}
                                        </Button>
                                        {editingAnnouncement && (
                                            <Button variant="outline" className="rounded-none w-full sm:w-auto" onClick={handleCancelEdit} type="button">
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Posted Announcements */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold dark:text-white">Posted Announcements</h2>
                        {announcements.length > 0 ? (
                            <div className="space-y-4">
                                {announcements.map((announcement) => (
                                    <Card
                                        key={announcement.announcementID}
                                        className="rounded-none bg-white dark:bg-black border-1 shadow-sm hover:shadow-md transition-shadow relative"
                                    >
                                        <CardContent className="p-4 sm:p-5">
                                            <div className="absolute top-3 right-3 flex gap-2">
                                                <Button
                                                    onClick={() => handleEdit(announcement.announcementID)}
                                                    className="rounded-none w-8 h-8 p-0"
                                                    variant="outline"
                                                    size="sm"
                                                    aria-label="Edit announcement"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(announcement.announcementID)}
                                                    className="rounded-none w-8 h-8 p-0"
                                                    variant="destructive"
                                                    size="sm"
                                                    aria-label="Delete announcement"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="pr-20">
                                                <div className="flex items-start gap-2 mb-2">
                                                    <h3 className="text-base sm:text-lg font-semibold leading-tight dark:text-white">
                                                        {announcement.title}
                                                    </h3>
                                                </div>
                                                <p className="text-muted-foreground dark:text-gray-400 mb-3 text-sm sm:text-base leading-relaxed">
                                                    {announcement.description}
                                                </p>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground dark:text-gray-400">
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-medium">To: {announcement.audience}</span>
                                                        <span>Posted at {announcement.timestamp}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="rounded-none bg-white dark:bg-black border-1 shadow-sm">
                                <CardContent className="text-center py-8 sm:py-12">
                                    <h3 className="text-lg font-medium text-muted-foreground dark:text-gray-400 mb-2">No company announcements yet</h3>
                                    <p className="text-sm text-muted-foreground dark:text-gray-500 max-w-sm mx-auto">
                                        Start by posting your first company announcement using the form on the left.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}