import { Suspense } from 'react';

// Import your existing component
import RoomAdminProfileCard from '../../../../components/roomadmin/AdminProfileCard';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

// Loading fallback component
function ProfileLoading() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">Loading profile...</span>
    </div>
  );
}

// Main page component with proper Suspense boundary
export default function AdminProfilePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Room Admin Profile</h1>
      <Suspense fallback={<ProfileLoading />}>
        <RoomAdminProfileCard />
      </Suspense>
    </div>
  );
}