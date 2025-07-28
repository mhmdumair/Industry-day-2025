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
import { Badge } from '@/components/ui/badge';
import { Edit, User, Tag, Building } from 'lucide-react';

export default function StallsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedStall, setSelectedStall] = useState(null);
    const [stalls, setStalls] = useState([
        {
            id: 1,
            name: "Tech Innovation Hub",
            category: "Technology",
            assignedStudent: "John Doe",
            studentId: "ST001",
            description: "Latest tech innovations and startups showcase"
        },
        {
            id: 2,
            name: "Green Energy Solutions",
            category: "Environment",
            assignedStudent: "Jane Smith",
            studentId: "ST002",
            description: "Sustainable energy solutions and eco-friendly products"
        },
        {
            id: 3,
            name: "Healthcare Innovations",
            category: "Healthcare",
            assignedStudent: "Mike Johnson",
            studentId: "ST003",
            description: "Medical devices and healthcare technology"
        },
        {
            id: 4,
            name: "Financial Services",
            category: "Finance",
            assignedStudent: "Sarah Wilson",
            studentId: "ST004",
            description: "Fintech solutions and banking innovations"
        },
        {
            id: 5,
            name: "AI & Machine Learning",
            category: "Technology",
            assignedStudent: "David Brown",
            studentId: "ST005",
            description: "Artificial intelligence and ML applications"
        },
        {
            id: 6,
            name: "Food & Agriculture",
            category: "Agriculture",
            assignedStudent: "Emily Davis",
            studentId: "ST006",
            description: "Agricultural technology and food innovations"
        }
    ]);

    const handleEdit = (stall) => {
        setSelectedStall(stall);
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (selectedStall) {
            setStalls(prev => prev.map(stall => 
                stall.id === selectedStall.id ? selectedStall : stall
            ));
        }
        setIsDialogOpen(false);
        setSelectedStall(null);
    };

    const handleInputChange = (field, value) => {
        setSelectedStall(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Technology': 'bg-blue-100 text-blue-800',
            'Environment': 'bg-green-100 text-green-800',
            'Healthcare': 'bg-red-100 text-red-800',
            'Finance': 'bg-yellow-100 text-yellow-800',
            'Agriculture': 'bg-orange-100 text-orange-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="mt-3">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Stalls Management</h1>
                <p className="text-gray-600 mt-2">Manage stalls assigned to your room</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stalls.map((stall) => (
                    <Card key={stall.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-semibold text-gray-800">
                                    {stall.name}
                                </CardTitle>
                                <Badge className={getCategoryColor(stall.category)}>
                                    {stall.category}
                                </Badge>
                            </div>
                            <CardDescription className="text-sm text-gray-600">
                                {stall.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-700">Assigned Student:</span>
                                <span className="text-gray-600">{stall.assignedStudent}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Building className="h-4 w-4 text-gray-500" />
                                <span className="font-medium text-gray-700">Student ID:</span>
                                <span className="text-gray-600">{stall.studentId}</span>
                            </div>
                        </CardContent>

                        <CardFooter className="pt-4">
                            <Button 
                                onClick={() => handleEdit(stall)}
                                className="w-full"
                                variant="outline"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Stall
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Stall</DialogTitle>
                        <DialogDescription>
                            Update stall information and assignment details.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedStall && (
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="stall-name" className="text-right font-medium">
                                    Stall Name
                                </Label>
                                <Input
                                    id="stall-name"
                                    value={selectedStall.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="col-span-3"
                                    placeholder="Enter stall name"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right font-medium">
                                    Category
                                </Label>
                                <Input
                                    id="category"
                                    value={selectedStall.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="col-span-3"
                                    placeholder="Enter category"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="assigned-student" className="text-right font-medium">
                                    Assigned Student
                                </Label>
                                <Input
                                    id="assigned-student"
                                    value={selectedStall.assignedStudent}
                                    onChange={(e) => handleInputChange('assignedStudent', e.target.value)}
                                    className="col-span-3"
                                    placeholder="Enter student name"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="student-id" className="text-right font-medium">
                                    Student ID
                                </Label>
                                <Input
                                    id="student-id"
                                    value={selectedStall.studentId}
                                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                                    className="col-span-3"
                                    placeholder="Enter student ID"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right font-medium">
                                    Description
                                </Label>
                                <Input
                                    id="description"
                                    value={selectedStall.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="col-span-3"
                                    placeholder="Enter description"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="destructive" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
