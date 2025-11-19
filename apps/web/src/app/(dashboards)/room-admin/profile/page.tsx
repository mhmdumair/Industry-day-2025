import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

// Import your existing component
import RoomAdminProfileCard from '../../../../components/roomadmin/AdminProfileCard';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

// Loading fallback component
function ProfileLoading() {
  return (
    <div className="flex justify-center items-center h-64">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

// Main page component with proper Suspense boundary
export default function AdminProfilePage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<ProfileLoading />}>
        <RoomAdminProfileCard />
      </Suspense>
    </div>
  );
}