"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Edit3, Megaphone } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  description: string;
  audience: string;
  timestamp: string;
}

export default function AnnouncementBoard() {
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
      audience,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
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
      <div className="min-h-screen bg-transparent">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="grid gap-6 lg:gap-8">
            {/* Post Form */}
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
                          <SelectItem value="Students">Students</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
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

            {/* Announcements List */}
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
                              key={announcement.id}
                              className="bg-bulletin-paper p-4 sm:p-5 rounded-lg border border-bulletin-shadow relative shadow-sm hover:shadow-md transition-shadow"
                          >
                            {/* Delete button */}
                            <Button
                                onClick={() => handleDelete(announcement.id)}
                                className="absolute top-3 right-3 w-8 h-8 p-0"
                                variant="destructive"
                                size="sm"
                                aria-label="Delete announcement"
                            >
                              <X className="w-4 h-4" />
                            </Button>

                            {/* Content */}
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
                                    onClick={() => handleEdit(announcement.id)}
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

            {/* Empty State */}
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