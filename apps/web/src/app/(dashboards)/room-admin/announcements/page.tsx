"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Clock, User, AlertCircle } from 'lucide-react';

export default function AnnouncementsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        message: '',
        priority: 'medium',
        targetAudience: 'all'
    });
    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            title: "Industry Day Schedule Update",
            message: "Please note that the opening ceremony has been moved to 9:30 AM. All participants should arrive by 9:00 AM for registration.",
            priority: "high",
            targetAudience: "all",
            createdBy: "Room Admin",
            createdAt: "2025-01-15T08:30:00Z",
            isActive: true
        },
        {
            id: 2,
            title: "Lunch Break Extended",
            message: "Due to popular demand, lunch break has been extended by 30 minutes. Please return to your stalls by 2:00 PM.",
            priority: "medium",
            targetAudience: "students",
            createdBy: "Room Admin",
            createdAt: "2025-01-15T12:45:00Z",
            isActive: true
        },
        {
            id: 3,
            title: "Presentation Equipment Check",
            message: "All students presenting today should test their equipment by 3:00 PM. Technical support will be available in Room MLT-A.",
            priority: "medium",
            targetAudience: "presenters",
            createdBy: "Room Admin",
            createdAt: "2025-01-15T14:15:00Z",
            isActive: true
        },
        {
            id: 4,
            title: "Emergency Contact Information",
            message: "For any emergencies during the event, please contact the room admin at +94 77 123 4567 or visit the main desk.",
            priority: "high",
            targetAudience: "all",
            createdBy: "Room Admin",
            createdAt: "2025-01-15T07:00:00Z",
            isActive: true
        },
        {
            id: 5,
            title: "Evaluation Forms Reminder",
            message: "Don't forget to fill out your evaluation forms before leaving. QR codes are available at each stall.",
            priority: "low",
            targetAudience: "visitors",
            createdBy: "Room Admin",
            createdAt: "2025-01-15T16:30:00Z",
            isActive: true
        }
    ]);

    const handleCreate = () => {
        if (newAnnouncement.title && newAnnouncement.message) {
            const announcement = {
                id: Date.now(),
                ...newAnnouncement,
                createdBy: "Room Admin",
                createdAt: new Date().toISOString(),
                isActive: true
            };
            setAnnouncements(prev => [announcement, ...prev]);
            setNewAnnouncement({
                title: '',
                message: '',
                priority: 'medium',
                targetAudience: 'all'
            });
            setIsDialogOpen(false);
        }
    };

    const handleInputChange = (field, value) => {
        setNewAnnouncement(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'high': 'bg-red-100 text-red-800',
            'medium': 'bg-yellow-100 text-yellow-800',
            'low': 'bg-green-100 text-green-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const getAudienceColor = (audience) => {
        const colors = {
            'all': 'bg-purple-100 text-purple-800',
            'students': 'bg-blue-100 text-blue-800',
            'presenters': 'bg-indigo-100 text-indigo-800',
            'visitors': 'bg-cyan-100 text-cyan-800'
        };
        return colors[audience] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };

    return (
        <div className="mt-3">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
                    <p className="text-gray-600 mt-2">Manage room announcements and communications</p>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Announcement
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Announcement</DialogTitle>
                            <DialogDescription>
                                Create a new announcement for your room participants.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right font-medium">
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    value={newAnnouncement.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className="col-span-3"
                                    placeholder="Enter announcement title"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="message" className="text-right font-medium mt-2">
                                    Message
                                </Label>
                                <Textarea
                                    id="message"
                                    value={newAnnouncement.message}
                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                    className="col-span-3"
                                    placeholder="Enter announcement message"
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="priority" className="text-right font-medium">
                                    Priority
                                </Label>
                                <select
                                    id="priority"
                                    value={newAnnouncement.priority}
                                    onChange={(e) => handleInputChange('priority', e.target.value)}
                                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="audience" className="text-right font-medium">
                                    Target Audience
                                </Label>
                                <select
                                    id="audience"
                                    value={newAnnouncement.targetAudience}
                                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Participants</option>
                                    <option value="students">Students</option>
                                    <option value="presenters">Presenters</option>
                                    <option value="visitors">Visitors</option>
                                </select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="destructive" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                                Create Announcement
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {announcements.map((announcement) => (
                    <Card key={announcement.id} className="bg-white shadow-md">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-semibold text-gray-800">
                                    {announcement.title}
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Badge className={getPriorityColor(announcement.priority)}>
                                        {announcement.priority === 'high' && <AlertCircle className="h-3 w-3 mr-1" />}
                                        {announcement.priority.toUpperCase()}
                                    </Badge>
                                    <Badge className={getAudienceColor(announcement.targetAudience)}>
                                        {announcement.targetAudience}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <p className="text-gray-700 leading-relaxed">
                                {announcement.message}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t">
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>{announcement.createdBy}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(announcement.createdAt)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
