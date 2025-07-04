import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const TakenInterviews = ({ takenInterviews }) => {
    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0">
                    <h2 className="text-2xl font-semibold text-primary-100">Taken Interviews</h2>
                </div>
                <div className="flex-grow h-px bg-gradient-to-r from-primary-500/20 to-transparent"></div>
            </div>
            {takenInterviews.length > 0 ? (
                <div className="interviews-section">
                    {takenInterviews.map((interview) => (
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
                    <p className="text-light-400 mb-4">No interviews taken yet.</p>
                    <Button asChild className="btn-primary">
                        <Link href="/">Find Interviews</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}

export default TakenInterviews