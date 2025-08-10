"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, CheckCircle } from "lucide-react";
import api from "../../../../lib/axios";

/* ----------  types ---------- */
interface Company {
  companyID: string;
  companyName: string;
  stream: string;
}

interface Interview {
  interviewID: string;
  companyID: string;
  status: "scheduled" | "completed" | "cancelled" | "in_queue";
  student_preference?: number;
}

/* ----------  helpers ---------- */
const statusMap: Record<
  string,
  { class: string; text: string; icon: React.ReactNode }
> = {
  scheduled: {
    class: "border-amber-400 bg-amber-100 w-full",
    text: "Scheduled",
    icon: <Clock className="mr-2 w-4 h-4" />,
  },
  in_queue: {
    class: "border-amber-400 bg-amber-100 w-full",
    text: "In Queue",
    icon: <Clock className="mr-2 w-4 h-4" />,
  },
  completed: {
    class: "border-green-600 bg-green-100 w-full",
    text: "Completed",
    icon: <CheckCircle className="mr-2 w-4 h-4" />,
  },
  cancelled: {
    class: "border-red-400 bg-red-100 w-full",
    text: "Cancelled",
    icon: null,
  },
};

const btnForStatus = (s: string) =>
  statusMap[s] ?? {
    class: "border-gray-400 bg-gray-100 w-full",
    text: "Unknown",
    icon: null,
  };

const colorMap: Record<string, string> = {
  CS: "bg-red-200 border-red-400 text-black",
  DS: "bg-indigo-200 border-indigo-400 text-black",
  ST: "bg-orange-200 border-orange-400 text-black",
  BT: "bg-cyan-200 border-cyan-400 text-black",
  ZL: "bg-lime-200 border-lime-400 text-black",
  CM: "bg-rose-200 border-rose-400 text-black",
};

const streamColor = (s: string) =>
  colorMap[s] ?? "bg-gray-200 border-gray-400 text-black";

/* ----------  component ---------- */
const RegisteredQueues = () => {
  const [studentID, setStudentID] = useState<string>();
  const [prelist, setPrelist] = useState<Interview[]>([]);
  const [walkin, setWalkin] = useState<Interview[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingPreference, setUpdatingPreference] = useState<string | null>(
    null,
  );

  /* get studentID */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id =
      params.get("studentId") || localStorage.getItem("studentID") || undefined;
    setStudentID(id || undefined);
  }, []);

  /* load interviews + companies */
  useEffect(() => {
    if (!studentID) return;
    const load = async () => {
      setLoading(true);
      try {
        const [cRes, preRes, walkRes] = await Promise.all([
          api.get("/company"),
          api.get(`/interview/student/${studentID}/prelisted/sorted`),
          api.get(`/interview/student/${studentID}/walkin/sorted`),
        ]);
        setCompanies(cRes.data);
        setPrelist(preRes.data);
        setWalkin(walkRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [studentID]);

  const companyByID = (id: string) =>
    companies.find((c) => c.companyID === id) ?? {
      stream: "N/A",
      companyName: id,
    };

  /* ----------  preference handling ---------- */
  const handlePreferenceChange = async (
    interviewID: string,
    newPreference: number,
  ) => {
    setUpdatingPreference(interviewID);

    const current = prelist.find((i) => i.interviewID === interviewID);
    if (!current) return;

    const oldPreference = current.student_preference ?? 0;
    const clash = prelist.find(
      (i) =>
        i.interviewID !== interviewID &&
        i.student_preference === newPreference,
    );

    try {
      if (clash) {
        // swap
        await Promise.all([
          api.patch(`/interview/${clash.interviewID}/student-preference`, {
            student_preference: oldPreference === 0 ? null : oldPreference,
          }),
          api.patch(`/interview/${interviewID}/student-preference`, {
            student_preference: newPreference,
          }),
        ]);

        setPrelist((prev) =>
          prev.map((iv) =>
            iv.interviewID === interviewID
              ? { ...iv, student_preference: newPreference }
              : iv.interviewID === clash.interviewID
              ? {
                  ...iv,
                  student_preference: oldPreference || undefined,
                }
              : iv,
          ),
        );
      } else {
        await api.patch(`/interview/${interviewID}/student-preference`, {
          student_preference: newPreference,
        });

        setPrelist((prev) =>
          prev.map((iv) =>
            iv.interviewID === interviewID
              ? { ...iv, student_preference: newPreference }
              : iv,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating preference:", error);
    } finally {
      setUpdatingPreference(null);
    }
  };

  const getAvailablePreferences = () =>
    Array.from({ length: prelist.length }, (_, i) => i + 1);

  /* ----------  render helpers ---------- */
  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">Loading...</div>
    );

  const renderPrelistCard = (i: Interview) => {
    const c = companyByID(i.companyID);
    const cfg = btnForStatus(i.status);
    const isUpdating = updatingPreference === i.interviewID;

    return (
      <Card key={i.companyID} className="mb-2 last:mb-0">
        <CardHeader>
          <CardTitle>{c.companyName}</CardTitle>
        </CardHeader>
        <div className="p-6 pt-0 space-y-3">
          {/* Preference Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">My Preference:</span>
            <Select
              value={i.student_preference?.toString() || ""}
              onValueChange={(val) =>
                handlePreferenceChange(i.interviewID, parseInt(val))
              }
              disabled={isUpdating}
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Set" />
              </SelectTrigger>
              <SelectContent>
                {getAvailablePreferences().map((p) => (
                  <SelectItem key={p} value={p.toString()}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isUpdating && (
              <span className="text-xs text-gray-500">Updating...</span>
            )}
          </div>

          {/* Status Button */}
          <Button
            variant="secondary"
            disabled
            className={`w-full ${cfg.class}`}
          >
            {cfg.icon}
            {cfg.text}
          </Button>
        </div>
      </Card>
    );
  };

  const renderWalkinCard = (i: Interview) => {
    const c = companyByID(i.companyID);
    const cfg = btnForStatus(i.status);
    return (
      <Card key={i.companyID} className="mb-2 last:mb-0">
        <CardHeader>
          <CardTitle>{c.companyName}</CardTitle>
          <CardDescription>
            Stream:
            <Badge className={`ml-1 ${streamColor(c.stream)}`}>
              {c.stream}
            </Badge>
          </CardDescription>
        </CardHeader>
        <div className="p-6 pt-0">
          <Button
            variant="secondary"
            disabled
            className={`w-full ${cfg.class}`}
          >
            {cfg.icon}
            {cfg.text}
          </Button>
        </div>
      </Card>
    );
  };

  /* ----------  render ---------- */
  return (
    <div className="mt-3 mx-auto p-4">
      {/* Pre-Listed */}
      <Card className="bg-slate-100/80">
        <CardHeader>
          <CardTitle>Pre-Listed Interviews</CardTitle>
          <CardDescription>
            Set your preference order (1 = highest priority)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {prelist.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No pre-listed interviews
            </p>
          ) : (
            prelist.map(renderPrelistCard)
          )}
        </CardContent>
      </Card>

      {/* Walk-In */}
      <Card className="bg-slate-100/80 mt-4">
        <CardHeader>
          <CardTitle>Walk-In Interviews</CardTitle>
          <CardDescription>Earliest registrations first</CardDescription>
        </CardHeader>
        <CardContent>
          {walkin.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No walk-in interviews
            </p>
          ) : (
            walkin.map(renderWalkinCard)
          )}
        </CardContent>
        <CardFooter>
          <CardDescription>
            To register for more companies, visit “Interviews › Register”.
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisteredQueues;
