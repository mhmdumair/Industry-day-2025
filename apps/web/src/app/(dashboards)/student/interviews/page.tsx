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
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

/* ----------  types ---------- */
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

interface StudentProfile {
  studentID: string;
  userID: string;
}

/* ----------  helpers ---------- */
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

/* ----------  component ---------- */
const RegisteredQueues = () => {
  const router = useRouter();
  const [studentID, setStudentID] = useState<string>();
  const [prelist, setPrelist] = useState<Interview[]>([]);
  const [walkin, setWalkin] = useState<Interview[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingPreference, setUpdatingPreference] = useState<string | null>(
    null,
  );

  /* load interviews + companies for authenticated user */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Fetch student profile first to get studentID securely
        const studentRes = await api.get<StudentProfile>("/student/by-user");
        const fetchedStudentID = studentRes.data.studentID;

        if (!fetchedStudentID) {
          throw new Error("Student profile not found for this user.");
        }
        setStudentID(fetchedStudentID);

        const [cRes, preRes, walkRes] = await Promise.all([
          api.get("/company"),
          api.get(`/interview/student/${fetchedStudentID}/prelisted/sorted`),
          api.get(`/interview/student/${fetchedStudentID}/walkin/sorted`),
        ]);
        
        setCompanies(cRes.data);
        setPrelist(preRes.data);
        setWalkin(walkRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
        if (error instanceof AxiosError && error.response?.status === 401) {
          router.push('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const companyByID = (id: string) =>
    companies.find((c) => c.companyID === id) ?? {
      stream: "N/A",
      companyName: id,
    };

  /* ----------  preference handling ---------- */
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

  /* ----------  render helpers ---------- */
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

    async function cancelInterview(interviewID: string) {
      if (!confirm("Are you sure you want to cancel this interview?")) return;

      try {
        await api.delete(`/interview/${interviewID}`);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
          alert(`Failed to remove interview: ${err.message}`);
        } else {
          console.error("Unknown error:", err);
          alert("Failed to remove interview: An unknown error occurred.");
        }
      }
    }

    return (
      <Card key={i.companyID} className="mb-2 last:mb-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{c.companyName}</CardTitle>
            <CardDescription></CardDescription>
          </div>
          <Button
            size="icon"
            className="bg-red-500/80 border border-red-600"
            onClick={() => cancelInterview(i.interviewID)}
          >
            ✕
          </Button>
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



  /* ----------  render ---------- */
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