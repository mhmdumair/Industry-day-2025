"use client";

import CreateStudent from "../../../../components/admin/create-student";
import StudentList from "../../../../components/admin/student-list";

export default function StudentDashboard() {
  return (
      <div className="flex-row gap-5 px-2 mx-2 w-full">
          <CreateStudent />
          <StudentList />
      </div>
  );
}
