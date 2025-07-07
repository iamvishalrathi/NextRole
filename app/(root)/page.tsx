import React from 'react'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getPublicInterviewStructures } from '@/lib/actions/general.actions'
import { HeroSection, InterviewSection } from '@/components/home'

const page = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Please sign in to view interviews</div>;
  }

  const publicStructures = await getPublicInterviewStructures(6, 6); // Limit to 6 each for better UI

  return (
    <>
      {/* Hero Section */}
      <HeroSection userId={user.id} />

      {/* Mock Interview Section */}
      <InterviewSection
        title="Practice Mock Interviews"
        interviews={publicStructures.mockStructures || []}
        interviewCategory="mock"
        userId={user.id}
        emptyStateTitle="No practice sessions available"
        emptyStateDescription="Start practicing with mock interviews to build confidence and improve your interview skills."
        showCreateButton={true}
      />

      {/* Job Interview Section */}
      <InterviewSection
        title="Active Job Interviews"
        interviews={publicStructures.jobStructures || []}
        interviewCategory="job"
        emptyStateTitle="No job opportunities available"
        emptyStateDescription="Check back soon for new job openings and interview opportunities from top companies."
        showCreateButton={false}
      />
    </>
  )
}

export default page