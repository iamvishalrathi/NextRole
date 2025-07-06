import React from 'react'

import { Button } from '@/components/ui/button'
import Image from "next/image"
import InterviewStructureCard from '@/components/InterviewStructureCard'
import { getCurrentUser } from '@/lib/actions/auth.action'
import ProfileCheckWrapper from '@/components/ProfileCheckWrapper'

import {getPublicInterviewStructures} from '@/lib/actions/general.actions'

// Empty State Component
const EmptyState = ({ title, showButton = false, userId, description }: { title: string, showButton?: boolean, userId?: string, description?: string }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center w-full">
    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
        <Image
          src="/tech.svg"
          alt="Empty state"
          width={32}
          height={32}
          className="opacity-50"
        />
      </div>
    </div>
    <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
    {description && (
      <p className="text-gray-600 text-sm max-w-md leading-relaxed mb-4">{description}</p>
    )}
    {showButton && userId && (
      <ProfileCheckWrapper 
        userId={userId}
        targetUrl="/interview"
        className="inline-flex"
      >
        <Button variant="outline" size="sm">
          Create Mock Interview
        </Button>
      </ProfileCheckWrapper>
    )}
  </div>
);

const page = async () => {
  
  const user = await getCurrentUser();

  if (!user) {
    return <div>Please sign in to view interviews</div>;
  }

  const publicStructures = await getPublicInterviewStructures(6, 6); // Limit to 6 each for better UI

  const hasMockStructures = publicStructures.mockStructures && publicStructures.mockStructures.length > 0;
  const hasJobStructures = publicStructures.jobStructures && publicStructures.jobStructures.length > 0;

  return (
    <>
      {/* cta = call to action */}
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Ace Your Next Interview with AI</h2>
          <p className="text-lg">
            Upskill yourself with AI-powered mock interviews & get instant feedback, or take real job interviews for better opportunities
          </p>

          <ProfileCheckWrapper 
            userId={user.id} 
            targetUrl="/interview"
            className="max-sm:w-full"
          >
            <Button className="btn-primary max-sm:w-full">
              Create Mock Interview
            </Button>
          </ProfileCheckWrapper>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      {/* Public Mock Interview Structures */}
      <section className='flex flex-col gap-6 mt-8'>
        <div className="flex items-center justify-between">
          <h2>Practice Mock Interviews</h2>
        </div>
        <div className='interviews-section'>
          {hasMockStructures ? (
            publicStructures.mockStructures?.map((structure) => (
              <InterviewStructureCard 
                key={structure.id} 
                {...structure}
                interviewCategory="mock"
                usageCount={structure.usageCount || 0}
                createdAt={structure.createdAt}
              />
            ))
          ) : (
            <EmptyState 
              title="No practice sessions available"
              showButton={true}
              userId={user.id}
              description="Start practicing with mock interviews to build confidence and improve your interview skills."
            />
          )}
        </div>
      </section>

      {/* Public Job Interview Structures */}
      <section className='flex flex-col gap-6 mt-8'>
        <div className="flex items-center justify-between">
          <h2>Real Job Interviews</h2>
        </div>
        <div className='interviews-section'>
          {hasJobStructures ? (
            publicStructures.jobStructures?.map((structure) => (
              <InterviewStructureCard 
                key={structure.id} 
                {...structure}
                interviewCategory="job"
                usageCount={structure.usageCount || 0}
                createdAt={structure.createdAt}
              />
            ))
          ) : (
            <EmptyState 
              title="No job opportunities available"
              description="Check back soon for new job openings and interview opportunities from top companies."
            />
          )}
        </div>
      </section>
    </>
  )
}

export default page