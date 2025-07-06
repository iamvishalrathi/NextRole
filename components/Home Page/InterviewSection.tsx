import React from 'react'
import InterviewStructureCard from '@/components/InterviewStructureCard'
import EmptyState from './EmptyState'

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
}

interface InterviewSectionProps {
  title: string
  subtitle?: string
  interviews: InterviewStructure[]
  interviewCategory: 'mock' | 'job'
  userId?: string
  emptyStateTitle: string
  emptyStateDescription: string
  showCreateButton?: boolean
}

const InterviewSection = ({
  title,
  subtitle,
  interviews,
  interviewCategory,
  userId,
  emptyStateTitle,
  emptyStateDescription,
  showCreateButton = false
}: InterviewSectionProps) => {
  const hasInterviews = interviews && interviews.length > 0

  return (
    <section className='flex flex-col gap-6 mt-8'>
      <div className="flex items-center justify-between">
        <h2>{title}</h2>
        {subtitle && <p className="text-primary-300 text-sm">{subtitle}</p>}
      </div>
      <div className='interviews-section'>
        {hasInterviews ? (
          interviews.map((structure) => (
            <InterviewStructureCard 
              key={structure.id} 
              {...structure}
              interviewCategory={interviewCategory}
              usageCount={structure.usageCount || 0}
              createdAt={structure.createdAt}
            />
          ))
        ) : (
          <EmptyState 
            title={emptyStateTitle}
            showButton={showCreateButton}
            userId={userId}
            description={emptyStateDescription}
          />
        )}
      </div>
    </section>
  )
}

export default InterviewSection
