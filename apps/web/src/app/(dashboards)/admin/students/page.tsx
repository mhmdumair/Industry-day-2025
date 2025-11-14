"use client";

import { Suspense } from "react";
import CreateStudent from "../../../../components/admin/create-student";
import StudentList from "../../../../components/admin/student-list";

export default function StudentDashboard() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <div className="flex-row gap-5 px-2 mx-2 w-full">
          <CreateStudent />
          <StudentList />
      </div>
    </Suspense>
  );
}
