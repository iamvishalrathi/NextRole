import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { checkProfileCompletion } from '@/lib/actions/general.actions'
import InterviewGenerationLoader from '@/components/InterviewGenerationLoader'

interface GenerateInterviewPageProps {
  searchParams: {
    structureId?: string;
    confirmed?: string;
  }
}

const GenerateInterviewPage = async ({ searchParams }: GenerateInterviewPageProps) => {
  const user = await getCurrentUser();
  
  // Redirect if not authenticated
  if (!user) {
    redirect('/sign-in');
  }

  // Check if profile is completed
  const isProfileCompleted = await checkProfileCompletion(user.id);
  
  if (!isProfileCompleted) {
    redirect(`/user/${user.id}/profile/complete`);
  }

  // Check if structureId and confirmation are provided
  if (!searchParams.structureId || !searchParams.confirmed) {
    redirect('/');
  }

  return (
    <div className="w-full mx-auto py-12 px-4 bg-dark-300 min-h-screen">
      <InterviewGenerationLoader 
        user={user} 
        structureId={searchParams.structureId}
      />
    </div>
  )
}

export default GenerateInterviewPage
