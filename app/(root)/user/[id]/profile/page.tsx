import React from 'react';
import { getCurrentUser, getUserById } from '@/lib/actions/auth.action';
import { getProfileByUserId } from '@/lib/actions/general.actions';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProfileInfoCard from '@/components/user/Profile/ProfileInfoCard';

// Profile type with flexible properties
type ProfileRecord = Record<string, unknown> & {
  id?: string;
  skills?: string[];
  workExperience?: unknown[];
  projects?: unknown[];
};

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
    <div className="min-h-screen bg-dark-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-100">
              {isOwnProfile ? 'My Profile' : `${profileUser.name}'s Profile`}
            </h1>
            <p className="text-light-400 mt-2">
              {isOwnProfile 
                ? 'Manage your professional profile and career information'
                : `${profileUser.isRecruiter ? 'Recruiter' : 'Candidate'} profile`
              }
            </p>
          </div>
          
          {isOwnProfile && (
            <div className="flex gap-4">
              <Link href={`/user/${profileUser.id}/profile/edit`}>
                <Button variant="outline">
                  Edit Profile
                </Button>
              </Link>
              {!profile && (
                <Link href={`/user/${profileUser.id}/profile/complete`}>
                  <Button>
                    Complete Profile
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Profile Completion Notice */}
        {isOwnProfile && !profile && (
          <div className="mb-6 p-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-300">
                  Complete Your Profile
                </h3>
                <p className="text-yellow-200/80 mt-1">
                  {currentUser.isRecruiter
                    ? "Complete your company profile to attract top talent"
                    : "Complete your profile to get better interview opportunities and personalized questions"
                  }
                </p>
              </div>
              <Link href={`/user/${id}/profile/complete`}>
                <Button>Complete Profile</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Profile Content */}
        <div className="space-y-8">
          {/* Profile Info Card */}
          <ProfileInfoCard
            currentUser={currentUser}
            profileUser={profileUser}
            profile={profile || undefined}
          />

          {/* Profile Analytics & Status */}
          {isOwnProfile && profile && (
            <div className="card-border w-full">
              <div className="dark-gradient rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-primary-100 mb-6">Profile Analytics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-dark-gradient-2 rounded-lg border border-primary-500/20">
                    <h4 className="font-medium text-primary-100 mb-2">Profile Completeness</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-dark-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: '85%' }}
                        />
                      </div>
                      <span className="text-sm text-light-400">85%</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-dark-gradient-2 rounded-lg border border-primary-500/20">
                    <h4 className="font-medium text-primary-100 mb-2">Skills</h4>
                    <p className="text-2xl font-bold text-blue-400">
                      {(profile as ProfileRecord)?.skills?.length || 0}
                    </p>
                    <p className="text-light-400 text-sm">Technical & soft skills</p>
                  </div>
                  
                  <div className="p-4 bg-dark-gradient-2 rounded-lg border border-primary-500/20">
                    <h4 className="font-medium text-primary-100 mb-2">Experience</h4>
                    <p className="text-2xl font-bold text-green-400">
                      {(profile as ProfileRecord)?.workExperience?.length || 0}
                    </p>
                    <p className="text-light-400 text-sm">Work positions</p>
                  </div>
                  
                  <div className="p-4 bg-dark-gradient-2 rounded-lg border border-primary-500/20">
                    <h4 className="font-medium text-primary-100 mb-2">Projects</h4>
                    <p className="text-2xl font-bold text-purple-400">
                      {(profile as ProfileRecord)?.projects?.length || 0}
                    </p>
                    <p className="text-light-400 text-sm">Portfolio projects</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {isOwnProfile && (
            <div className="card-border w-full">
              <div className="dark-gradient rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-primary-100 mb-6">Quick Actions</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link href={`/user/${profileUser.id}/profile/edit`}>
                    <div className="p-6 bg-dark-gradient-2 rounded-lg border border-primary-500/20 hover:border-primary-500/40 transition-all cursor-pointer group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-primary-100">Edit Profile</h3>
                      </div>
                      <p className="text-light-400 text-sm">Update your profile information and add new sections</p>
                    </div>
                  </Link>

                  <Link href={`/user/${profileUser.id}/interviews`}>
                    <div className="p-6 bg-dark-gradient-2 rounded-lg border border-primary-500/20 hover:border-primary-500/40 transition-all cursor-pointer group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-primary-100">View Interviews</h3>
                      </div>
                      <p className="text-light-400 text-sm">Check your interview history and performance</p>
                    </div>
                  </Link>

                  <Link href="/create-interview">
                    <div className="p-6 bg-dark-gradient-2 rounded-lg border border-primary-500/20 hover:border-primary-500/40 transition-all cursor-pointer group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-primary-100">New Interview</h3>
                      </div>
                      <p className="text-light-400 text-sm">Generate a new interview to practice your skills</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;