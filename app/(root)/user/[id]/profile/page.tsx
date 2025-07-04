import React from 'react';
import { getCurrentUser, getUserById } from '@/lib/actions/auth.action';
import { getProfileByUserId } from '@/lib/actions/general.actions';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProfileInfoCard from '@/components/user/Profile/ProfileInfoCard';

const UserProfilePage = async ({ params }: RouteParams) => {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  // Redirect if not authenticated
  if (!currentUser) {
    redirect('/sign-in');
  }

  // Get profile user (could be current user or another user)
  const profileUser = await getUserById(id);

  if (!profileUser) {
    redirect('/');
  }

  // Check if profile is completed
  const profile = await getProfileByUserId(id);
  const isOwnProfile = currentUser.id === id;

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      {/* Show profile completion notice if it's user's own profile and not completed */}
      {isOwnProfile && !profile && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">
                Complete Your Profile
              </h3>
              <p className="text-yellow-700">
                {currentUser.isRecruiter
                  ? "Complete your company profile to attract top talent"
                  : "Complete your profile to get better interview opportunities"
                }
              </p>
            </div>
            <Link href={`/user/${id}/profile/complete`}>
              <Button>Complete Profile</Button>
            </Link>
          </div>
        </div>
      )}

      <ProfileInfoCard
        currentUser={currentUser}
        profileUser={profileUser}
        profile={profile}
      />
    </div>
  );
};

export default UserProfilePage;