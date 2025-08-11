"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Star } from "lucide-react";
import api from "@/lib/axios";
import { format } from "date-fns";
import { Label } from "@radix-ui/react-label";

interface User {
  userID: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
}

interface CompanyDetails {
  companyName: string;
}

interface StudentDetails {
  regNo: string;
}

interface Feedback {
  feedbackID: string;
  comment: string;
  rating: number;
  created_at: string;
  user: User;
  companyDetails?: CompanyDetails;
  studentDetails?: StudentDetails;
}

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (filter === "student") {
          response = await api.get("/feedback/students");
        } else if (filter === "company") {
          response = await api.get("/feedback/companies");
        } else {
          response = await api.get("/feedback");
        }

        const initialFeedbacks: Feedback[] = response.data;

        const feedbacksWithDetails = await Promise.all(
            initialFeedbacks.map(async (feedback) => {
              if (feedback.user.role === "company") {
                try {
                  const companyRes = await api.get(
                      `/company/by-user/${feedback.user.userID}`
                  );
                  feedback.companyDetails = companyRes.data;
                } catch {
                  console.error(
                      `Failed to fetch company details for user ${feedback.user.userID}`
                  );
                }
              } else if (feedback.user.role === "student") {
                try {
                  const studentRes = await api.get(
                      `/student/by-user/${feedback.user.userID}`
                  );
                  feedback.studentDetails = studentRes.data;
                } catch {
                  console.error(
                      `Failed to fetch student details for user ${feedback.user.userID}`
                  );
                }
              }
              return feedback;
            })
        );

        setFeedbacks(feedbacksWithDetails);
      } catch (err) {
        console.error("Failed to fetch feedback:", err);
        setError("Failed to load feedback data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [filter]);

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    if (filter === "all") return true;
    return feedback.user.role === filter;
  });

  if (loading) {
    return (
        <div className="flex justify-center p-8 min-h-[400px] items-center">
          <Loader2 className="h-10 w-10 animate-spin mr-4" />
          <p className="text-xl">Loading Feedback...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex justify-center p-8 text-red-500 text-lg">
          {error}
        </div>
    );
  }

  return (
      <Card className="m-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">All Feedback</CardTitle>
              <CardDescription>
                View and manage feedback from all users.
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Label>Filter by Role:</Label>
              <Select onValueChange={setFilter} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="company">Companies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFeedbacks.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-gray-500">
                <Star className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold">No Feedback Found</h3>
                <p className="mt-2 text-center max-w-sm">
                  It seems there&apos;s no feedback to display for the selected filter.
                </p>
              </div>
          ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedbacks.map((feedback) => (
                      <TableRow key={feedback.feedbackID}>
                        <TableCell className="font-medium">
                          <p>
                            {feedback.user.first_name} {feedback.user.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {feedback.user.role === "company" &&
                                `Company: ${feedback.companyDetails?.companyName || "N/A"}`}
                            {feedback.user.role === "student" &&
                                `Index No: ${feedback.studentDetails?.regNo || "N/A"}`}
                            {feedback.user.role === "room_admin" &&
                                `Email: ${feedback.user.email}`}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge
                              variant={
                                feedback.user.role === "student" ? "default" : "secondary"
                              }
                          >
                            {feedback.user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                        i < feedback.rating ? "text-yellow-400" : "text-gray-300"
                                    }`}
                                    fill={i < feedback.rating ? "currentColor" : "none"}
                                />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">{feedback.comment}</TableCell>
                        <TableCell className="text-right">
                          {format(new Date(feedback.created_at), "PPP")}
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
          )}
        </CardContent>
      </Card>
  );
}