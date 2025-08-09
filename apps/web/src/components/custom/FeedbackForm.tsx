"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Star } from "lucide-react";
import api from "@/lib/axios";
import { AxiosError } from "axios";

// Define the shape of the user data returned by the API
interface UserData {
  user: {
    userID: string;
  };
  // Other properties like companyName, etc.
}

export default function FeedbackForm() {
  const searchParams = useSearchParams();
  const companyID = searchParams.get("companyId");
  const studentID = searchParams.get("studentId");
  const roomAdminID = searchParams.get("roomAdminId");

  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      let endpoint = "";

      if (companyID) {
        endpoint = `/company/${companyID}`;
      } else if (studentID) {
        endpoint = `/student/${studentID}`;
      } else if (roomAdminID) {
        endpoint = `/room-admin/${roomAdminID}`;
      } else {
        setError("Missing ID parameter in URL.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(endpoint);
        const fetchedData: UserData = response.data;
        if (fetchedData.user && fetchedData.user.userID) {
          setUserID(fetchedData.user.userID);
        } else {
          setError("User ID not found in fetched data.");
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        const axiosError = err as AxiosError;
        setError(
          `Failed to fetch data: ${
            axiosError.response?.statusText || "An unexpected error occurred."
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [companyID, studentID, roomAdminID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setError("Please provide a rating.");
      return;
    }
    if (!userID) {
      setError("User ID is not available for submission.");
      return;
    }
    setError("");
    setSubmissionLoading(true);

    try {
      const payload = {
        userID: userID,
        rating: rating,
        comment: comment,
      };

      await api.post("/feedback", payload);
      setSuccess("Thank you for your feedback!");
      setComment("");
      setRating(null);
    } catch (err) {
      console.error("Feedback submission failed:", err);
      const axiosError = err as AxiosError;
      setError(
        `Failed to submit feedback: ${
          axiosError.response?.statusText || "An unexpected error occurred."
        }`
      );
    } finally {
      setSubmissionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4 min-h-[500px] items-center">
        <Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8 text-lg">{error}</div>;
  }

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border border-gray-200">
        <CardHeader className="text-center p-6">
          <CardTitle className="text-3xl font-bold">Provide Feedback</CardTitle>
          <CardDescription className="text-base text-gray-500 mt-2">
            Help us improve by sharing your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating Section */}
            <div className="flex flex-col items-center">
              <Label htmlFor="rating" className="text-lg font-semibold mb-4">
                Your Rating
              </Label>
              <RadioGroup
                onValueChange={(value) => setRating(parseInt(value, 10))}
                className="flex justify-center space-x-2"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Label
                    key={star}
                    htmlFor={`star-${star}`}
                    className="cursor-pointer"
                  >
                    <RadioGroupItem
                      value={String(star)}
                      id={`star-${star}`}
                      className="peer sr-only"
                    />
                    <Star
                      className={`h-10 w-10 transition-colors ${
                        rating && star <= rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      } hover:text-yellow-400 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2`}
                    />
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Comment Section */}
            <div>
              <Label htmlFor="comment" className="text-lg font-semibold">Comments (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="Share your thoughts about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="resize-none mt-2 text-base"
              />
            </div>

            {/* Status Messages */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-500 text-center">{success}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold"
              disabled={submissionLoading || !userID || !rating}
            >
              {submissionLoading && (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              )}
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}