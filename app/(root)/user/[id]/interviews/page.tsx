import CreatedInterviews from '@/components/user/Interviews/CreatedInterviews';
import TakenInterviews from '@/components/user/Interviews/TakenInterviews';
import { getCurrentUser, getUserById } from '@/lib/actions/auth.action';
import { getInterviewByUserId, getUserTakenInterviews } from '@/lib/actions/general.actions';
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


    // Get taken interviews (only for own profile)
    const takenInterviews = isOwnProfile ? await getUserTakenInterviews(profileUser.id) : [];

    // Get created interviews
    let createdInterviews = await getInterviewByUserId(profileUser.id);

    if (!isOwnProfile) {
        createdInterviews = createdInterviews ? createdInterviews.filter((item) => item.visibility === true) : [];
    }

    return (
        <div>
            <CreatedInterviews createdInterviews={createdInterviews} isOwnProfile={isOwnProfile} />
            {isOwnProfile && (
                <TakenInterviews takenInterviews={takenInterviews} />
            )}
        </div>
    )
}

export default UserInterviewsPage