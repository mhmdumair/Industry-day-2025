"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import api from "@/lib/axios";

/* ----------  types  ---------- */
interface Company {
  companyID: string;
  companyName: string;
  stream: string;
}

interface Interview {
  companyID: string;
}

/* ----------  helpers  ---------- */
const colorMap: Record<string, string> = {
  CS: "bg-red-200 border-red-400 text-black",
  DS: "bg-indigo-200 border-indigo-400 text-black",
  ST: "bg-orange-200 border-orange-400 text-black",
  BT: "bg-cyan-200 border-cyan-400 text-black",
  ZL: "bg-lime-200 border-lime-400 text-black",
  CM: "bg-rose-200 border-rose-400 text-black"
};

// helper
const streamColor = (stream: string): string =>
  colorMap[stream] ?? "bg-gray-200 border-gray-400 text-black";

/* ----------  component  ---------- */
const InterviewRegistration = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [myInterviews, setMyInterviews] = useState<Interview[]>([]);
  const [studentID, setStudentID] = useState<string>();
  const [registering, setRegistering] = useState<string | null>(null);
  const [error, setError] = useState<string>();

  /* fetch studentID from URL (or localStorage fallback) */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id =
      params.get("studentId") ||
      localStorage.getItem("studentID") ||
      undefined;
    setStudentID(id || undefined);
  }, []);

  /* fetch companies + my interviews */
  useEffect(() => {
    if (!studentID) return;

    const load = async () => {
      try {
        const [cRes, iRes] = await Promise.all([
          api.get("/company"),
          api.get(`/interview/student/${studentID}`)
        ]);
        setCompanies(cRes.data);
        setMyInterviews(iRes.data);
      } catch (e: any) {
        setError(e.response?.data?.message || "Failed to load data");
      }
    };
    load();
  }, [studentID]);

  const alreadyRegistered = (companyID: string) =>
    myInterviews.some(i => i.companyID === companyID);

  /* register walk-in */
  const register = async (companyID: string) => {
    if (!studentID) return;
    setRegistering(companyID);
    setError(undefined);
    try {
      await api.post("/interview", {
        companyID,
        studentID,
        type: "walk-in",
        status: "scheduled"
      });
      const iRes = await api.get(`/interview/student/${studentID}`);
      setMyInterviews(iRes.data);
    } catch (e: any) {
      setError(e.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(null);
    }
  };

  /* ----------  render  ---------- */
  return (
    <div className="mt-3 mx-auto p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Card className="bg-slate-100/80">
        <CardHeader>
          <CardTitle>Register for Interviews</CardTitle>
          <CardDescription>Select a company to join its walk-in queue</CardDescription>
        </CardHeader>

        <CardContent>
          {companies.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No companies available
            </p>
          ) : (
            companies.map(c => {
              const disabled = alreadyRegistered(c.companyID);
              const busy = registering === c.companyID;
              return (
                <Card key={c.companyID} className="mb-2 last:mb-0">
                  <CardHeader>
                    <CardTitle>{c.companyName}</CardTitle>
                    <CardDescription>
                      Stream:{" "}
                      <Badge
                        className={`ml-1 ${streamColor(c.stream)}`}
                      >
                        {c.stream}
                      </Badge>
                    </CardDescription>
                  </CardHeader>

                  <div className="p-6 pt-0">
                    <Button
                      variant="secondary"
                      className={
                        disabled
                          ? "border border-green-600 bg-green-100 w-full"
                          : "border border-black bg-blue-100 w-full"
                      }
                      disabled={disabled || busy}
                      onClick={() => register(c.companyID)}
                    >
                      {disabled ? (
                        <>
                          <Check className="mr-2 w-4 h-4" />
                          Registered
                        </>
                      ) : busy ? (
                        "Registering..."
                      ) : (
                        <>
                          <Plus className="mr-2 w-4 h-4" />
                          Register
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewRegistration;
