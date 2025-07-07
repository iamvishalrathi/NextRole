import React from 'react';
import { getCurrentUser, getUserById } from '@/lib/actions/auth.action';
import { getProfileByUserId } from '@/lib/actions/general.actions';
import { redirect } from 'next/navigation';
import ProfilePageClient from '@/components/user/Profile/ProfilePageClient';

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
    <ProfilePageClient
      currentUser={currentUser}
      profileUser={profileUser}
      profile={profile}
      isOwnProfile={isOwnProfile}
    />
  );
};

export default UserProfilePage;