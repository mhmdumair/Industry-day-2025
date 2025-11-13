"use client";

import CreateCompany from "../../../../components/admin/create-company"
import CompanyList   from "../../../../components/admin/company-list";

export default function CompanyDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 items-stretch">
      <div className="lg:col-span-1">
        <CreateCompany />
      </div>
      <div className="lg:col-span-2">
        <CompanyList />
      </div>
    </div>
  );
}
