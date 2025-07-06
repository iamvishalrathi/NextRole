'use client'

import React, { useMemo } from 'react'
import InterviewStructureCard from '@/components/InterviewStructureCard'
import DiscoverEmptyState from './DiscoverEmptyState'
import ResultsStats from './ResultsStats'

interface InterviewStructure {
  id: string
  role: string
  level: string
  type: string
  techstack: string[]
  compulsoryQuestions: number
  personalizedQuestions: number
  usageCount?: number
  createdAt: string
  jobTitle?: string
  location?: string
  ctc?: string
  interviewCategory: 'mock' | 'job'
}

interface InterviewGridProps {
  interviews: InterviewStructure[]
  searchParams: {
    search?: string
    category?: 'mock' | 'job' | 'all'
    type?: 'technical' | 'behavioral' | 'mixed' | 'all'
    level?: 'entry' | 'mid' | 'senior' | 'all'
  }
}

const InterviewGrid = ({ interviews, searchParams }: InterviewGridProps) => {
  const filteredInterviews = useMemo(() => {
    let filtered = interviews

    // Filter by search term
    if (searchParams.search) {
      const searchTerm = searchParams.search.toLowerCase()
      filtered = filtered.filter(interview => 
        interview.role.toLowerCase().includes(searchTerm) ||
        interview.type.toLowerCase().includes(searchTerm) ||
        interview.level.toLowerCase().includes(searchTerm) ||
        interview.techstack.some(tech => tech.toLowerCase().includes(searchTerm)) ||
        (interview.jobTitle && interview.jobTitle.toLowerCase().includes(searchTerm)) ||
        (interview.location && interview.location.toLowerCase().includes(searchTerm))
      )
    }

    // Filter by category
    if (searchParams.category && searchParams.category !== 'all') {
      filtered = filtered.filter(interview => 
        interview.interviewCategory === searchParams.category
      )
    }

    // Filter by type
    if (searchParams.type && searchParams.type !== 'all') {
      filtered = filtered.filter(interview => 
        interview.type.toLowerCase() === searchParams.type
      )
    }

    // Filter by level
    if (searchParams.level && searchParams.level !== 'all') {
      filtered = filtered.filter(interview => 
        interview.level.toLowerCase() === searchParams.level
      )
    }

    return filtered
  }, [interviews, searchParams])

  return (
    <div>
      <ResultsStats 
        filteredCount={filteredInterviews.length}
        totalCount={interviews.length}
        filters={searchParams}
      />
      
      {filteredInterviews.length === 0 ? (
        <div className="card-border w-full">
          <div className="dark-gradient rounded-2xl p-8">
            <DiscoverEmptyState 
              title="No interviews found"
              description="Try adjusting your filters or search criteria to find more interviews."
            />
          </div>
        </div>
      ) : (
        <div className="interviews-section">
          {filteredInterviews.map((interview) => (
            <InterviewStructureCard
              key={interview.id}
              id={interview.id}
              role={interview.role}
              level={interview.level}
              type={interview.type}
              techstack={interview.techstack}
              interviewCategory={interview.interviewCategory}
              compulsoryQuestions={interview.compulsoryQuestions}
              personalizedQuestions={interview.personalizedQuestions}
              usageCount={interview.usageCount || 0}
              createdAt={interview.createdAt}
              jobTitle={interview.jobTitle}
              location={interview.location}
              ctc={interview.ctc}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default InterviewGrid
