'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

interface InterviewGenerationLoaderProps {
  user: User;
  structureId: string;
}

const InterviewGenerationLoader = ({ user, structureId }: InterviewGenerationLoaderProps) => {
  const router = useRouter();
  const [loadingStage, setLoadingStage] = useState(1);
  const [loadingText, setLoadingText] = useState('Fetching interview structure...');

  const loadingStagesData = [
    { stage: 1, text: 'Fetching interview structure...', duration: 2000 },
    { stage: 2, text: 'Analyzing your profile...', duration: 3000 },
    { stage: 3, text: 'Generating personalized questions...', duration: 4000 },
    { stage: 4, text: 'Setting up your interview...', duration: 2000 },
    { stage: 5, text: 'Almost ready...', duration: 1000 }
  ];

  useEffect(() => {
    const loadingStages = [
      { stage: 1, text: 'Fetching interview structure...', duration: 2000 },
      { stage: 2, text: 'Analyzing your profile...', duration: 3000 },
      { stage: 3, text: 'Generating personalized questions...', duration: 4000 },
      { stage: 4, text: 'Setting up your interview...', duration: 2000 },
      { stage: 5, text: 'Almost ready...', duration: 1000 }
    ];

    const generateInterview = async () => {
      try {
        // Simulate loading stages
        for (const { stage, text, duration } of loadingStages) {
          setLoadingStage(stage);
          setLoadingText(text);
          await new Promise(resolve => setTimeout(resolve, duration));
        }

        // Actually generate the interview
        const response = await fetch('/api/vapi/take-interview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            structureId,
            userId: user.id,
            generatePersonalized: true,
          }),
        });

        const data = await response.json();

        if (data.success) {
          toast.success('Interview generated successfully!');
          router.push(`/interview/${data.interviewId}`);
        } else {
          toast.error(data.error || 'Failed to generate interview');
          router.push('/');
        }
      } catch (error) {
        console.error('Error generating interview:', error);
        toast.error('An error occurred while generating the interview');
        router.push('/');
      }
    };

    generateInterview();
  }, [structureId, user.id, router]);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-gradient-to-br from-dark-300 via-dark-200/90 to-dark-300 rounded-2xl border border-dark-100 p-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-100 mb-4">
            Generating Your Interview
          </h1>
          <p className="text-primary-300 text-lg">
            Please wait while we create a personalized interview experience for you
          </p>
        </div>

        {/* Loading Animation */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Image
              src="/ai-avatar.png"
              alt="AI Assistant"
              width={128}
              height={128}
              className="rounded-full animate-pulse"
            />
            <div className="absolute inset-0 border-4 border-primary-200/30 rounded-full animate-spin border-t-primary-200"></div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary-100">
              {loadingText}
            </h3>
            
            {/* Progress Bar */}
            <div className="w-full bg-dark-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-300 to-primary-200 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(loadingStage / loadingStagesData.length) * 100}%` }}
              ></div>
            </div>
            
            <p className="text-primary-400 text-sm">
              Stage {loadingStage} of {loadingStagesData.length}
            </p>
          </div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-3">
          {loadingStagesData.map(({ stage, text }) => (
            <div 
              key={stage}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                stage <= loadingStage 
                  ? 'bg-primary-200/20 text-primary-100' 
                  : 'bg-dark-100/30 text-primary-400'
              }`}
            >
              <span className="text-sm">{text}</span>
              <div className={`w-4 h-4 rounded-full ${
                stage < loadingStage 
                  ? 'bg-green-500' 
                  : stage === loadingStage 
                    ? 'bg-primary-200 animate-pulse' 
                    : 'bg-dark-100'
              }`}></div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-blue-600 mt-0.5">
              💡
            </div>
            <div className="text-left">
              <h4 className="text-blue-800 font-medium mb-1">What&apos;s happening?</h4>
              <p className="text-blue-700 text-sm">
                Our AI is analyzing your profile and the interview structure to create questions that are 
                specifically tailored to your background, skills, and experience level. This ensures a 
                realistic and relevant interview experience.
              </p>
            </div>
          </div>
        </div>

        {/* Don't close warning */}
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm font-medium">
            ⚠️ Please don&apos;t close this page while your interview is being generated
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewGenerationLoader;
