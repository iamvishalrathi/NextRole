interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
  userId?: string;
  userRating?: number;
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  categorizedQuestions?: {
    behavioral: string[];
    technical: string[];
  };
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
  visibility?: boolean; // Controls whether the interview is public (true) or private (false)
  interviewCategory?: 'mock' | 'job';
  jobTitle?: string;
  responsibilities?: string;
  ctc?: string;
  location?: string;
  designation?: string;
  // For actual interviews
  structureId?: string; // References the structure this interview was generated from
  personalizedForResume?: boolean;
  status?: 'ready' | 'in_progress' | 'completed';
}

interface InterviewStructure {
  id: string;
  role: string;
  level: string;
  templateQuestions: string[];
  categorizedQuestions?: {
    behavioral: string[];
    technical: string[];
  };
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  visibility?: boolean;
  interviewCategory?: 'mock' | 'job';
  jobTitle?: string;
  responsibilities?: string;
  ctc?: string;
  location?: string;
  designation?: string;
  // Structure metadata
  isTemplate: true;
  questionCount: number;
  compulsoryQuestions: number;
  personalizedQuestions: number;
  personalizedQuestionPrompt?: string;
  usageCount: number;
  lastUsed?: string;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
  avatarColor?: string;
  isRecruiter: boolean;
}

interface InterviewCardProps {
  id?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
}

interface AgentProps {
  userInitial: string;
  avatarColor: string;
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
  isRecruiter: boolean;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}
