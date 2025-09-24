import { Suspense } from 'react';
import StallsGroupCard from '@/components/roomadmin/StallsGroupCard';

export const dynamic = 'force-dynamic';

function StallsLoading() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">Loading stalls...</span>
    </div>
  );
}

export default function StallsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Stalls</h1>
      <Suspense fallback={<StallsLoading />}>
        <StallsGroupCard />
      </Suspense>
    </div>
  );
}