import { getInterviewByUserId, getUserTakenInterviews } from '@/lib/actions/general.actions';
import React from 'react'

const ProfileInfoCard = async ({ currentUser, profileUser}) => {
    // Check if viewing own profile
    const isOwnProfile = currentUser.id === profileUser.id;

    // Get taken interviews (only for own profile)
    const takenInterviews = isOwnProfile ? await getUserTakenInterviews(profileUser.id) : [];

    // Get created interviews
    const createdInterviews = await getInterviewByUserId(profileUser.id);

    // Get user's initial for avatar
    const userInitial = profileUser.name ? profileUser.name.charAt(0).toUpperCase() : '?';
    const avatarColor = profileUser.avatarColor || 'bg-blue-500'; // Default to blue if no color is set

    return (
        <div className="card-border w-full mb-12">
            <div className="dark-gradient rounded-2xl p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className={`w-28 h-28 rounded-full ${avatarColor} flex items-center justify-center text-white text-4xl font-semibold shadow-lg border-4 border-primary-500/30`}>
                        {userInitial}
                    </div>
                    <div className="flex flex-col items-center md:items-start">
                        <h1 className="text-3xl font-bold text-primary-100 mb-2">{profileUser.name}</h1>
                        {isOwnProfile && <p className="text-light-400 mb-4">{profileUser.email}</p>}

                        <div className="flex flex-wrap gap-4 mt-2">
                            <div className="bg-dark-gradient-2 rounded-lg p-4 border border-primary-500/20 shadow-md">
                                <div className="text-primary-300 text-sm mb-1">Created</div>
                                <div className="text-2xl font-bold text-primary-100">{createdInterviews ? createdInterviews.length : 0}</div>
                            </div>

                            {isOwnProfile && (
                                <div className="bg-dark-gradient-2 rounded-lg p-4 border border-primary-500/20 shadow-md">
                                    <div className="text-primary-300 text-sm mb-1">Taken</div>
                                    <div className="text-2xl font-bold text-primary-100">{takenInterviews.length}</div>
                                </div>
                            )}

                            <div className="bg-dark-gradient-2 rounded-lg p-4 border border-primary-500/20 shadow-md">
                                <div className="text-primary-300 text-sm mb-1">Profile</div>
                                <div className="text-sm font-medium text-light-300">
                                    {isOwnProfile ? 'Your Account' : 'User Profile'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileInfoCard