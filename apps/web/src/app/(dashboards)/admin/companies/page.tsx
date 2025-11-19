"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import CreateCompany from "../../../../components/admin/create-company"
import CompanyList   from "../../../../components/admin/company-list";

export default function CompanyDashboard() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Spinner className="h-8 w-8" /></div>}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 items-stretch">
        <div className="lg:col-span-1">
          <CreateCompany />
        </div>
        <div className="lg:col-span-2">
          <CompanyList />
        </div>
      </div>
    </Suspense>
  );
}
