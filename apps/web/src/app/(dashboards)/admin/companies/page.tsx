"use client";

import CreateCompany from "../../../../components/admin/create-company"
import CompanyList   from "../../../../components/admin/company-list";

export default function CompanyDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <CompanyList />
      <CreateCompany />
    </div>
  );
}
