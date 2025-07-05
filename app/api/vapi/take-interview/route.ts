import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function POST(request: Request) {
    try {
        const { structureId, userId, resume, generatePersonalized } = await request.json();

        console.log("Generating personalized interview for user:", userId, "from structure:", structureId);

        // Validate required fields
        if (!structureId || !userId) {
            return Response.json({
                success: false,
                error: 'Structure ID and User ID are required'
            }, { status: 400 });
        }

        // Get user profile if generatePersonalized is true
        let userProfile = null;
        if (generatePersonalized) {
            try {
                const profileDoc = await db.collection("profiles").doc(userId).get();
                if (profileDoc.exists) {
                    userProfile = profileDoc.data();
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                // Continue without profile data
            }
        }

        // Get the interview structure from the appropriate collection
        // First try mock, then job interview structures
        let structureDoc = await db.collection('mock_interview_structures').doc(structureId).get();
        let actualInterviewCategory = 'mock';
        
        if (!structureDoc.exists) {
            structureDoc = await db.collection('job_interview_structures').doc(structureId).get();
            actualInterviewCategory = 'job';
        }
        
        if (!structureDoc.exists) {
            return Response.json({
                success: false,
                error: 'Interview structure not found'
            }, { status: 404 });
        }

        const structure = structureDoc.data();
        
        if (!structure) {
            return Response.json({
                success: false,
                error: 'Invalid interview structure data'
            }, { status: 400 });
        }
        
        // Generate personalized questions based on resume, profile, and structure
        const profileData = userProfile ? `
USER PROFILE DATA:
- Current Role: ${userProfile.currentRole || 'Not specified'}
- Experience: ${userProfile.experience || 'Not specified'}
- Skills: ${userProfile.skills || 'Not specified'}
- Education: ${userProfile.education || 'Not specified'}
- Location: ${userProfile.location || 'Not specified'}
- Phone: ${userProfile.phone || 'Not specified'}
${userProfile.resume ? `
Resume/Background:
${userProfile.resume}
` : ''}
` : '';

        const { text: personalizedQuestions } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `Generate personalized interview questions based on the following:

INTERVIEW STRUCTURE:
- Role: ${structure.role}
- Experience Level: ${structure.level}
- Tech Stack: ${structure.techstack.join(', ')}
- Interview Type: ${structure.type}
- Question Count: ${structure.compulsoryQuestions + structure.personalizedQuestions}

${structure.interviewCategory === 'job' ? `
JOB DETAILS:
- Job Title: ${structure.jobTitle}
- Designation: ${structure.designation}
- Location: ${structure.location}
- CTC: ${structure.ctc}
- Responsibilities: ${structure.responsibilities}
` : ''}

${profileData}

${resume ? `
ADDITIONAL RESUME/PROFILE PROVIDED:
${resume}
` : ''}

TEMPLATE QUESTIONS FOR REFERENCE:
${structure.questions ? structure.questions.join('\n') : ''}

${structure.categorizedQuestions ? `
CATEGORIZED TEMPLATE QUESTIONS:
Behavioral: ${structure.categorizedQuestions.behavioral?.join('\n') || 'None'}
Technical: ${structure.categorizedQuestions.technical?.join('\n') || 'None'}
` : ''}

Instructions:
1. Generate exactly ${structure.compulsoryQuestions + structure.personalizedQuestions} questions
2. Make questions highly relevant to the candidate's experience, skills, and the job requirements
3. Use the user's profile data to create personalized questions about their specific background
4. Follow the interview type preference: ${structure.type}
5. Return questions in JSON format: {"questions": ["Question 1", "Question 2", ...]}
6. Do not use special characters that might break voice assistants
7. Make questions conversational and natural
8. Reference specific skills, experiences, or projects from their profile when possible

Generate personalized, relevant questions now:`,
        });

        // Parse the generated questions
        let questions;
        try {
            const parsed = JSON.parse(personalizedQuestions);
            questions = parsed.questions || [];
        } catch (parseError) {
            console.error('Error parsing generated questions:', parseError);
            // Fallback: try to extract questions from text
            questions = personalizedQuestions
                .split('\n')
                .filter(line => line.trim().length > 10)
                .slice(0, structure.compulsoryQuestions + structure.personalizedQuestions);
        }

        // Create the actual interview instance
        const actualInterview = {
            structureId,
            userId,
            
            // Copy structure data
            role: structure.role,
            level: structure.level,
            type: structure.type,
            techstack: structure.techstack,
            interviewCategory: actualInterviewCategory,
            
            // Personalized content
            questions,
            personalizedForResume: !!resume,
            
            // Interview metadata
            createdAt: new Date().toISOString(),
            status: 'ready', // ready, in_progress, completed
            coverImage: structure.coverImage || getRandomInterviewCover(),
            
            // Copy job-specific fields if applicable
            ...(actualInterviewCategory === 'job' ? {
                jobTitle: structure.jobTitle,
                responsibilities: structure.responsibilities,
                ctc: structure.ctc,
                location: structure.location,
                designation: structure.designation
            } : {})
        };

        // Save to actual interview collection
        const actualInterviewCollection = actualInterviewCategory === 'job' 
            ? 'job_interviews' 
            : 'mock_interviews';
            
        const interviewDoc = await db.collection(actualInterviewCollection).add(actualInterview);

        // Update structure usage count
        const structureCollection = actualInterviewCategory === 'job' 
            ? 'job_interview_structures' 
            : 'mock_interview_structures';
        
        await db.collection(structureCollection).doc(structureId).update({
            usageCount: (structure.usageCount || 0) + 1,
            lastUsed: new Date().toISOString()
        });

        return Response.json({
            success: true,
            interviewId: interviewDoc.id,
            questions,
            message: 'Personalized interview generated successfully!'
        }, { status: 200 });

    } catch (error) {
        console.error('Error generating personalized interview:', error);
        return Response.json({
            success: false,
            error: 'Failed to generate personalized interview'
        }, { status: 500 });
    }
}
