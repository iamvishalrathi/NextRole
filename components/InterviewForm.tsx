'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Info, ChevronLeft, ChevronRight } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

// Base schema with common fields
const baseSchema = z.object({
  interviewCategory: z.enum(['mock', 'job']),
  role: z.string().min(2, { message: 'Role is required' }),
  level: z.enum(['entry', 'mid', 'senior'], {
    required_error: 'Please select an experience level',
  }),
  type: z.enum(['behavioural', 'technical', 'mixed'], {
    required_error: 'Please select an interview type',
  }),
  techstack: z.string().min(2, { message: 'Tech stack is required' }),
  amount: z.coerce
    .number()
    .min(1, { message: 'Minimum 1 question required' })
    .max(20, { message: 'Maximum 20 questions allowed' }),
  visibility: z.boolean(),
  confirmationChecked: z.boolean().refine((val) => val === true, {
    message: 'You must confirm that all information is correct and reviewed',
  }),
});

// Job-specific fields schema
const jobSchema = z.object({
  jobTitle: z.string().min(2, { message: 'Job title is required' }),
  responsibilities: z.string().min(10, { message: 'Responsibilities must be at least 10 characters' }),
  ctc: z.string().min(1, { message: 'CTC is required' }),
  location: z.string().min(2, { message: 'Location is required' }),
  designation: z.string().min(2, { message: 'Designation is required' }),
});

// Combined schema using discriminated union
const formSchema = z.discriminatedUnion('interviewCategory', [
  baseSchema.extend({
    interviewCategory: z.literal('mock'),
    jobTitle: z.string().optional(),
    responsibilities: z.string().optional(),
    ctc: z.string().optional(),
    location: z.string().optional(),
    designation: z.string().optional(),
  }),
  baseSchema.extend({
    interviewCategory: z.literal('job'),
  }).merge(jobSchema),
]);

type FormValues = z.infer<typeof formSchema>;

interface InterviewFormProps {
  user: User;
}

