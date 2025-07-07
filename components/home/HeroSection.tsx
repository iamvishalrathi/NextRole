import React from 'react'
import { Button } from '@/components/ui/button'
import Image from "next/image"
import ProfileCheckWrapper from '@/components/shared/ProfileCheckWrapper'

interface HeroSectionProps {
  userId: string
}

const HeroSection = ({ userId }: HeroSectionProps) => {
  return (
    <section className="card-cta">
      <div className="flex flex-col gap-6 max-w-lg">
        <h2>Ace Your Next Interview with AI</h2>
        <p className="text-lg">
          Upskill yourself with AI-powered mock interviews & get instant feedback, or take real job interviews for better opportunities
        </p>

        <ProfileCheckWrapper 
          userId={userId} 
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
  )
}

export default HeroSection
