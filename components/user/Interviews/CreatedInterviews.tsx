import React from 'react'
import { Button } from '../../ui/button'
import InterviewCard from '../../InterviewCard'
import Link from 'next/link'

const CreatedInterviews = ({ createdInterviews, isOwnProfile }) => {
    return (
        <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0">
                    <h2 className="text-2xl font-semibold text-primary-100">Created Interviews</h2>
                </div>
                <div className="flex-grow h-px bg-gradient-to-r from-primary-500/20 to-transparent"></div>
            </div>
            {createdInterviews && createdInterviews.length > 0 ? (
                <div className="interviews-section">
                    {createdInterviews.map((interview) => (
                        <InterviewCard
                            key={interview.id}
                            id={interview.id}
                            userId={interview.userId}
                            role={interview.role}
                            type={interview.type}
                            techstack={interview.techstack}
                            createdAt={interview.createdAt}
                        />
                    ))}
                </div>
            ) : (
                <div className="blue-gradient-dark rounded-lg border-2 border-primary-200/30 p-8 text-center">
                    <p className="text-light-400 mb-4">No interviews created yet.</p>
                    {isOwnProfile && <Button asChild className="btn-primary">
                        <Link href="/interview">Create an Interview</Link>
                    </Button>}

                </div>
            )}
        </div>
    )
}

export default CreatedInterviews