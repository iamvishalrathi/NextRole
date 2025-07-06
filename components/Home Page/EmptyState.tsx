import React from 'react'
import Image from "next/image"
import { Button } from '@/components/ui/button'
import ProfileCheckWrapper from '@/components/ProfileCheckWrapper'

interface EmptyStateProps {
  title: string
  showButton?: boolean
  userId?: string
  description?: string
}

const EmptyState = ({ title, showButton = false, userId, description }: EmptyStateProps) => (
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
)

export default EmptyState
