"use client";

import React, { useState, useEffect } from "react";
import api from "../../../../lib/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

enum InterviewType {
  PRE_LISTED = "pre-listed",
  WALK_IN = "walk-in",
}

interface Company {
  companyID: string;
  companyName: string;
}

export default function InterviewForms() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    regNo: "",
    companyID: "",
    type: "" as InterviewType | "",
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesRes = await api.get("/company");
        setCompanies(companiesRes.data);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        alert("Failed to load companies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (
    name: "regNo" | "companyID" | "type",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.regNo || !formData.companyID || !formData.type) {
      alert("Please enter a registration number, select a company, and an interview type.");
      return;
    }

    try {
      await api.post("/interview/by-regno", {
        regNo: formData.regNo,
        companyID: formData.companyID,
        type: formData.type,
      });
      alert(`${formData.type} interview for ${formData.regNo} created successfully!`);
      setFormData({ regNo: "", companyID: "", type: "" });
    } catch (error) {
      console.error(`Error creating ${formData.type} interview:`, error);
      alert("An error occurred. The student may not exist or an interview has already been scheduled. Check the console for details.");
    }
  };

  if (loading) {
    return <div className="p-4">Loading forms...</div>;
  }

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-2xl shadow-md">
        <CardHeader>
          <CardTitle>Create Interview</CardTitle>
          <CardDescription>
            Schedule a pre-listed or add a student to the walk-in queue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="regNo">Student Registration Number</Label>
              <Input
                id="regNo"
                placeholder="Enter student registration number"
                value={formData.regNo}
                onChange={(e) => handleChange("regNo", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Select
                value={formData.companyID}
                onValueChange={(value) => handleChange("companyID", value)}
              >
                <SelectTrigger id="company">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.companyID} value={company.companyID}>
                      {company.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="interview-type">Interview Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  handleChange("type", value as InterviewType)
                }
              >
                <SelectTrigger id="interview-type">
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={InterviewType.PRE_LISTED}>
                    Pre-listed
                  </SelectItem>
                  <SelectItem value={InterviewType.WALK_IN}>Walk-in</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full mt-4">
              Create Interview
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}