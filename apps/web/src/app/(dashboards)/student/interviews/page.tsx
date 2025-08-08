"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";
import api from "../../../../lib/axios";

/* ----------  types (simplified)  ---------- */
interface Company {
  companyID: string;
  companyName: string;
  stream: string;
}

interface Interview {
  interviewID: string;
  companyID: string;
  status: "scheduled" | "completed" | "cancelled" | "in_queue";
}

/* ----------  helpers  ---------- */
// Fix for btnForStatus
const statusMap: Record<string, {
  class: string;
  text: string;
  icon: React.ReactNode;
}> = {
  scheduled: {
    class: "border-amber-400 bg-amber-100 w-full",
    text: "Scheduled",
    icon: <Clock className="mr-2 w-4 h-4" />
  },
  in_queue: {
    class: "border-amber-400 bg-amber-100 w-full",
    text: "In Queue",
    icon: <Clock className="mr-2 w-4 h-4" />
  },
  completed: {
    class: "border-green-600 bg-green-100 w-full",
    text: "Completed",
    icon: <CheckCircle className="mr-2 w-4 h-4" />
  },
  cancelled: {
    class: "border-red-400 bg-red-100 w-full",
    text: "Cancelled",
    icon: null
  }
};

const btnForStatus = (s: string) =>
  statusMap[s] ?? {
    class: "border-gray-400 bg-gray-100 w-full",
    text: "Unknown",
    icon: null
  };

// Fix for streamColor
const colorMap: Record<string, string> = {
  CS: "bg-red-200 border-red-400 text-black",
  DS: "bg-indigo-200 border-indigo-400 text-black",
  ST: "bg-orange-200 border-orange-400 text-black",
  BT: "bg-cyan-200 border-cyan-400 text-black",
  ZL: "bg-lime-200 border-lime-400 text-black",
  CM: "bg-rose-200 border-rose-400 text-black"
};

const streamColor = (s: string): string =>
  colorMap[s] ?? "bg-gray-200 border-gray-400 text-black";


/* ----------  component  ---------- */
const RegisteredQueues = () => {
  const [studentID, setStudentID] = useState<string>();
  const [prelist, setPrelist] = useState<Interview[]>([]);
  const [walkin, setWalkin] = useState<Interview[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

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
      const [cRes, preRes, walkRes] = await Promise.all([
        api.get("/company"),
        api.get(`/interview/student/${studentID}/prelisted/sorted`),
        api.get(`/interview/student/${studentID}/walkin/sorted`)
      ]);
      setCompanies(cRes.data);
      setPrelist(preRes.data);
      setWalkin(walkRes.data);
      setLoading(false);
    };
    load();
  }, [studentID]);

  const companyByID = (id: string) =>
    companies.find(c => c.companyID === id) ?? { stream: "N/A", companyName: id };

  /* ----------  render  ---------- */
  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">Loading...</div>
    );

  const renderCard = (i: Interview) => {
    const c = companyByID(i.companyID);
    const cfg = btnForStatus(i.status);
    return (
      <Card key={i.interviewID} className="mb-2 last:mb-0">
        <CardHeader>
          <CardTitle>{c.companyName}</CardTitle>
          <CardDescription>
            Stream:
            <Badge className={`ml-1 ${streamColor(c.stream)}`}>{c.stream}</Badge>
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

  return (
    <div className="mt-3 mx-auto p-4">
      {/* ----------  Pre-listed  ---------- */}
      <Card className="bg-slate-100/80">
        <CardHeader>
          <CardTitle>Pre-Listed Interviews</CardTitle>
          <CardDescription>Ordered by preference</CardDescription>
        </CardHeader>
        <CardContent>
          {prelist.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No pre-listed interviews</p>
          ) : (
            prelist.map(renderCard)
          )}
        </CardContent>
      </Card>

      {/* ----------  Walk-in  ---------- */}
      <Card className="bg-slate-100/80 mt-4">
        <CardHeader>
          <CardTitle>Walk-In Interviews</CardTitle>
          <CardDescription>Earliest registrations first</CardDescription>
        </CardHeader>
        <CardContent>
          {walkin.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No walk-in interviews</p>
          ) : (
            walkin.map(renderCard)
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
