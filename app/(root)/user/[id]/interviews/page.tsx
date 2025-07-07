import InterviewStructuresSection from '@/components/user/InterviewStructuresSection';
import { getCurrentUser, getUserById } from '@/lib/actions/auth.action';
import { getUserInterviewStructures } from '@/lib/actions/general.actions';
import { redirect } from 'next/navigation';
import React from 'react'

const UserInterviewsPage = async ({ params }: RouteParams) => {
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

    // Check if viewing own profile
    const isOwnProfile = currentUser.id === profileUser.id;

    // Get interview structures based on user type
    const {
        takenStructures,
        createdMockStructures,
        createdJobStructures
    } = await getUserInterviewStructures(profileUser.id, profileUser.isRecruiter);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary-100 mb-2">
                    {isOwnProfile ? 'My Interviews' : `${profileUser.name}'s Interviews`}
                </h1>
                <p className="text-light-400">
                    {isOwnProfile 
                        ? 'Manage your interview structures and view your interview history' 
                        : `View ${profileUser.name}'s public interview structures`
                    }
                </p>
            </div>

            {/* Taken Interview Structures - Only for own profile */}
            {isOwnProfile && (
                <InterviewStructuresSection
                    title="Taken Interviews"
                    structures={takenStructures || []}
                    emptyMessage="You haven't taken any interviews yet."
                    emptyActionText="Discover Interviews"
                    emptyActionHref="/discover"
                />
            )}

            {/* Created Mock Interview Structures */}
            <InterviewStructuresSection
                title="Created Mock Interviews"
                structures={createdMockStructures || []}
                emptyMessage={
                    isOwnProfile 
                        ? "You haven't created any mock interview structures yet." 
                        : "No public mock interview structures available."
                }
                emptyActionText={isOwnProfile ? "Create Mock Interview" : undefined}
                emptyActionHref={isOwnProfile ? "/create-interview" : undefined}
                showViewButton={!isOwnProfile && createdMockStructures !== null && createdMockStructures.length > 6}
                viewButtonText="View All Mock"
                viewButtonHref="/discover?category=mock"
            />

            {/* Created Job Interview Structures - Only for recruiters */}
            {(profileUser.isRecruiter || (!isOwnProfile && createdJobStructures !== null && createdJobStructures.length > 0)) && (
                <InterviewStructuresSection
                    title="Created Job Interviews"
                    structures={createdJobStructures || []}
                    emptyMessage={
                        isOwnProfile 
                            ? "You haven't created any job interview structures yet." 
                            : "No public job interview structures available."
                    }
                    emptyActionText={isOwnProfile ? "Create Job Interview" : undefined}
                    emptyActionHref={isOwnProfile ? "/create-interview" : undefined}
                    showViewButton={!isOwnProfile && createdJobStructures !== null && createdJobStructures.length > 6}
                    viewButtonText="View All Jobs"
                    viewButtonHref="/discover?category=job"
                />
            )}
        </div>
    )
}

export default UserInterviewsPage