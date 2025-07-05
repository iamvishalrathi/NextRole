import React from 'react'

import { Button } from '@/components/ui/button'
import Image from "next/image"
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser } from '@/lib/actions/auth.action'
import ProfileCheckWrapper from '@/components/ProfileCheckWrapper'

import {getInterviewByUserId, getLatestInterviews} from '@/lib/actions/general.actions'

const page = async () => {
  
  const user = await getCurrentUser();

  if (!user) {
    return <div>Please sign in to view interviews</div>;
  }

  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewByUserId(user.id),
    getLatestInterviews({userId: user.id})
  ])

  // console.log(userInterviews);
  // console.log(latestInterviews);

  const hasPastInterviews = userInterviews && userInterviews.length > 0;
  const hasUpcomingInterviews = latestInterviews && latestInterviews.length > 0;

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

      
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interviews</h2>
        <div className='interviews-section'>
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
              <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>
        <div className='interviews-section'>
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p>There are no new interviews available</p>
          )}
        </div>
      </section>
    </>
  )
}

export default page