"use client";

import React, { useState } from "react";
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
import { useRouter } from "next/navigation";

export default function FeedbackForm() {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setError("Please provide a rating.");
      return;
    }
    setError("");
    setSuccess("");
    setSubmissionLoading(true);

    try {
      const payload = {
        rating: rating,
        comment: comment,
      };

      await api.post("/feedback", payload);
      setSuccess("Thank you for your feedback!");
      setComment("");
      setRating(null);

      // Set a timer to clear the success message after 5 seconds
      setTimeout(() => {
        setSuccess("");
      }, 5000);

    } catch (err) {
      console.error("Feedback submission failed:", err);
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 401) {
        router.push('/auth/login');
      } else {
        setError(`Failed to submit feedback: An unexpected error occurred.`);
      }
    } finally {
      setSubmissionLoading(false);
    }
  };

  return (
    <div className="flex p-4 mx-auto bg-transparent">
      <Card className="bg-slate-100/80 mb-2 last:mb-0 w-full max-w-[85vw] md:max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Provide Feedback</CardTitle>
          <CardDescription>
            Help us improve by sharing your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating Section */}
            <div className="flex flex-col items-center">
              <Label htmlFor="rating" className="font-semibold mb-4">
                Your Rating
              </Label>
              <RadioGroup
                onValueChange={(value) => setRating(parseInt(value, 10))}
                className="flex justify-center space-x-2"
                value={rating?.toString() || undefined}
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
                      className={`h-8 w-8 transition-colors ${
                        rating && star <= rating ? "text-yellow-400" : "text-gray-300"
                      } hover:text-yellow-400 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2`}
                    />
                  </Label>
                ))}
              </RadioGroup>
            </div>
            {/* Comment Section */}
            <div>
              <Label htmlFor="comment" className="text-sm">Comments</Label>
              <Textarea
                id="comment"
                placeholder="Share your thoughts about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="mt-2"
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
              className="w-full h-12 font-semibold"
              disabled={submissionLoading || !rating || !comment.trim()}
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