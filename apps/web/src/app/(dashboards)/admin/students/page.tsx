"use client";

import CreateStudentCard from "../../../../components/admin/CreateStudentCard";
import StudentListCard from "../../../../components/admin/StudentListCard";

export default function StudentDashboard() {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        <StudentListCard />
        <CreateStudentCard />
      </div>
  );
}
