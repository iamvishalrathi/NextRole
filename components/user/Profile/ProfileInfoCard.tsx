import { getInterviewByUserId, getUserTakenInterviews } from '@/lib/actions/general.actions';
import React from 'react'

interface ProfileInfoCardProps {
    currentUser: User;
    profileUser: User;
    profile?: {
        summary?: string;
        skills?: string[];
        workExperience?: Array<{
            company: string;
            position: string;
            startDate: string;
            endDate?: string;
            description: string;
            isCurrentJob: boolean;
        }>;
        education?: Array<{
            institution: string;
            degree: string;
            fieldOfStudy: string;
            startDate: string;
            endDate?: string;
            grade?: string;
        }>;
        projects?: Array<{
            name: string;
            description: string;
            technologies: string[];
            liveUrl?: string;
            githubUrl?: string;
        }>;
        socialLinks?: {
            linkedin?: string;
            github?: string;
            portfolio?: string;
            twitter?: string;
        };
        // Recruiter specific fields
        companyDescription?: string;
        sector?: string;
        companySize?: string;
        location?: string;
        founded?: string;
        website?: string;
        specialties?: string[];
        [key: string]: unknown;
    };
}

const ProfileInfoCard = async ({ currentUser, profileUser, profile }: ProfileInfoCardProps) => {
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
        <div className="space-y-6">
            {/* Basic Profile Info */}
            <div className="card-border w-full">
                <div className="dark-gradient rounded-2xl p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className={`w-28 h-28 rounded-full ${avatarColor} flex items-center justify-center text-white text-4xl font-semibold shadow-lg border-4 border-primary-500/30`}>
                            {userInitial}
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <h1 className="text-3xl font-bold text-primary-100 mb-2">{profileUser.name}</h1>
                            {isOwnProfile && <p className="text-light-400 mb-4">{profileUser.email}</p>}

                            {/* Role Badge */}
                            <div className="mb-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${profileUser.isRecruiter
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {profileUser.isRecruiter ? 'Recruiter' : 'Candidate'}
                                </span>
                            </div>

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
                                        {profile ? 'Completed' : 'Not Completed'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Details */}
            {profile && (
                <div className="card-border w-full">
                    <div className="dark-gradient rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-primary-100 mb-6">Profile Details</h2>

                        {profileUser.isRecruiter ? (
                            <div className="space-y-6">
                                {/* Company Description */}
                                <div>
                                    <h3 className="text-lg font-semibold text-primary-100 mb-2">Company Description</h3>
                                    <p className="text-light-400">{profile.companyDescription}</p>
                                </div>

                                {/* Company Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-primary-300 mb-1">Sector</h4>
                                        <p className="text-light-400">{profile.sector}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-primary-300 mb-1">Company Size</h4>
                                        <p className="text-light-400">{profile.companySize}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-primary-300 mb-1">Location</h4>
                                        <p className="text-light-400">{profile.location}</p>
                                    </div>
                                    {profile.founded && (
                                        <div>
                                            <h4 className="text-sm font-medium text-primary-300 mb-1">Founded</h4>
                                            <p className="text-light-400">{profile.founded}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Specialties */}
                                {profile.specialties && profile.specialties.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-primary-300 mb-2">Specialties</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.specialties.map((specialty: string, index: number) => (
                                                <span key={index} className="bg-primary-500/20 text-primary-200 px-3 py-1 rounded-full text-sm">
                                                    {specialty}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Social Links */}
                                {(profile.socialLinks?.linkedin || profile.socialLinks?.twitter || profile.website) && (
                                    <div>
                                        <h4 className="text-sm font-medium text-primary-300 mb-2">Links</h4>
                                        <div className="flex flex-wrap gap-4">
                                            {profile.website && (
                                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                                    Website
                                                </a>
                                            )}
                                            {profile.socialLinks?.linkedin && (
                                                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                                    LinkedIn
                                                </a>
                                            )}
                                            {profile.socialLinks?.twitter && (
                                                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                                    Twitter
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Summary */}
                                <div>
                                    <h3 className="text-lg font-semibold text-primary-100 mb-2">Professional Summary</h3>
                                    <p className="text-light-400">{profile.summary}</p>
                                </div>

                                {/* Skills */}
                                {profile.skills && profile.skills.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-primary-100 mb-2">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.skills.map((skill: string, index: number) => (
                                                <span key={index} className="bg-primary-500/20 text-primary-200 px-3 py-1 rounded-full text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Work Experience */}
                                {profile.workExperience && profile.workExperience.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-primary-100 mb-4">Work Experience</h3>
                                        <div className="space-y-4">
                                            {profile.workExperience.map((exp, index) => (
                                                <div key={index} className="bg-dark-gradient-2 rounded-lg p-4 border border-primary-500/20">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-semibold text-primary-100">{exp.position}</h4>
                                                            <p className="text-primary-300">{exp.company}</p>
                                                        </div>
                                                        <span className="text-sm text-light-400">
                                                            {exp.startDate} - {exp.isCurrentJob ? 'Present' : exp.endDate}
                                                        </span>
                                                    </div>
                                                    <p className="text-light-400 text-sm">{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {profile.education && profile.education.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-primary-100 mb-4">Education</h3>
                                        <div className="space-y-4">
                                            {profile.education.map((edu, index) => (
                                                <div key={index} className="bg-dark-gradient-2 rounded-lg p-4 border border-primary-500/20">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-semibold text-primary-100">{edu.degree}</h4>
                                                            <p className="text-primary-300">{edu.institution}</p>
                                                            <p className="text-light-400 text-sm">{edu.fieldOfStudy}</p>
                                                        </div>
                                                        <span className="text-sm text-light-400">
                                                            {edu.startDate} - {edu.endDate}
                                                        </span>
                                                    </div>
                                                    {edu.grade && (
                                                        <p className="text-light-400 text-sm">Grade: {edu.grade}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Projects */}
                                {profile.projects && profile.projects.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-primary-100 mb-4">Projects</h3>
                                        <div className="space-y-4">
                                            {profile.projects.map((project, index) => (
                                                <div key={index} className="bg-dark-gradient-2 rounded-lg p-4 border border-primary-500/20">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-semibold text-primary-100">{project.name}</h4>
                                                        <div className="flex gap-2">
                                                            {project.liveUrl && (
                                                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                                                                    Live
                                                                </a>
                                                            )}
                                                            {project.githubUrl && (
                                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                                                                    GitHub
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-light-400 text-sm mb-2">{project.description}</p>
                                                    {project.technologies && project.technologies.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {project.technologies.map((tech: string, techIndex: number) => (
                                                                <span key={techIndex} className="bg-primary-500/20 text-primary-200 px-2 py-1 rounded text-xs">
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Social Links */}
                                {(profile.socialLinks?.linkedin || profile.socialLinks?.github || profile.socialLinks?.portfolio || profile.socialLinks?.twitter) && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-primary-100 mb-2">Social Links</h3>
                                        <div className="flex flex-wrap gap-4">
                                            {profile.socialLinks?.linkedin && (
                                                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                                    LinkedIn
                                                </a>
                                            )}
                                            {profile.socialLinks?.github && (
                                                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                                    GitHub
                                                </a>
                                            )}
                                            {profile.socialLinks?.portfolio && (
                                                <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                                    Portfolio
                                                </a>
                                            )}
                                            {profile.socialLinks?.twitter && (
                                                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                                    Twitter
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileInfoCard