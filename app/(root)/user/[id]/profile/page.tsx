import React from 'react';
import { getCurrentUser, getUserById } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
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

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <ProfileInfoCard currentUser={currentUser} profileUser={profileUser} />
    </div>
  );
};

export default UserProfilePage;