"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import CreateStudent from "../../../../components/admin/create-student";
import StudentList from "../../../../components/admin/student-list";

export default function StudentDashboard() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Spinner className="h-8 w-8" /></div>}>
      <div className="flex-row gap-5 px-2 mx-2 w-full">
          <CreateStudent />
          <StudentList />
      </div>
    </Suspense>
  );
}
