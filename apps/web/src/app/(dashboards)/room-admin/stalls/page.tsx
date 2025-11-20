import { Suspense } from 'react';
import StallsGroupCard from '@/components/roomadmin/StallsGroupCard';
import { Spinner } from '@/components/ui/spinner';

export const dynamic = 'force-dynamic';

function StallsLoading() {
  return (
    <Spinner/>
  );
}

export default function StallsPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<StallsLoading />}>
        <StallsGroupCard />
      </Suspense>
    </div>
  );
}