const InterviewForm = ({ user }: InterviewFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewCategory, setInterviewCategory] = useState<'mock' | 'job'>('mock');
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(4);
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questionsFinalized, setQuestionsFinalized] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [tempQuestionText, setTempQuestionText] = useState('');
  
  const isRecruiter = user.isRecruiter;
  
  // Initialize the form with proper default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interviewCategory: 'mock',
      role: '',
      level: 'mid',
      type: 'mixed',
      techstack: '',
      amount: 5,
      visibility: false,
      confirmationChecked: false,
      jobTitle: '',
      responsibilities: '',
      ctc: '',
      location: '',
      designation: '',
    },
  });

  // Handle interview category change
  const handleCategoryChange = (category: 'mock' | 'job') => {
    setInterviewCategory(category);
    // Update the form with the new category
    form.setValue('interviewCategory', category);
    
    // Clear job-specific fields when switching to mock
    if (category === 'mock') {
      form.setValue('jobTitle', '');
      form.setValue('responsibilities', '');
      form.setValue('ctc', '');
      form.setValue('location', '');
      form.setValue('designation', '');
    }
    
    // Reset questions when category changes
    setGeneratedQuestions([]);
    setQuestionsFinalized(false);
  };

  // Generate questions function
  const generateQuestions = async () => {
    const formData = form.getValues();
    
    // Validate required fields for question generation
    const requiredFields: (keyof FormValues)[] = ['role', 'level', 'type', 'techstack', 'amount'];
    const isValid = await form.trigger(requiredFields);
    
    if (!isValid) {
      toast.error('Please fill in all required fields before generating questions');
      return;
    }

    setIsGeneratingQuestions(true);
    setQuestionsFinalized(false);
    
    try {
      const response = await fetch('/api/vapi/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userid: user.id,
        }),
      });

      const data = await response.json();

      if (data.success && data.questions) {
        setGeneratedQuestions(data.questions);
        toast.success('Questions generated successfully!');
      } else {
        toast.error('Failed to generate questions. Please try again.');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('An error occurred while generating questions.');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Regenerate questions
  const regenerateQuestions = async () => {
    await generateQuestions();
  };

  // Edit question
  const startEditingQuestion = (index: number) => {
    setEditingQuestion(index);
    setTempQuestionText(generatedQuestions[index]);
  };

  // Save edited question
  const saveEditedQuestion = () => {
    if (editingQuestion !== null && tempQuestionText.trim()) {
      const updatedQuestions = [...generatedQuestions];
      updatedQuestions[editingQuestion] = tempQuestionText.trim();
      setGeneratedQuestions(updatedQuestions);
      setEditingQuestion(null);
      setTempQuestionText('');
      toast.success('Question updated successfully!');
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingQuestion(null);
    setTempQuestionText('');
  };

  // Delete question
  const deleteQuestion = (index: number) => {
    const updatedQuestions = generatedQuestions.filter((_, i) => i !== index);
    setGeneratedQuestions(updatedQuestions);
    // Update the amount field
    form.setValue('amount', updatedQuestions.length);
    toast.success('Question deleted successfully!');
  };

  // Finalize questions
  const finalizeQuestions = () => {
    if (generatedQuestions.length === 0) {
      toast.error('Please generate questions first');
      return;
    }
    setQuestionsFinalized(true);
    toast.success('Questions finalized! You can now proceed to the next step.');
  };

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validate current step before moving to next
  const validateStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  // Get fields to validate for each step
  const getFieldsForStep = (step: number): (keyof FormValues)[] => {
    switch (step) {
      case 1:
        return ['interviewCategory', ...(isRecruiter && interviewCategory === 'job' ? ['jobTitle', 'designation', 'ctc', 'location', 'responsibilities'] as (keyof FormValues)[] : [])];
      case 2:
        return ['role', 'level', 'type', 'techstack'];
      case 3:
        return ['amount'];
      case 4:
        return ['visibility', 'confirmationChecked'];
      default:
        return [];
    }
  };

  // Handle next step with validation
  const handleNextStep = async () => {
    // Special handling for step 3 - must have finalized questions
    if (currentStep === 3) {
      if (!questionsFinalized) {
        toast.error('Please finalize the questions before proceeding to the next step');
        return;
      }
    }
    
    const isValid = await validateStep();
    if (isValid) {
      nextStep();
    }
  };

  // Handle form submission - create the interview with finalized questions
  const onSubmit = async (values: FormValues) => {
    if (!user.id) {
      toast.error('You must be logged in to create an interview');
      return;
    }

    if (generatedQuestions.length === 0) {
      toast.error('Please generate and finalize questions before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/vapi/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          userid: user.id,
          questions: generatedQuestions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Interview created successfully!');
        router.push('/');
      } else {
        toast.error('Failed to create interview. Please try again.');
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[85%] mx-auto p-8 bg-gradient-to-br from-dark-300 via-dark-200/90 to-dark-300 rounded-2xl border border-dark-100 shadow-xl relative overflow-hidden" style={{ backgroundColor: 'rgba(103, 93, 146, 0.05)' }}>
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'var(--bg-pattern)' }}></div>
      
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-light-400 to-primary-100 rounded-t-2xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-primary-100 mb-2 text-center">Create Your Interview</h2>
        <p className="text-primary-300 text-center mb-8">Customize your interview experience with the options below</p>
        
        {/* Step Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    i + 1 <= currentStep 
                      ? 'bg-primary-200 text-dark-300' 
                      : 'bg-dark-100 text-primary-300'
                  }`}
                >
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div 
                    className={`w-12 h-0.5 mx-2 transition-all ${
                      i + 1 < currentStep ? 'bg-primary-200' : 'bg-dark-100'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Titles */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-primary-100">
            {currentStep === 1 && 'Interview Details'}
            {currentStep === 2 && 'Technical Setup'}
            {currentStep === 3 && 'Question Configuration'}
            {currentStep === 4 && 'Review & Create'}
          </h3>
          <p className="text-primary-300 text-sm mt-1">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Step 1: Interview Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Interview Category Selection - Only show for recruiters */}
                {isRecruiter && (
                  <div className="p-6 bg-dark-100/30 rounded-xl border border-dark-100">
                    <h3 className="text-primary-100 text-lg font-medium mb-4">Interview Category</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label
                        className={`flex items-center justify-center space-x-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${interviewCategory === 'mock' ? 'border-primary-200 bg-dark-100/70' : 'border-dark-100 bg-dark-100/30 hover:bg-dark-100/50'}`}
                        onClick={() => handleCategoryChange('mock')}
                      >
                        <input
                          type="radio"
                          value="mock"
                          checked={interviewCategory === 'mock'}
                          onChange={() => handleCategoryChange('mock')}
                          className="h-5 w-5 text-primary-200 focus:ring-primary-200 hidden"
                        />
                        <div className="text-center">
                          <span className={`text-lg font-medium block ${interviewCategory === 'mock' ? 'text-primary-100' : 'text-primary-300'}`}>
                            Mock Interview
                          </span>
                          <span className="text-sm text-primary-400">Practice interview for skill development</span>
                        </div>
                      </label>
                      
                      <label
                        className={`flex items-center justify-center space-x-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${interviewCategory === 'job' ? 'border-primary-200 bg-dark-100/70' : 'border-dark-100 bg-dark-100/30 hover:bg-dark-100/50'}`}
                        onClick={() => handleCategoryChange('job')}
                      >
                        <input
                          type="radio"
                          value="job"
                          checked={interviewCategory === 'job'}
                          onChange={() => handleCategoryChange('job')}
                          className="h-5 w-5 text-primary-200 focus:ring-primary-200 hidden"
                        />
                        <div className="text-center">
                          <span className={`text-lg font-medium block ${interviewCategory === 'job' ? 'text-primary-100' : 'text-primary-300'}`}>
                            Job Interview
                          </span>
                          <span className="text-sm text-primary-400">Actual job opening with requirements</span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Show category info for candidates */}
                {!isRecruiter && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-600" />
                      <span className="text-blue-800 font-medium">Mock Interview</span>
                    </div>
                    <p className="text-blue-700 text-sm mt-1">
                      As a candidate, you can create mock interviews to practice and improve your interview skills.
                    </p>
                  </div>
                )}

                {/* Job-specific fields for recruiters creating job interviews */}
                {isRecruiter && interviewCategory === 'job' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-primary-100">Job Details</h3>
                    
                    {/* Job Title */}
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary-100 text-lg font-medium">Job Title</FormLabel>
                          <FormControl>
                            <Input 
                              className="bg-dark-100/50 border-dark-100 focus:border-primary-200 text-primary-100 h-12 rounded-xl" 
                              placeholder="e.g. Senior Frontend Developer" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-destructive-100" />
                        </FormItem>
                      )}
                    />

                    {/* Designation */}
                    <FormField
                      control={form.control}
                      name="designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary-100 text-lg font-medium">Designation</FormLabel>
                          <FormControl>
                            <Input 
                              className="bg-dark-100/50 border-dark-100 focus:border-primary-200 text-primary-100 h-12 rounded-xl" 
                              placeholder="e.g. Software Engineer III" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-destructive-100" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* CTC */}
                      <FormField
                        control={form.control}
                        name="ctc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary-100 text-lg font-medium">CTC (Annual)</FormLabel>
                            <FormControl>
                              <Input 
                                className="bg-dark-100/50 border-dark-100 focus:border-primary-200 text-primary-100 h-12 rounded-xl" 
                                placeholder="e.g. 12-15 LPA" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-destructive-100" />
                          </FormItem>
                        )}
                      />

                      {/* Location */}
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary-100 text-lg font-medium">Location</FormLabel>
                            <FormControl>
                              <Input 
                                className="bg-dark-100/50 border-dark-100 focus:border-primary-200 text-primary-100 h-12 rounded-xl" 
                                placeholder="e.g. Bangalore, Remote" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-destructive-100" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Responsibilities */}
                    <FormField
                      control={form.control}
                      name="responsibilities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary-100 text-lg font-medium">Key Responsibilities</FormLabel>
                          <FormControl>
                            <Textarea 
                              className="bg-dark-100/50 border-dark-100 focus:border-primary-200 text-primary-100 rounded-xl min-h-[120px]" 
                              placeholder="Describe the key responsibilities and requirements for this role..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-destructive-100" />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Technical Setup */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Role Field */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-100 text-lg font-medium">
                        {interviewCategory === 'job' ? 'Interview Focus Role' : 'Job Role'}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          className="bg-dark-100/50 border-dark-100 focus:border-primary-200 text-primary-100 h-12 rounded-xl" 
                          placeholder="e.g. Frontend Developer" 
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-sm text-primary-300 mt-2">
                        {interviewCategory === 'job' 
                          ? 'Role focus for interview questions (can be same as job title)' 
                          : 'The role you want to practice for'
                        }
                      </p>
                      <FormMessage className="text-destructive-100" />
                    </FormItem>
                  )}
                />

                {/* Experience Level Field */}
                <FormItem className="space-y-4">
                  <FormLabel className="text-primary-100 text-lg font-medium">Experience Level</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['entry', 'mid', 'senior'].map((level) => (
                      <label
                        key={level}
                        className={`flex items-center justify-center space-x-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${form.watch('level') === level ? 'border-primary-200 bg-dark-100/70' : 'border-dark-100 bg-dark-100/30 hover:bg-dark-100/50'}`}
                      >
                        <input
                          type="radio"
                          value={level}
                          {...form.register('level')}
                          className="h-5 w-5 text-primary-200 focus:ring-primary-200 hidden"
                        />
                        <span className={`text-lg capitalize ${form.watch('level') === level ? 'text-primary-100 font-medium' : 'text-primary-300'}`}>
                          {level === 'entry' ? 'Entry Level' : level === 'mid' ? 'Mid Level' : 'Senior Level'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {form.formState.errors.level && (
                    <p className="text-destructive-100 text-sm">{form.formState.errors.level.message}</p>
                  )}
                </FormItem>

                {/* Interview Type Field */}
                <FormItem className="space-y-4">
                  <FormLabel className="text-primary-100 text-lg font-medium">Interview Type</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['behavioural', 'technical', 'mixed'].map((type) => (
                      <label
                        key={type}
                        className={`flex items-center justify-center space-x-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${form.watch('type') === type ? 'border-primary-200 bg-dark-100/70' : 'border-dark-100 bg-dark-100/30 hover:bg-dark-100/50'}`}
                      >
                        <input
                          type="radio"
                          value={type}
                          {...form.register('type')}
                          className="h-5 w-5 text-primary-200 focus:ring-primary-200 hidden"
                        />
                        <span className={`text-lg capitalize ${form.watch('type') === type ? 'text-primary-100 font-medium' : 'text-primary-300'}`}>
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                  {form.formState.errors.type && (
                    <p className="text-destructive-100 text-sm">{form.formState.errors.type.message}</p>
                  )}
                </FormItem>

                {/* Tech Stack Field */}
                <FormField
                  control={form.control}
                  name="techstack"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-100 text-lg font-medium">Tech Stack</FormLabel>
                      <FormControl>
                        <Input 
                          className="bg-dark-100/50 border-dark-100 focus:border-primary-200 text-primary-100 h-12 rounded-xl" 
                          placeholder="e.g. React, Node.js, MongoDB" 
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-sm text-primary-300 mt-2 flex items-center gap-2">
                        <Info size={16} />
                        Separate technologies with commas
                      </p>
                      <FormMessage className="text-destructive-100" />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Question Configuration */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Number of Questions Field */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-100 text-lg font-medium">Number of Questions</FormLabel>
                      <div className="flex items-center space-x-4">
                        <FormControl>
                          <Input 
                            type="number" 
                            className="bg-dark-100/50 border-dark-100 focus:border-primary-200 text-primary-100 h-12 rounded-xl w-24 text-center" 
                            min={1} 
                            max={20} 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              // Reset questions when amount changes
                              if (generatedQuestions.length > 0) {
                                setGeneratedQuestions([]);
                                setQuestionsFinalized(false);
                              }
                            }}
                          />
                        </FormControl>
                        <div className="flex-1 h-2 bg-dark-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary-200 to-primary-100" 
                            style={{ width: `${(field.value / 20) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-primary-300 w-16 text-right">Max: 20</span>
                      </div>
                      <FormMessage className="text-destructive-100" />
                    </FormItem>
                  )}
                />

                {/* Generate Questions Button */}
                <div className="flex justify-center">
                  <Button 
                    type="button"
                    onClick={generateQuestions}
                    disabled={isGeneratingQuestions}
                    className="px-8 py-3 text-dark-300 font-bold transition-all hover:shadow-lg hover:shadow-primary-200/30"
                    style={{
                      background: 'linear-gradient(90deg, #cac5fe 0%, #8a82d8 50%, #dddfff 100%)',
                      backgroundSize: '200% 100%',
                      animation: 'gradientShift 3s ease infinite',
                    }}
                  >
                    {isGeneratingQuestions ? 'Generating Questions...' : 'Generate Questions'}
                  </Button>
                </div>

                {/* Generated Questions */}
                {generatedQuestions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-primary-100">Generated Questions</h3>
                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={regenerateQuestions}
                          disabled={isGeneratingQuestions}
                          className="text-primary-100 border-primary-200 hover:bg-primary-200/10"
                        >
                          Regenerate All
                        </Button>
                        {!questionsFinalized && (
                          <Button 
                            type="button"
                            onClick={finalizeQuestions}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Finalize Questions
                          </Button>
                        )}
                      </div>
                    </div>

                    {questionsFinalized && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-800 font-medium">Questions Finalized</span>
                        </div>
                        <p className="text-green-700 text-sm mt-1">
                          You can now proceed to the next step or continue editing if needed.
                        </p>
                      </div>
                    )}

                    <div className="space-y-3">
                      {generatedQuestions.map((question, index) => (
                        <div key={index} className="p-4 bg-dark-100/30 rounded-lg border border-dark-100">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-primary-200 font-medium">Q{index + 1}.</span>
                                {questionsFinalized && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    Finalized
                                  </span>
                                )}
                              </div>
                              
                              {editingQuestion === index ? (
                                <div className="space-y-2">
                                  <Textarea
                                    value={tempQuestionText}
                                    onChange={(e) => setTempQuestionText(e.target.value)}
                                    className="bg-dark-100/50 border-dark-100 focus:border-primary-200 text-primary-100 rounded-lg"
                                    rows={3}
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={saveEditedQuestion}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={cancelEditing}
                                      className="text-primary-100 border-primary-200"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-primary-100 leading-relaxed">{question}</p>
                              )}
                            </div>
                            
                            {editingQuestion !== index && !questionsFinalized && (
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => startEditingQuestion(index)}
                                  className="text-primary-100 border-primary-200 hover:bg-primary-200/10"
                                >
                                  Edit
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteQuestion(index)}
                                  className="text-red-400 border-red-400 hover:bg-red-400/10"
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review & Create */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* Interview Summary */}
                <div className="p-6 bg-dark-100/30 rounded-xl border border-dark-100">
                  <h3 className="text-xl font-semibold text-primary-100 mb-4">Interview Summary</h3>
                  
                  {/* Basic Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-primary-200 font-medium mb-2">Category</h4>
                        <p className="text-primary-100 capitalize">
                          {form.watch('interviewCategory') === 'mock' ? 'Mock Interview' : 'Job Interview'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-primary-200 font-medium mb-2">Role</h4>
                        <p className="text-primary-100">{form.watch('role')}</p>
                      </div>
                      <div>
                        <h4 className="text-primary-200 font-medium mb-2">Experience Level</h4>
                        <p className="text-primary-100 capitalize">
                          {form.watch('level') === 'entry' ? 'Entry Level' : 
                           form.watch('level') === 'mid' ? 'Mid Level' : 'Senior Level'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-primary-200 font-medium mb-2">Interview Type</h4>
                        <p className="text-primary-100 capitalize">{form.watch('type')}</p>
                      </div>
                      <div>
                        <h4 className="text-primary-200 font-medium mb-2">Tech Stack</h4>
                        <p className="text-primary-100">{form.watch('techstack')}</p>
                      </div>
                      <div>
                        <h4 className="text-primary-200 font-medium mb-2">Questions</h4>
                        <p className="text-primary-100">{generatedQuestions.length} questions generated</p>
                      </div>
                    </div>

                    {/* Job-specific details for job interviews */}
                    {form.watch('interviewCategory') === 'job' && (
                      <div className="mt-6 pt-4 border-t border-dark-100">
                        <h4 className="text-primary-200 font-medium mb-3">Job Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-primary-300 text-sm mb-1">Job Title</h5>
                            <p className="text-primary-100">{form.watch('jobTitle')}</p>
                          </div>
                          <div>
                            <h5 className="text-primary-300 text-sm mb-1">Designation</h5>
                            <p className="text-primary-100">{form.watch('designation')}</p>
                          </div>
                          <div>
                            <h5 className="text-primary-300 text-sm mb-1">CTC</h5>
                            <p className="text-primary-100">{form.watch('ctc')}</p>
                          </div>
                          <div>
                            <h5 className="text-primary-300 text-sm mb-1">Location</h5>
                            <p className="text-primary-100">{form.watch('location')}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h5 className="text-primary-300 text-sm mb-1">Key Responsibilities</h5>
                          <p className="text-primary-100 text-sm leading-relaxed">{form.watch('responsibilities')}</p>
                        </div>
                      </div>
                    )}

                    {/* Questions Preview */}
                    <div className="mt-6 pt-4 border-t border-dark-100">
                      <h4 className="text-primary-200 font-medium mb-3">Questions Preview</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {generatedQuestions.slice(0, 3).map((question, index) => (
                          <div key={index} className="p-3 bg-dark-100/50 rounded-lg">
                            <p className="text-primary-100 text-sm">
                              <span className="text-primary-200 font-medium">Q{index + 1}.</span> {question}
                            </p>
                          </div>
                        ))}
                        {generatedQuestions.length > 3 && (
                          <div className="p-3 bg-dark-100/50 rounded-lg text-center">
                            <p className="text-primary-300 text-sm">
                              ... and {generatedQuestions.length - 3} more questions
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visibility Settings */}
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl p-4 border border-dark-100 bg-dark-100/30 transition-all duration-300 hover:border-primary-200/50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-primary-100 text-lg font-medium">
                          {field.value ? "Public Interview" : "Private Interview"}
                        </FormLabel>
                        <p className="text-sm text-primary-300">
                          {field.value 
                            ? "This interview will be visible to other users" 
                            : "This interview will only be visible to you"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium transition-colors ${field.value ? "text-success-100" : "text-destructive-100"}`}>
                          {field.value ? "Public" : "Private"}
                        </span>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className={`data-[state=checked]:bg-primary-200 ${field.value ? "bg-success-100/20" : "bg-destructive-100/20"}`}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Confirmation Checkbox */}
                <FormField
                  control={form.control}
                  name="confirmationChecked"
                  render={({ field }) => (
                    <FormItem className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </FormControl>
                        <div className="flex-1">
                          <FormLabel className="text-yellow-800 font-medium cursor-pointer">
                            All information provided is correct and reviewed and cannot be reverted
                          </FormLabel>
                          <p className="text-yellow-700 text-sm mt-1">
                            By checking this box, you confirm that you have reviewed all the information provided and understand that once the interview is created, changes cannot be made to the core details.
                          </p>
                        </div>
                      </div>
                      <FormMessage className="text-red-600 mt-2" />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8">
              <Button 
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 bg-dark-100/50 border-dark-100 text-primary-100 hover:bg-dark-100/70 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button 
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-6 py-3 text-dark-300 font-bold transition-all hover:shadow-lg hover:shadow-primary-200/30"
                  style={{
                    background: 'linear-gradient(90deg, #cac5fe 0%, #8a82d8 50%, #dddfff 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'gradientShift 3s ease infinite',
                  }}
                >
                  Next
                  <ChevronRight size={20} />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="flex items-center gap-2 px-6 py-3 text-dark-300 font-bold transition-all hover:shadow-lg hover:shadow-primary-200/30 relative overflow-hidden group" 
                  disabled={isSubmitting}
                  style={{
                    background: 'linear-gradient(90deg, #cac5fe 0%, #8a82d8 50%, #dddfff 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'gradientShift 3s ease infinite',
                  }}
                >
                  <style jsx>{`
                    @keyframes gradientShift {
                      0% { background-position: 0% 50%; }
                      50% { background-position: 100% 50%; }
                      100% { background-position: 0% 50%; }
                    }
                  `}</style>
                  <span className="relative z-10 group-hover:scale-105 transition-transform duration-300 inline-block">
                    {isSubmitting ? 'Creating Interview...' : 'Create Interview'}
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-white"></div>
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InterviewForm;