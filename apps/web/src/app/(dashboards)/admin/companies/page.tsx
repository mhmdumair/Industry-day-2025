"use client";

import CreateCompanyCard from "../../../../components/admin/CreateCompanyCard"
import CompanyListCard   from "../../../../components/admin/CompanyListCard";

export default function CompanyDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <CompanyListCard />
      <CreateCompanyCard />
    </div>
  );
}
