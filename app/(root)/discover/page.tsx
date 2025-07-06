import React from 'react'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getPublicInterviewStructures } from '@/lib/actions/general.actions'
import SearchFilters from '@/components/Discover/SearchFilters'
import InterviewGrid from '@/components/Discover/InterviewGrid'

interface SearchParams {
  search?: string
  category?: 'mock' | 'job' | 'all'
  type?: 'technical' | 'behavioral' | 'mixed' | 'all'
  level?: 'entry' | 'mid' | 'senior' | 'all'
}

const DiscoverPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const user = await getCurrentUser()

  if (!user) {
    return <div>Please sign in to view interviews</div>
  }

  // Get all public interview structures (no limit for discover page)
  const publicStructures = await getPublicInterviewStructures(100, 100)

  // Combine mock and job interviews
  const allInterviews = [
    ...(publicStructures.mockStructures || []).map(interview => ({
      ...interview,
      interviewCategory: 'mock' as const
    })),
    ...(publicStructures.jobStructures || []).map(interview => ({
      ...interview,
      interviewCategory: 'job' as const
    }))
  ]

  return (
    <div className="pattern">
      <SearchFilters 
        searchParams={searchParams}
        totalCount={allInterviews.length}
      />

      <InterviewGrid 
        interviews={allInterviews}
        searchParams={searchParams}
      />
    </div>
  )
}

export default DiscoverPage
