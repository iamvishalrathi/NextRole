import React from 'react'

import { Button } from '@/components/ui/button'
import Image from "next/image"
import InterviewStructureCard from '@/components/InterviewStructureCard'
import { getCurrentUser } from '@/lib/actions/auth.action'
import ProfileCheckWrapper from '@/components/ProfileCheckWrapper'

import {getPublicInterviewStructures} from '@/lib/actions/general.actions'

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
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <ProfileCheckWrapper 
            userId={user.id} 
            targetUrl="/interview"
            className="max-sm:w-full"
          >
            <Button className="btn-primary max-sm:w-full">
              Create an Interview
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
          <h2>Mock Interview Practice</h2>
          <p className="text-primary-300 text-sm">Practice with realistic scenarios</p>
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
            <p className="text-primary-400">No mock interview structures available at the moment</p>
          )}
        </div>
      </section>

      {/* Public Job Interview Structures */}
      <section className='flex flex-col gap-6 mt-8'>
        <div className="flex items-center justify-between">
          <h2>Job Interview Preparation</h2>
          <p className="text-primary-300 text-sm">Prepare for real job opportunities</p>
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
            <p className="text-primary-400">No job interview structures available at the moment</p>
          )}
        </div>
      </section>
    </>
  )
}

export default page